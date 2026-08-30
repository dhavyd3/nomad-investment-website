import type { Metadata } from "next";
import Link from "next/link";
import ServicesHero from "@/components/ServicesHero";
import ServicesScroll from "@/components/ServicesScroll";
import { ZONES } from "@/components/servicesZones";
import { RevealWords, RevealChars } from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getDictionary, getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Our Services — Nomad Investments Limited",
  description:
    "Business consulting and investor relations, ICT and cybersecurity, engineering and infrastructure, agriculture, and oil, gas and green energy — delivered from one operating standard in Kampala.",
};

export default async function ServicesPage() {
  const t = getDictionary(await getLocale());
  const EXPERTISE_KEYS = ["guidance", "delivery", "standard", "workforce"] as const;
  const BENEFIT_KEYS = ["nonConductive", "quickDrying", "nonCorrosive", "fireSafe"] as const;
  return (
    <>
      <main>
        <ServicesHero />

        {/* The bridge. One large, quiet statement between the hero and the board —
            the job the reference's "The Problem" section does: it slows the reader
            down so the pinned scene arrives as an answer rather than a surprise. */}
        {/* The bridge opens the white slab with a rounded top over the dark hero, and
            the cap below closes it again after the board. Between them the background
            never changes, so the two dark/light joins are curves rather than seams. */}
        <section className="svc-bridge wrap" data-nav-theme="light">
          <div className="svc-bridge-label">
            <span className="t-mono">{t.services.problemLabel}</span>
          </div>
          <RevealChars
            className="svc-bridge-copy"
            text={t.services.problemBody}
          />
        </section>

        <ServicesScroll />

        <div className="svc-cap" aria-hidden="true" />

        <section className="wrap svc-expertise" data-nav-theme="dark">
          <span className="t-mono block">{t.services.expertiseLabel}</span>
          <RevealWords
            as="h2"
            className="t-h2 mt-7 max-w-[22ch]"
            text={t.services.expertiseTitle}
          />
          <div className="svc-expertise-grid">
            {EXPERTISE_KEYS.map((k) => (
              <div key={k} className="svc-expertise-item">
                <h3>{t.services.expertise[k].title}</h3>
                <RevealChars className="t-body mt-3" text={t.services.expertise[k].body} />
              </div>
            ))}
          </div>
        </section>

        <section className="wrap svc-list" data-nav-theme="dark">
          <RevealWords as="h2" className="t-h2 max-w-[20ch]" text={t.services.listTitle} />
          <ol>
            {ZONES.map((z) => (
              <li key={z.id}>
                <span className="t-mono">{z.index}</span>
                <div>
                  <h3>{t.services.lines[z.id as keyof typeof t.services.lines] ?? z.title}</h3>
                  <p className="t-body mt-2">{z.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* The cleaning division. Not one of the five board zones — the board's zones
            are baked into the GLB with a camera stop each, and this reads as a
            specialist division rather than a sixth sector line. The id is what
            /services#cleaning in the nav dropdown lands on. */}
        <section id="cleaning" className="wrap svc-division" data-nav-theme="dark">
          <span className="t-mono block">{t.services.division.label}</span>
          <RevealWords
            as="h2"
            className="t-h2 mt-7 max-w-[18ch]"
            text={t.services.division.title}
          />
          <RevealChars className="t-lead mt-8 max-w-[54ch]" text={t.services.division.body} />
          <p className="t-body mt-5 max-w-[58ch]">{t.services.division.focus}</p>

          <div className="svc-division-note">
            <span className="t-mono block">{t.services.division.detergentLabel}</span>
            <p className="t-body mt-3">{t.services.division.detergentBody}</p>
          </div>

          <span className="t-mono mt-14 block">{t.services.division.benefitsLabel}</span>
          <div className="svc-division-grid">
            {BENEFIT_KEYS.map((k) => (
              <div key={k} className="svc-division-item">
                <h3>{t.services.division.benefits[k].title}</h3>
                <p className="t-body mt-2">{t.services.division.benefits[k].body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap svc-cta" data-nav-theme="dark">
          <RevealWords as="h2" className="t-h2 max-w-[18ch]" text={t.services.ctaTitle} />
          <p className="t-body mt-6 max-w-[46ch]">
            {t.services.ctaBody}
          </p>
          <Link href="/contact" className="btn btn-gold mt-9">
            {t.nav.cta} <span className="arrow">→</span>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
