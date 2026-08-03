"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * The services hero: the argument on the left, the board on the right.
 *
 * The board drifts and tilts a little as the section scrolls — the reference does the
 * same, and it is what stops the first screen reading as a flat picture. Deliberately
 * a still render rather than a second WebGL context: the pinned scene below already
 * owns one, and a hero that costs a GPU context before the reader has scrolled is a
 * bad trade for a few degrees of parallax.
 *
 * The transform is written straight onto the node from a rAF, so scrolling the hero
 * never re-renders React.
 */
export default function ServicesHero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const img = board.current;
    if (!el || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 while the hero fills the screen, 1 once it has scrolled fully past
      const p = Math.min(Math.max(-r.top / Math.max(r.height, 1), 0), 1);
      img.style.transform = `translate3d(0, ${(-p * 9).toFixed(2)}%, 0) scale(${(
        1 + p * 0.06
      ).toFixed(4)}) rotate(${(p * -1.6).toFixed(2)}deg)`;
      img.style.opacity = String(1 - p * 0.45);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={root} className="svc-hero" data-nav-theme="dark">
      <div className="wrap svc-hero-grid">
        <div className="svc-hero-copy">
          <h1>{t.services.heroTitle}</h1>
          <p>{t.services.heroBody}</p>
          <a href="#scene" className="btn btn-gold svc-hero-cta">
            {t.services.heroCta} <span className="arrow">→</span>
          </a>
        </div>

        <div className="svc-hero-board">
          <div ref={board} className="svc-hero-board-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/scene/hero-hq.png"
              alt="An isometric model of the Nomad Investments Limited offices: a glazed tower over a podium, with a forecourt and entrance canopy"
              width={1500}
              height={1500}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
