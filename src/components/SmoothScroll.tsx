"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and ScrollTrigger is told to
 * ask Lenis for scroll position. Wiring it this way is what keeps a scrubbed video in
 * lockstep with the smoothing instead of fighting it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    /* Nav needs to drive programmatic scrolls through Lenis. Going via window.scrollTo
       instead would run the browser's own smooth scroll against Lenis' rAF loop. */
    window.__lenis = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    /* No scrollerProxy here on purpose. Lenis in its default mode drives the real window
       scroll rather than a transform, so ScrollTrigger reads scrollTop normally — registering
       a proxy against document.body silently breaks every trigger on the page. */
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
