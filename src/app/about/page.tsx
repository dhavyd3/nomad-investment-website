import type { Metadata } from "next";
import Link from "next/link";
import DottedSurface from "@/components/DottedSurface";
import { RevealWords, RevealChars } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Nomad Investments Limited",
  description:
    "Founded in 2016, Nomad Investments Limited is an East African company built to get business done — across twelve disciplines, from one operating standard in Kampala.",
};

/* Terminal's about page numbers its argument and alternates the image side down the
   column. Copy is Nomad's own, from nomadinvestments.co.ug/about-us. */
const POINTS = [
  {
    n: "01",
    title: "Built to get work done",
    body:
      "Founded in 2016, Nomad Investments Limited is an East African based company — a Ugandan firm dedicated to getting work done. Not a holding company that watches from a distance, but an operator that takes on the delivery itself.",
    img: "/media/who-01.jpg",
    alt: "A desk with a folded site drawing, bound reports and a hard hat",
  },
  {
    n: "02",
    title: "The client's objective is the brief",
    body:
      "We prioritize the needs and goals of our clients, tailoring investment strategies to meet their specific objectives. Every engagement starts from what the client is actually trying to achieve, not from a service we would prefer to sell.",
    img: "/media/who-02.jpg",
    alt: "Ordered ranks of conduit entering a concrete wall",
  },
  {
    n: "03",
    title: "Reach beyond a single market",
    body:
      "With a presence in multiple regions, we are well-positioned to access and analyze investment opportunities across the globe. Kampala is where we operate from; it is not the limit of where we work.",
    img: "/media/show-business.jpg",
    alt: "An empty boardroom with a steel table and a city skyline beyond",
  },
  {
    n: "04",
    title: "Growth that holds up",
    body:
      "We generate long-term value with risk managed deliberately rather than discovered late. Sustainable growth is a delivery standard here, not a line in a brochure — it is what lets a client plan past the current quarter.",
    img: "/media/show-environment.jpg",
    alt: "A row of wind turbines following a hillside ridge",
  },
];

const REASONS = [
  [
    "Global reach",
    "With a presence in multiple regions, we are well-positioned to access and analyze investment opportunities across the globe.",
  ],
  [
    "Expertise",
    "Financial specialists with deep knowledge and insights across various industries and asset classes.",
  ],
  [
    "Client-centric",
    "A customized approach, built around the specific objectives of the organisation in front of us.",
  ],
  [
    "Sustainable growth",
    "Long-term value generation, with risk management carried through every stage of delivery.",
  ],
];

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

export default function AboutPage() {
  return (
    <>
      {/* One surface behind the whole page. The reference cuts its canvas off at the
          numbered section, which is exactly the seam we were asked to avoid — running it
          fixed under everything means no section ever announces where it starts. */}
      <DottedSurface size={8} opacity={0.8} />
      <div aria-hidden="true" className="about-veil" />

      <main className="about">
        <section className="about-hero wrap">
          <span className="t-mono block">About Nomad Investments</span>
          <RevealWords
            as="h1"
            className="t-h1 mt-7 max-w-[15ch]"
            text="A Ugandan firm dedicated to getting work done."
          />
          <RevealChars
            className="t-lead mt-9 max-w-[54ch]"
            text="Founded in 2016 and operating from Kampala, we work across twelve disciplines under a single delivery standard — strategize, organize, globalize."
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
                  <RevealWords as="h2" className="t-h3" text={p.title} />
                </div>
                <RevealChars className="t-body" text={p.body} />
              </div>
            </article>
          ))}
        </section>

        <section className="wrap about-mv">
          <div>
            <span className="t-mono block">Mission</span>
            <RevealChars
              className="t-lead mt-6"
              text="We prioritize the needs and goals of our clients, tailoring investment strategies to meet their specific objectives."
            />
          </div>
          <div>
            <span className="t-mono block">Vision</span>
            <RevealChars
              className="t-lead mt-6"
              text="To be the delivery partner East African business turns to first — the firm trusted with the work that has to be done properly, in every sector we operate in."
            />
          </div>
        </section>

        <section className="wrap about-why">
          <RevealWords as="h2" className="t-h2 max-w-[24ch]" text="Why organisations choose us" />
          <div className="about-why-grid">
            {REASONS.map(([t, b]) => (
              <div key={t} className="about-reason">
                <h3>{t}</h3>
                <RevealChars className="t-body mt-3" text={b} />
              </div>
            ))}
          </div>
        </section>

        <section className="wrap about-disciplines">
          <RevealWords as="h2" className="t-h2 max-w-[20ch]" text="Twelve disciplines, one standard" />
          <ul>
            {DISCIPLINES.map((d, i) => (
              <li key={d}>
                <span className="t-mono">{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap about-cta">
          <RevealWords as="h2" className="t-h2 max-w-[18ch]" text="Tell us what needs delivering." />
          <p className="t-body mt-6 max-w-[46ch]">
            Plot 13, Mukwano Courts, Buganda Road, Floor 4, Suite 401–402, Kampala, Uganda.
          </p>
          <Link href="/#contact" className="btn btn-gold mt-9">
            Get in touch <span className="arrow">→</span>
          </Link>
        </section>
      </main>
    </>
  );
}
