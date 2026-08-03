import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/i18n/config";

/**
 * Persists the visitor's language choice.
 *
 * Set from the server so the cookie carries the right path, lifetime and SameSite —
 * and so an unknown value can be rejected rather than written straight through from
 * whatever the client sent.
 */
export async function POST(request: Request) {
  let body: { locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!isLocale(body.locale)) {
    return NextResponse.json({ error: "Unknown locale." }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, locale: body.locale });
  res.cookies.set(LOCALE_COOKIE, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    // readable by nothing in particular, but there is no reason for scripts to touch it
    httpOnly: true,
  });
  return res;
}
