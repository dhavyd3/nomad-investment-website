"use client";

import { useState } from "react";
import Brandmark from "@/components/Brandmark";

const SERVICES = [
  "ICT Consultancy, AI & Cybersecurity",
  "Engineering & Infrastructure",
  "Agricultural Services & Consultancy",
  "Business Consulting & Investor Relations",
  "Oil, Gas & Green Energy",
  "Environment & Green Energy",
  "Labour & Human Resource Management",
];

type State = "idle" | "sending" | "done";

/**
 * Terminal's form layout and button motion, Nomad's colours. The footer shares this
 * section's background so there is no seam between them — Vista's footer treatment.
 */
export default function ContactFooter() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", company: "", email: "", service: SERVICES[0], message: "" });

  /* 16px on phones is deliberate: iOS Safari zooms the whole page when a focused field
     is under 16px, which throws the layout off. Desktop keeps the intended 15px. */
  const field =
    "w-full border-0 border-b bg-transparent px-0 py-3 text-[16px] font-light text-white outline-none transition-colors placeholder:text-white/35 md:text-[15px]";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    // no backend wired yet — this proves the interaction, not delivery
    setTimeout(() => setState("done"), 900);
  };

  return (
    <section id="contact" data-nav-theme="dark" className="relative overflow-hidden" style={{ background: "var(--navy)" }}>
      {/* diagonal lead-in so this section is not separated by a straight line either */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[6vw]"
        style={{ background: "var(--ink)", clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" }}
      />

      <div className="wrap relative pt-[clamp(96px,16vh,190px)]">
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <div>
            <span className="t-mono block">Get in touch</span>
            <h2 className="t-h2 mt-6 max-w-[18ch]">Let&apos;s get the work done.</h2>
            <p className="t-body mt-6 max-w-[38ch]">
              Tell us what you need delivered and which discipline it sits in. We will come back to you
              from Kampala.
            </p>

            <dl className="mt-12 space-y-5">
              {[
                ["Office", "Plot 13, Mukwano Courts\nBuganda Road, Floor 4, Suite 401–402\nKampala, Uganda"],
                ["Telephone", "+256 (0) 414 675306"],
                ["WhatsApp", "+256 394 525152"],
                ["Email", "info@nomadinvestments.co.ug"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-mono">{k}</dt>
                  <dd className="t-body mt-1.5 whitespace-pre-line" style={{ color: "rgba(255,255,255,.72)" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <form onSubmit={onSubmit} className="grid gap-7">
            <div className="grid gap-7 sm:grid-cols-2">
              <label className="block">
                <span className="t-mono">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                  style={{ borderColor: "rgba(255,255,255,.22)" }}
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="t-mono">Organisation</span>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={field}
                  style={{ borderColor: "rgba(255,255,255,.22)" }}
                  placeholder="Company or ministry"
                />
              </label>
            </div>

            <label className="block">
              <span className="t-mono">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
                placeholder="you@organisation.com"
              />
            </label>

            <label className="block">
              <span className="t-mono">Discipline</span>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={`${field} cursor-pointer`}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
              >
                {SERVICES.map((s) => (
                  <option key={s} value={s} style={{ background: "var(--navy)" }}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="t-mono">Brief</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${field} resize-none`}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
                placeholder="What needs delivering?"
              />
            </label>

            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" className="btn btn-gold" disabled={state !== "idle"}>
                {state === "idle" ? "Send enquiry" : state === "sending" ? "Sending…" : "Received"}
                <span className="arrow">→</span>
              </button>
              {state === "done" && (
                <span className="t-mono" style={{ color: "var(--gold)" }}>
                  Demo only — not yet wired to a mailbox
                </span>
              )}
            </div>
          </form>
        </div>

        {/* ---------- footer, merged into the same background ---------- */}
        <footer className="mt-[clamp(80px,13vh,150px)] border-t border-white/12 pb-10 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              {/* nothing styles anchors inside this section, so the hover matches the
                  sibling links by hand */}
              <Brandmark
                size="compact"
                className="transition-colors hover:text-[var(--gold)]"
              />
              <p className="t-mono mt-5">Strategize · Organize · Globalize</p>
            </div>

            <nav className="flex flex-wrap gap-x-8 gap-y-3">
              {["About Us", "Our Services", "Contact Us"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase().replace(/\s+/g, "-").replace("about-us", "who-we-are").replace("our-services", "services").replace("contact-us", "contact")}`}
                  className="t-body block py-3 no-underline transition-colors hover:text-[var(--gold)] md:py-0"
                >
                  {l}
                </a>
              ))}
            </nav>
          </div>

          <p className="t-mono mt-10" style={{ color: "rgba(255,255,255,.32)" }}>
            © 2026 Nomad Investments Limited · Demo build · generated placeholder imagery · not for publication
          </p>
        </footer>
      </div>
    </section>
  );
}
