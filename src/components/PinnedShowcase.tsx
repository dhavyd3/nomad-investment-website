"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Terminal-industries' pinned section, rebuilt with images instead of a video.
 * Left column text swaps as you scroll; the right panel stays put and its image turns
 * over like a page. Small numeric index + a progress rail follow the scroll.
 */
const ITEMS = [
  { n: "01", key: "agriculture", img: "/media/show-agriculture.jpg", alt: "Ordered plantation rows on red laterite earth in the Ugandan highlands" },
  { n: "02", key: "environment", img: "/media/show-environment.jpg", alt: "A row of wind turbines following a hillside ridge" },
  { n: "03", key: "business", img: "/media/show-business.jpg", alt: "An empty boardroom with a steel table and a city skyline beyond" },
] as const;

/** Shared by the mobile stack and the desktop pinned column. */
function Copy({ it }: { it: (typeof ITEMS)[number] }) {
  const { t } = useI18n();
  return (
    <>
      <span className="t-mono block" style={{ color: "#6b6b6b" }}>
        {it.n} / {String(ITEMS.length).padStart(2, "0")}
      </span>
      <h2 className="t-h3 mt-4" style={{ color: "var(--title-light-bg)" }}>
        {t.home.showcase[it.key].title}
      </h2>
      <p className="t-body mt-5 max-w-[46ch]" style={{ color: "#5a5a5a" }}>
        {t.home.showcase[it.key].body}
      </p>
      <a
        href="#contact"
        className="btn btn-ghost mt-8"
        style={{ color: "var(--navy)", borderColor: "rgba(6,6,68,.28)" }}
      >
        Talk to us <span className="arrow">→</span>
      </a>
    </>
  );
}

export default function PinnedShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const activeRef = useRef(0);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(ITEMS.length - 1, Math.floor(self.progress * ITEMS.length));
          if (i !== activeRef.current) {
            setPrev(activeRef.current);
            activeRef.current = i;
            setActive(i);
          }
          if (rail.current) rail.current.style.transform = `scaleY(${self.progress})`;
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-nav-theme="light"
      /* height has to track the same condition as the layout, or a short viewport gets
         3 viewports of scroll for a stack that no longer fills it */
      className="pin-section relative"
      style={
        {
          "--pin-h": `${ITEMS.length * 100}vh`,
          background: "var(--paper)",
        } as React.CSSProperties
      }
    >
      {/* Phones get a plain stack. Pinning three items into one viewport there crops the
          panel and pushes the index label up behind the nav, so the pin is desktop-only. */}
      <div className="on-light wrap pin-stack py-[clamp(64px,11vh,110px)]">
        {ITEMS.map((it, i) => (
          <div
            key={it.n}
            className={i === 0 ? "" : "mt-14 border-t border-black/10 pt-12"}
          >
            <Copy it={it} />
            <div
              className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[18px]"
              style={{ background: "#0d0d18" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.img}
                alt={it.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(6,6,68,.35), transparent 55%)" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="on-light stage pin-panel sticky top-0 items-center overflow-hidden">
        <div className="wrap grid w-full items-center gap-10 md:grid-cols-[1fr_minmax(320px,46%)]">
          {/* ---------- left: swapping text ---------- */}
          <div className="relative flex gap-6">
            {/* progress rail */}
            <div className="relative mt-2 hidden w-[2px] shrink-0 bg-black/10 sm:block" style={{ height: 132 }}>
              <div
                ref={rail}
                className="absolute inset-0 origin-top"
                style={{ background: "var(--navy)", transform: "scaleY(0)" }}
              />
            </div>

            <div className="min-h-[290px]">
              {ITEMS.map((it, i) => (
                <div
                  key={it.n}
                  aria-hidden={i !== active}
                  className="transition-all duration-[650ms]"
                  style={{
                    display: i === active ? "block" : "none",
                  }}
                >
                  <Copy it={it} />
                </div>
              ))}
            </div>
          </div>

          {/* ---------- right: fixed panel, page-turn image swap ---------- */}
          <div
            className="relative aspect-square w-full overflow-hidden rounded-[18px]"
            style={{ background: "#0d0d18", boxShadow: "0 30px 80px -40px rgba(6,6,68,.5)" }}
          >
            {ITEMS.map((it, i) => {
              const isActive = i === active;
              const isPrev = i === prev && !isActive;
              return (
                <img
                  key={it.img}
                  src={it.img}
                  alt={it.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transformOrigin: "left center",
                    transition:
                      "transform 900ms var(--ease), opacity 700ms var(--ease), filter 900ms var(--ease)",
                    transform: isActive
                      ? "rotateY(0deg) translateX(0)"
                      : isPrev
                        ? "rotateY(-32deg) translateX(-12%)"
                        : "rotateY(22deg) translateX(10%)",
                    opacity: isActive ? 1 : 0,
                    filter: isActive ? "none" : "brightness(.6)",
                    zIndex: isActive ? 2 : 1,
                    pointerEvents: "none",
                  }}
                />
              );
            })}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(6,6,68,.35), transparent 55%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
