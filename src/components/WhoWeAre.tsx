"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Terminal's three-column card block (the last brief screenshot): a large heading above,
 * then three columns separated by hairline rules, each with a mono index + label, a title,
 * body copy and an image. No CTA per the brief, and Nomad's palette is kept.
 *
 * Copy is from nomadinvestments.co.ug.
 */
const COLS = [
  { n: "01", key: "founded", img: "/media/who-01.jpg", alt: "A desk with a folded site drawing, bound reports and a hard hat" },
  { n: "02", key: "guidance", img: "/media/who-02.jpg", alt: "Ordered ranks of conduit entering a concrete wall" },
  { n: "03", key: "delivery", img: "/media/who-03.jpg", alt: "A concrete structure rising against a hazy East African sky" },
] as const;

export default function WhoWeAre() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rise").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.delayedCall(i * 0.07, () => el.classList.add("in")),
        });
      });

      gsap.utils.toArray<HTMLElement>(".who-col").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 14, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="who-we-are"
      ref={root}
      data-nav-theme="dark"
      className="relative pb-[clamp(80px,13vh,150px)] pt-[clamp(40px,6vh,80px)]"
      style={{ background: "var(--navy-deep)" }}
    >
      <div className="wrap">
        {/* the large heading terminal sets above the columns */}
        <h2 className="t-h2 rise max-w-[22ch]">{t.home.whoHeading}</h2>

        <div className="mt-[clamp(44px,7vh,84px)] grid md:grid-cols-3">
          {COLS.map((c, i) => (
            <div
              key={c.n}
              /* the divider is a column separator — stacked on mobile it has to be the top
                 rule only, or every block picks up a stray hairline down its left edge */
              className={`who-col flex flex-col px-0 py-8 md:px-8 md:py-2 ${
                i === 0 ? "" : "md:border-l md:border-white/11"
              }`}
              style={{ borderTop: "1px solid rgba(255,255,255,.11)" }}
            >
              <span className="t-mono mt-7 block">
                {c.n} &nbsp;{t.home.who[c.key].kicker}
              </span>

              <h3 className="mt-6 text-[1.375rem] font-normal leading-[1.15] tracking-[-0.025em]">
                {t.home.who[c.key].title}
              </h3>

              <p className="t-body mt-5">{t.home.who[c.key].body}</p>

              <div
                className="mt-9 overflow-hidden rounded-[10px]"
                style={{ background: "#0b0b1c" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  className="block aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
