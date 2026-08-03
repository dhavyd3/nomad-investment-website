"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import en from "@/i18n/dictionaries/en";
import Brandmark from "@/components/Brandmark";

const DISCIPLINE_KEYS = [
  "businessConsulting", "investorRelations", "ictConsultancy", "cybersecurity",
  "transport", "clearing", "financial", "construction", "medical", "oilGas",
  "environment",
] as const;

type State = "idle" | "sending" | "done";

/**
 * Terminal's form layout and button motion, Nomad's colours. The footer shares this
 * section's background so there is no seam between them — Vista's footer treatment.
 */
export default function ContactFooter() {
  const { t } = useI18n();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    service: en.disciplines[DISCIPLINE_KEYS[0]],
    message: "",
    website: "", // honeypot
  });

  /* 16px on phones is deliberate: iOS Safari zooms the whole page when a focused field
     is under 16px, which throws the layout off. Desktop keeps the intended 15px. */
  const field =
    "w-full border-0 border-b bg-transparent px-0 py-3 text-[16px] font-light text-white outline-none transition-colors placeholder:text-white/35 md:text-[15px]";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organisation: form.company,
          email: form.email,
          discipline: form.service,
          message: form.message,
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.contact.errorGeneric);
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError(t.contact.errorOffline);
      setState("idle");
    }
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
            <span className="t-mono block">{t.contact.label}</span>
            <h2 className="t-h2 mt-6 max-w-[18ch]">{t.contact.title}</h2>
            <p className="t-body mt-6 max-w-[38ch]">
              {t.contact.body}
            </p>

            <dl className="mt-12 space-y-5">
              {[
                [t.footer.office, "Plot 13, Mukwano Courts\nBuganda Road, Floor 4, Suite 401–402\nKampala, Uganda"],
                [t.footer.telephone, "+256 (0) 414 675306"],
                [t.footer.whatsapp, "+256 394 525152"],
                [t.footer.email, "info@nomadinvestments.co.ug"],
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
                <span className="t-mono">{t.contact.fields.name}</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={field}
                  style={{ borderColor: "rgba(255,255,255,.22)" }}
                  placeholder={t.contact.fields.namePlaceholder}
                />
              </label>
              <label className="block">
                <span className="t-mono">{t.contact.fields.organisation}</span>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={field}
                  style={{ borderColor: "rgba(255,255,255,.22)" }}
                  placeholder={t.contact.fields.organisationPlaceholder}
                />
              </label>
            </div>

            <label className="block">
              <span className="t-mono">{t.contact.fields.email}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
                placeholder={t.contact.fields.emailPlaceholder}
              />
            </label>

            <label className="block">
              <span className="t-mono">{t.contact.fields.discipline}</span>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className={`${field} cursor-pointer`}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
              >
                {DISCIPLINE_KEYS.map((k) => (
                  <option key={k} value={en.disciplines[k]} style={{ background: "var(--navy)" }}>
                    {t.disciplines[k]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="t-mono">{t.contact.fields.brief}</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${field} resize-none`}
                style={{ borderColor: "rgba(255,255,255,.22)" }}
                placeholder={t.contact.fields.briefPlaceholder}
              />
            </label>

            {/* off-screen honeypot: bots fill it, people never see it */}
            <div aria-hidden="true" className="contact-hp">
              <label>
                Leave this empty
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button type="submit" className="btn btn-gold" disabled={state !== "idle"}>
                {state === "idle" ? t.contact.submit : state === "sending" ? t.contact.sending : t.contact.received}
                <span className="arrow">→</span>
              </button>
              {error && (
                <span role="alert" className="t-mono" style={{ color: "#ff9d8f" }}>
                  {error}
                </span>
              )}
              {state === "done" && (
                <span className="t-mono" style={{ color: "var(--gold)" }}>
                  {t.contact.receivedNote}
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
              <p className="t-mono mt-5">{t.footer.tagline}</p>
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
