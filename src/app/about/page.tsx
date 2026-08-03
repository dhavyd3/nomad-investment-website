import type { Metadata } from "next";
import Link from "next/link";
import DottedSurface from "@/components/DottedSurface";
import { RevealWords, RevealChars } from "@/components/Reveal";
import { getDictionary, getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: "About — Nomad Investments Limited",
  description:
    "Founded in 2016, Nomad Investments Limited is an East African company built to get business done — across eleven disciplines, from one operating standard in Kampala.",
};

/* Terminal's about page numbers its argument and alternates the image side down the
   column. Copy is Nomad's own, from nomadinvestments.co.ug/about-us. */
const POINTS = [
  { n: "01", key: "built", img: "/media/who-01.jpg", alt: "A desk with a folded site drawing, bound reports and a hard hat" },
  { n: "02", key: "brief", img: "/media/who-02.jpg", alt: "Ordered ranks of conduit entering a concrete wall" },
  { n: "03", key: "reach", img: "/media/show-business.jpg", alt: "An empty boardroom with a steel table and a city skyline beyond" },
  { n: "04", key: "growth", img: "/media/show-environment.jpg", alt: "A row of wind turbines following a hillside ridge" },
] as const;

const REASON_KEYS = ["reach", "expertise", "client", "growth"] as const;

const DISCIPLINE_KEYS = [
  "businessConsulting", "investorRelations", "ictConsultancy", "cybersecurity",
  "transport", "clearing", "financial", "construction", "medical", "oilGas",
  "environment",
] as const;

export default async function AboutPage() {
  const t = getDictionary(await getLocale());
  return (
    <>
      {/* One surface behind the whole page. The reference cuts its canvas off at the
          numbered section, which is exactly the seam we were asked to avoid — running it
          fixed under everything means no section ever announces where it starts. */}
      <DottedSurface size={8} opacity={0.8} />
      <div aria-hidden="true" className="about-veil" />

      <main className="about">
        <section className="about-hero wrap">
          <span className="t-mono block">{t.about.label}</span>
          <RevealWords
            as="h1"
            className="t-h1 mt-7 max-w-[15ch]"
            text={t.about.title}
          />
          <RevealChars
            className="t-lead mt-9 max-w-[54ch]"
            text={t.about.lead}
          />
        </section>

        <section className="wrap about-points">
          {POINTS.map((p, i) => (
            <article key={p.n} className={`about-point ${i % 2 ? "is-flipped" : ""}`}>
              <figure className="about-point-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.alt} loading="lazy" />
              </figure>
              <div className="about-point-copy">
                <div className="about-point-title">
                  <span className="t-mono about-point-n">{p.n}</span>
                  <RevealWords as="h2" className="t-h3" text={t.about.points[p.key].title} />
                </div>
                <RevealChars className="t-body" text={t.about.points[p.key].body} />
              </div>
            </article>
          ))}
        </section>

        <section className="wrap about-mv">
          <div>
            <span className="t-mono block">{t.about.missionLabel}</span>
            <RevealChars
              className="t-lead mt-6"
              text={t.about.missionBody}
            />
          </div>
          <div>
            <span className="t-mono block">{t.about.visionLabel}</span>
            <RevealChars
              className="t-lead mt-6"
              text={t.about.visionBody}
            />
          </div>
        </section>

        <section className="wrap about-why">
          <RevealWords as="h2" className="t-h2 max-w-[24ch]" text={t.about.whyTitle} />
          <div className="about-why-grid">
            {REASON_KEYS.map((k) => (
              <div key={k} className="about-reason">
                <h3>{t.about.reasons[k].title}</h3>
                <RevealChars className="t-body mt-3" text={t.about.reasons[k].body} />
              </div>
            ))}
          </div>
        </section>

        <section className="wrap about-disciplines">
          <RevealWords as="h2" className="t-h2 max-w-[20ch]" text={t.about.disciplinesTitle} />
          <ul>
            {DISCIPLINE_KEYS.map((d, i) => (
              <li key={d}>
                <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>
                {t.disciplines[d]}
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap about-cta">
          <RevealWords as="h2" className="t-h2 max-w-[18ch]" text={t.about.ctaTitle} />
          <p className="t-body mt-6 max-w-[46ch]">
            Plot 13, Mukwano Courts, Buganda Road, Floor 4, Suite 401–402, Kampala, Uganda.
          </p>
          <Link href="/contact" className="btn btn-gold mt-9">
            {t.nav.cta} <span className="arrow">→</span>
          </Link>
        </section>
      </main>
    </>
  );
}
