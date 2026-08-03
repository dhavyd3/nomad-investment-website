"use client";

import { useState } from "react";
import { FileCard, type FileState } from "./FileCard";
import { useI18n } from "@/i18n/I18nProvider";
import en from "@/i18n/dictionaries/en";

const DISCIPLINE_KEYS = [
  "businessConsulting", "investorRelations", "ictConsultancy", "cybersecurity",
  "transport", "clearing", "financial", "construction", "medical", "oilGas",
  "environment",
] as const;

export default function ContactForm() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<"form" | "sending" | "folding" | "sent">("form");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    discipline: en.disciplines[DISCIPLINE_KEYS[0]],
    message: "",
    website: "", // honeypot
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  /* The sheet only folds away once the enquiry is actually accepted. Folding first
     and sending afterwards would show the thank-you for a message that never left. */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;
    setError(null);
    setPhase("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          organisation: form.company,
          email: form.email,
          discipline: form.discipline,
          message: form.message,
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.contact.errorGeneric);
        setPhase("form");
        return;
      }
      setPhase("folding");
    } catch {
      setError(t.contact.errorOffline);
      setPhase("form");
    }
  };

  if (phase === "sent") {
    return (
      <FileCard className="contact-thanks file-thanks">
        <span className="t-mono block" style={{ color: "#6b6b6b" }}>
          {t.contact.thanksLabel}
        </span>
        <h2 className="t-h2 mt-6" style={{ color: "var(--navy)" }}>
          {t.contact.thanksTitle}
        </h2>
        <p className="t-body mt-6 max-w-[46ch]" style={{ color: "#4a4a5c" }}>
          {t.contact.thanksBody}{" "}
          <a href="tel:+256414675306" style={{ color: "var(--navy)" }}>+256 (0) 414 675306</a>{" "}
          {t.contact.thanksOr}
        </p>
        <button
          type="button"
          onClick={() => setPhase("form")}
          className="btn btn-ghost mt-10"
          style={{ color: "var(--navy)", borderColor: "rgba(6,6,68,.28)" }}
        >
          {t.contact.sendAnother} <span className="arrow">→</span>
        </button>
      </FileCard>
    );
  }

  return (
    <FileCard
      className="contact-sheet"
      state={(phase === "folding" ? "folding" : "idle") as FileState}
      onFolded={() => setPhase("sent")}
    >
      <span className="t-mono block" style={{ color: "#6b6b6b" }}>
        {t.contact.briefLabel}
      </span>
      <h2 className="t-h3 mt-4" style={{ color: "var(--navy)" }}>
        {t.contact.briefTitle}
      </h2>

      <form onSubmit={onSubmit} className="contact-grid mt-10">
        <div className="contact-grid is-two">
          <label className="contact-label">
            <span className="t-mono">{t.contact.fields.name}</span>
            <input required value={form.name} onChange={set("name")} className="contact-field" placeholder={t.contact.fields.namePlaceholder} />
          </label>
          <label className="contact-label">
            <span className="t-mono">{t.contact.fields.organisation}</span>
            <input value={form.company} onChange={set("company")} className="contact-field" placeholder={t.contact.fields.organisationPlaceholder} />
          </label>
        </div>

        <label className="contact-label">
          <span className="t-mono">{t.contact.fields.email}</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            className="contact-field"
            placeholder={t.contact.fields.emailPlaceholder}
          />
        </label>

        <label className="contact-label">
          <span className="t-mono">{t.contact.fields.discipline}</span>
          <select value={form.discipline} onChange={set("discipline")} className="contact-field cursor-pointer">
            {/* value stays English so every enquiry lands in the inbox with the
                same discipline names, whatever language it was sent in */}
            {DISCIPLINE_KEYS.map((k) => (
              <option key={k} value={en.disciplines[k]}>
                {t.disciplines[k]}
              </option>
            ))}
          </select>
        </label>

        <label className="contact-label">
          <span className="t-mono">{t.contact.fields.brief}</span>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={set("message")}
            className="contact-field resize-none"
            placeholder={t.contact.fields.briefPlaceholder}
          />
        </label>

        {/* Off-screen rather than display:none — some bots skip hidden fields but
            fill anything that is technically in the layout. */}
        <div aria-hidden="true" className="contact-hp">
          <label>
            Leave this empty
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={set("website")}
            />
          </label>
        </div>

        <div>
          <button type="submit" className="btn btn-gold" disabled={phase === "sending"}>
            {phase === "sending" ? t.contact.sending : t.contact.submit}
            <span className="arrow">→</span>
          </button>
          {error && (
            <p role="alert" className="contact-error t-body mt-4">
              {error}
            </p>
          )}
        </div>
      </form>
    </FileCard>
  );
}
