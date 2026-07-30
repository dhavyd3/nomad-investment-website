"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ON Energy's pattern from brief image 3: rounded cards rising over a moving gold streak,
 * with the number set large and light and its unit small beside it.
 */
const CARDS = [
  { big: "7", unit: "lines", label: "Service disciplines under one operating standard" },
  { big: "10", unit: "yrs", label: "Operating from Kampala since 2016" },
  { big: "1", unit: "standard", label: "Same delivery discipline across every sector" },
];

const REASONS = [
  ["Integrity", "Core values of integrity, quality and innovation drive our operations and decision-making."],
  ["Skilled workforce", "An experienced and skilled workforce, combined with dedication to continuous improvement."],
  ["Getting it done", "We strategize, organize and globalize — synergies and partnerships that turn intent into delivery."],
];

export default function WhyChooseUs() {
  const root = useRef<HTMLDivElement>(null);
  const streak = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        streak.current,
        { xPercent: -18, yPercent: -10 },
        {
          xPercent: 18,
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      gsap.utils.toArray<HTMLElement>(".stat-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 26, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".rise").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => gsap.delayedCall(i * 0.07, () => el.classList.add("in")),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-nav-theme="dark"
      className="relative overflow-hidden py-[clamp(84px,14vh,170px)]"
      style={{ background: "var(--ink)" }}
    >
      <div
        ref={streak}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-15%] top-[-10%] h-[70%] will-change-transform"
        style={{
          background: "radial-gradient(50% 110% at 30% 45%, rgba(255,222,89,.2), transparent 62%)",
          filter: "blur(36px)",
        }}
      />

      <div className="wrap relative">
        <span className="t-mono rise block">Why choose us</span>
        <h2 className="t-h2 rise mt-6 max-w-[26ch]">Commitment to excellence, in every project we deliver.</h2>

        <div className="mt-[clamp(44px,7vh,80px)] grid gap-4 md:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.label}
              className="stat-card rounded-[18px] border border-white/8 p-7"
              style={{ background: "rgba(255,255,255,.035)" }}
            >
              <div className="flex items-start justify-end gap-1">
                <span
                  className="leading-[0.85]"
                  style={{ fontSize: "clamp(3.4rem,6vw,5.4rem)", fontWeight: 300, letterSpacing: "-0.04em", color: "rgba(255,255,255,.9)" }}
                >
                  {c.big}
                </span>
                <span className="t-mono mt-2">{c.unit}</span>
              </div>
              <p className="t-body mt-6">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(48px,8vh,96px)] grid gap-x-10 gap-y-10 md:grid-cols-3">
          {REASONS.map(([t, b]) => (
            <div key={t} className="rise border-t border-white/12 pt-6">
              <h3 className="text-[1.0625rem] font-normal tracking-[-0.01em]">{t}</h3>
              <p className="t-body mt-3">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
