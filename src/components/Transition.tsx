"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Variant = "shadow" | "streak";

/**
 * Section blends. The earlier version used a clip-path diagonal, and that hard edge is
 * exactly the "visible straight line" problem — a clipped edge is still an edge.
 *
 * This instead does what the reference sites do: a tall band whose colour eases from one
 * section into the next across many stops, with a soft inner shadow sitting over the seam
 * so there is no measurable boundary at all. Nothing here is clipped.
 */
export default function Transition({
  variant = "shadow",
  from = "var(--ink)",
  to = "var(--navy-deep)",
  navTheme = "dark",
  height = "34vh",
}: {
  variant?: Variant;
  from?: string;
  to?: string;
  navTheme?: "dark" | "light";
  height?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const moving = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        moving.current,
        { yPercent: -22, xPercent: -10, opacity: 0.5 },
        {
          yPercent: 22,
          xPercent: 10,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-nav-theme={navTheme}
      className="relative w-full overflow-hidden"
      style={{
        height,
        minHeight: 200,
        /* many stops, not two — a 2-stop gradient still reads as a band */
        background: `linear-gradient(to bottom,
          ${from} 0%,
          color-mix(in srgb, ${from} 88%, ${to}) 18%,
          color-mix(in srgb, ${from} 62%, ${to}) 38%,
          color-mix(in srgb, ${from} 32%, ${to}) 62%,
          color-mix(in srgb, ${from} 10%, ${to}) 82%,
          ${to} 100%)`,
      }}
    >
      {/* soft shadow across the seam — this is what removes the perceived line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[70%] -translate-y-1/2"
        style={{
          background: "radial-gradient(70% 100% at 50% 50%, rgba(0,0,0,.42), transparent 72%)",
          filter: "blur(26px)",
        }}
      />

      <div ref={moving} className="absolute inset-0 will-change-transform">
        {variant === "streak" && (
          <div
            className="absolute inset-x-[-12%] top-[-30%] h-[160%]"
            style={{
              background:
                "radial-gradient(52% 110% at 28% 50%, rgba(255,222,89,.2), transparent 62%)",
              filter: "blur(34px)",
            }}
          />
        )}
      </div>
    </div>
  );
}
