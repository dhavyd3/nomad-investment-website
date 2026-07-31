"use client";

import { useState } from "react";
import { FileCard, type FileState } from "./FileCard";

const DISCIPLINES = [
  "Business Consulting",
  "Investor Relations",
  "ICT Consultancy",
  "Cybersecurity",
  "Transport Services",
  "Clearing & Forwarding",
  "Financial Solutions",
  "Construction & Engineering",
  "Medical Supplies & Health Informatics",
  "Oil & Gas Consultancy",
  "Environment & Green Energy",
  "Events Management",
];

export default function ContactForm() {
  const [phase, setPhase] = useState<"form" | "folding" | "sent">("form");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    discipline: DISCIPLINES[0],
    message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // the sheet folds away first; `sent` is set when its animation reports back
    setPhase("folding");
  };

  if (phase === "sent") {
    return (
      <FileCard className="contact-thanks file-thanks">
        <span className="t-mono block" style={{ color: "#6b6b6b" }}>
          Received
        </span>
        <h2 className="t-h2 mt-6" style={{ color: "var(--navy)" }}>
          Thank you — we have your brief.
        </h2>
        <p className="t-body mt-6 max-w-[46ch]" style={{ color: "#4a4a5c" }}>
          Someone from the relevant discipline will come back to you from Kampala. If it is
          urgent, call <a href="tel:+256414675306" style={{ color: "var(--navy)" }}>+256 (0) 414 675306</a>{" "}
          or reach us on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setPhase("form")}
          className="btn btn-ghost mt-10"
          style={{ color: "var(--navy)", borderColor: "rgba(6,6,68,.28)" }}
        >
          Send another <span className="arrow">→</span>
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
        Project brief
      </span>
      <h2 className="t-h3 mt-4" style={{ color: "var(--navy)" }}>
        Tell us what needs delivering.
      </h2>

      <form onSubmit={onSubmit} className="contact-grid mt-10">
        <div className="contact-grid is-two">
          <label className="contact-label">
            <span className="t-mono">Name</span>
            <input required value={form.name} onChange={set("name")} className="contact-field" placeholder="Your name" />
          </label>
          <label className="contact-label">
            <span className="t-mono">Organisation</span>
            <input value={form.company} onChange={set("company")} className="contact-field" placeholder="Company or ministry" />
          </label>
        </div>

        <label className="contact-label">
          <span className="t-mono">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            className="contact-field"
            placeholder="you@organisation.com"
          />
        </label>

        <label className="contact-label">
          <span className="t-mono">Discipline</span>
          <select value={form.discipline} onChange={set("discipline")} className="contact-field cursor-pointer">
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="contact-label">
          <span className="t-mono">Brief</span>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={set("message")}
            className="contact-field resize-none"
            placeholder="What needs delivering, and by when?"
          />
        </label>

        <div>
          <button type="submit" className="btn btn-gold">
            Send enquiry <span className="arrow">→</span>
          </button>
        </div>
      </form>
    </FileCard>
  );
}
