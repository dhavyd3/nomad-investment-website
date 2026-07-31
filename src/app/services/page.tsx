import type { Metadata } from "next";
import Link from "next/link";
import ServicesScroll from "@/components/ServicesScroll";
import { ZONES } from "@/components/servicesZones";
import { RevealWords, RevealChars } from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Our Services — Nomad Investments Limited",
  description:
    "Five service lines across one operating standard: business consulting and investor relations, ICT and cybersecurity, engineering and infrastructure, agriculture, and oil, gas and green energy.",
};

/* on.energy's expertise page runs: a dark problem statement, the pinned scene, an
   expertise intro, feature cards, a body of copy, a quote, then the close. Same order
   here, in Nomad's voice. */
const CARDS = [
  ["Scoped honestly", "We say what a job actually takes before it starts, including when the answer is that we are not the right firm for it."],
  ["Delivered by us", "The people who scope the work are the people who carry it. Nothing is handed to a subcontractor you never met."],
  ["Held to one standard", "Five disciplines, one delivery discipline. A client in agriculture gets the same rigour as one in cybersecurity."],
];

export default function ServicesPage() {
  return (
    <>
      <main>
        <section className="wrap svc-intro" data-nav-theme="dark">
          <span className="t-mono block">Our services</span>
          <RevealWords
            as="h1"
            className="t-h1 mt-7 max-w-[16ch]"
            text="Five service lines. One way of working."
          />
          <RevealChars
            className="t-lead mt-9 max-w-[52ch]"
            text="Most firms sell a service. We take on the delivery — across five major lines of work, from a single operating standard in Kampala."
          />
        </section>

        <ServicesScroll />

        <section className="wrap svc-after" data-nav-theme="dark">
          <RevealWords as="h2" className="t-h2 max-w-[22ch]" text="How the work actually runs" />
          <div className="svc-cards">
            {CARDS.map(([t, b]) => (
              <div key={t} className="svc-card">
                <h3>{t}</h3>
                <RevealChars className="t-body mt-3" text={b} />
              </div>
            ))}
          </div>
        </section>

        <section className="wrap svc-list" data-nav-theme="dark">
          <RevealWords as="h2" className="t-h2 max-w-[20ch]" text="The five lines in full" />
          <ol>
            {ZONES.map((z) => (
              <li key={z.id}>
                <span className="t-mono">{z.index}</span>
                <div>
                  <h3>{z.title}</h3>
                  <p className="t-body mt-2">{z.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="wrap svc-cta" data-nav-theme="dark">
          <RevealWords as="h2" className="t-h2 max-w-[18ch]" text="Tell us what needs delivering." />
          <p className="t-body mt-6 max-w-[46ch]">
            Send the brief and the discipline it sits in. We will come back to you from Kampala.
          </p>
          <Link href="/contact" className="btn btn-gold mt-9">
            Get in touch <span className="arrow">→</span>
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
