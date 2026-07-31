"use client";

import { useEffect, useRef } from "react";
import ServicesScene, { useActiveZone } from "./ServicesScene";
import { ZONES } from "./servicesZones";

/**
 * The pinned half of the services page. The section is tall; the stage inside it sticks,
 * and scroll position picks the zone the camera flies to. Panels are keyed on the zone so
 * each one re-enters rather than cross-fading its text in place.
 */
export default function ServicesScroll() {
  const root = useRef<HTMLElement>(null);
  const active = useActiveZone(root);
  const zone = active >= 0 ? ZONES[active] : null;

  /* The zones are scroll offsets inside a pinned section, not anchors, so /services#ict
     has to be converted into a scroll position by hand. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const id = window.location.hash.slice(1);
    const i = ZONES.findIndex((z) => z.id === id);
    if (i < 0) return;

    const jump = () => {
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const lead = 0.07;
      // aim at the middle of the zone's band so it is unambiguously the active one
      const p = lead + ((i + 0.5) / ZONES.length) * (1 - lead);
      window.scrollTo({ top: el.offsetTop + scrollable * p, behavior: "instant" });
    };
    // after layout settles, or the offsets are measured against a half-built page
    const t = window.setTimeout(jump, 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      ref={root}
      id="scene"
      data-nav-theme="dark"
      className="svc-section"
      style={{ height: `${(ZONES.length + 1) * 100}vh` }}
    >
      <div className="svc-sticky stage">
        <ServicesScene active={active} />
        <div aria-hidden="true" className="svc-veil" />

        {!zone && (
          <div className="svc-hint">
            <span className="t-mono">Five disciplines, one board</span>
            <p className="t-h3">Scroll to move across the operation.</p>
          </div>
        )}

        {zone && (
          <article key={zone.id} className="svc-panel">
            <span className="t-mono svc-panel-n">
              {zone.index} / {String(ZONES.length).padStart(2, "0")}
            </span>
            <h2 className="t-h3 mt-4">{zone.title}</h2>
            <p className="t-body mt-5">{zone.body}</p>
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
