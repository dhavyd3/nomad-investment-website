"use client";

import { useEffect, useRef, useState } from "react";
import ServicesStage, { STOPS, activeZone, progressForStop } from "./ServicesStage";
import { ZONES } from "./servicesZones";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * The pinned half of the services page. The section is very tall, the stage inside
 * it sticks, and scroll position flies the camera between the five service zones.
 *
 * Four viewports per stop, matching the reference's 24 for six stops. The old board
 * gave each zone barely one, so the camera move and the reading of the copy were
 * always competing; at this length the camera arrives, settles, and waits.
 *
 * Progress goes to the stage through a ref, not a prop — a 24-viewport scroll would
 * otherwise re-render the tree on every frame. Only the discrete zone index is
 * state, and that changes five times in the whole section.
 */
const VIEWPORTS_PER_STOP = 4;

function Tick() {
  return (
    <svg className="svc-tick" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="6.2" fill="currentColor" />
      <path
        d="M4.2 7.2l2 2 3.6-4"
        fill="none"
        stroke="var(--tick-mark, #fff)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesScroll() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(-1);
  const zone = active >= 0 ? ZONES[active] : null;

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(Math.max(-el.getBoundingClientRect().top / scrollable, 0), 1);
      progress.current = p;

      /* The reference fades the whole stage to black on the way in and out rather
         than hard-cutting to the neighbouring sections. Written straight onto the
         node so it costs nothing per frame. */
      const v = veil.current;
      if (v) {
        const edge = 0.045;
        const o = p < edge ? 1 - p / edge : p > 1 - edge ? 1 - (1 - p) / edge : 0;
        v.style.opacity = String(o);
      }

      setActive((prev) => {
        const next = activeZone(p);
        return next === prev ? prev : next;
      });
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

  /* The zones are scroll offsets inside a pinned section, not anchors, so
     /services#ict has to be converted into a scroll position by hand. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const id = window.location.hash.slice(1);
    const i = ZONES.findIndex((z) => z.id === id);
    if (i < 0) return;

    const jump = () => {
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      // stop i+1 of STOPS, since index 0 is the establishing shot
      const p = progressForStop(i + 1);
      window.scrollTo({ top: el.offsetTop + scrollable * p, behavior: "instant" });
    };
    const t = window.setTimeout(jump, 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      ref={root}
      id="scene"
      data-nav-theme="light"
      className="svc-section"
      style={{ height: `${STOPS.length * VIEWPORTS_PER_STOP * 100}vh` }}
    >
      <div className="svc-sticky stage">
        <ServicesStage progress={progress} active={active} />
        <div aria-hidden="true" className="svc-veil" />
        <div ref={veil} aria-hidden="true" className="svc-fade" />

        {!zone && (
          <div className="svc-hint">
            <span className="t-mono">{t.services.hintLabel}</span>
            <p className="t-h3">{t.services.hintBody}</p>
          </div>
        )}

        {/* One card. It sits on the white board, so it is navy rather than gold —
            gold on paper read as an orange slab and pulled away from the palette. */}
        {zone && (
          <article key={zone.id} className="svc-panel">
            <span className="svc-eyebrow">
              <Tick /> {t.services.sector} {zone.index}
            </span>
            <h2>{t.services.lines[zone.id as keyof typeof t.services.lines] ?? zone.title}</h2>
            <p>{zone.body}</p>
          </article>
        )}

        <div className="svc-rail" aria-hidden="true">
          {ZONES.map((z, i) => (
            <span key={z.id} data-on={i <= active ? "true" : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
