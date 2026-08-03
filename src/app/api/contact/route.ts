import { NextResponse } from "next/server";
import {
  enquiryHtml,
  enquirySubject,
  enquiryText,
  type Enquiry,
} from "@/lib/enquiryEmail";

/**
 * Contact form endpoint.
 *
 * Sends through Resend's HTTP API over plain fetch rather than an SDK — it is one
 * POST, and it keeps the dependency list (and the cold start) where it is.
 *
 * Configuration, all via environment variables so no credential is ever in the repo:
 *   RESEND_API_KEY      required — https://resend.com/api-keys
 *   CONTACT_TO_EMAIL    where enquiries land   (default info@nomadinvestments.co.ug)
 *   CONTACT_FROM_EMAIL  the verified sender    (default website@nomadinvestments.co.ug)
 *
 * The From address has to be on a domain verified in Resend; the enquirer's own
 * address goes in Reply-To instead, so hitting reply in the inbox answers them and
 * the message still passes SPF/DKIM.
 */

export const runtime = "nodejs";

const MAX = { name: 120, organisation: 160, email: 200, discipline: 120, message: 4000 };

/* One enquiry every 30s and 5 an hour from the same address. In-memory, so it resets
   on deploy and does not span instances — enough to blunt a bored script, and not a
   substitute for a real WAF rule if this ever gets targeted properly. */
const RATE = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (RATE.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= 5) return true;
  if (hits.length && now - hits[hits.length - 1] < 30_000) return true;
  hits.push(now);
  RATE.set(ip, hits);
  if (RATE.size > 5000) RATE.clear();
  return false;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

/* Deliberately loose: the only thing worth rejecting here is something that plainly
   is not an address. Anything stricter starts refusing valid ones. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Bots fill every field they find; a real person never sees this one.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const enquiry: Enquiry = {
    name: clean(body.name, MAX.name),
    organisation: clean(body.organisation, MAX.organisation),
    email: clean(body.email, MAX.email),
    discipline: clean(body.discipline, MAX.discipline) || "General enquiry",
    // the brief keeps its line breaks, so only the ends are trimmed
    message:
      typeof body.message === "string" ? body.message.trim().slice(0, MAX.message) : "",
  };

  const missing = (["name", "email", "message"] as const).filter((k) => !enquiry[k]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!looksLikeEmail(enquiry.email)) {
    return NextResponse.json({ error: "That email address looks wrong." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries just now — please try again shortly." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "info@nomadinvestments.co.ug";
  const from = process.env.CONTACT_FROM_EMAIL || "website@nomadinvestments.co.ug";

  if (!apiKey) {
    // Loud on the server, vague to the browser: a visitor cannot fix this, and the
    // reason it failed is not their business.
    console.error("[contact] RESEND_API_KEY is not set — enquiry was not sent.");
    return NextResponse.json(
      { error: "The form is not connected yet. Please email info@nomadinvestments.co.ug." },
      { status: 503 }
    );
  }

  const receivedAt = new Date();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Nomad Investments Website <${from}>`,
        to: [to],
        reply_to: enquiry.email,
        subject: enquirySubject(enquiry),
        html: enquiryHtml(enquiry, receivedAt),
        text: enquiryText(enquiry, receivedAt),
      }),
    });

    if (!res.ok) {
      // never log the enquirer's details, only why the provider refused
      console.error("[contact] Resend rejected the send:", res.status, await res.text());
      return NextResponse.json(
        { error: "We could not send that just now. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] Could not reach the mail provider:", err);
    return NextResponse.json(
      { error: "We could not send that just now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
