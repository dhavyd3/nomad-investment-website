"use client";

import { useEffect, useRef, useState } from "react";
import LoaderPanel from "./LoaderPanel";

/**
 * The opening flood, on first paint only. Every reference site has one: a brand-colour
 * panel, the mark drawing itself, a counter, then the whole thing lifts away to hand
 * off to the hero.
 *
 * Navigations and language changes reuse the same panel through RouteTransition — this
 * component owns the first load and nothing else.
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const started = performance.now();
    const MIN = 1500; // hold long enough to read, short enough not to annoy

    const step = () => {
      const t = performance.now() - started;
      // ease toward 100 rather than ticking linearly — reads less like a fake loader
      const eased = 1 - Math.pow(1 - Math.min(t / MIN, 1), 2.2);
      setPct(Math.round(eased * 100));
      if (t < MIN) {
        raf.current = requestAnimationFrame(step);
      } else {
        setLeaving(true);
        window.setTimeout(() => {
          setGone(true);
          document.body.style.overflow = "";
          window.dispatchEvent(new Event("nomad:ready"));
        }, 900);
      }
    };
    raf.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf.current);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return <LoaderPanel pct={pct} leaving={leaving} />;
}
