"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Every reference site opens with one of these. Breakthrough Energy holds a full-viewport
 * brand-colour flood with the mark centred; ON Energy counts in. This does both: a navy
 * flood, the ring mark drawing itself, a counter, then the whole panel lifts away to
 * hand off to the hero.
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

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[999] grid place-items-center"
      style={{
        background: "var(--navy)",
        transform: leaving ? "translateY(-100%)" : "none",
        transition: "transform 900ms cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* soft gold rake so the panel belongs to the same world as the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 90% at 22% 30%, rgba(255,222,89,.16), transparent 62%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <svg width="86" height="86" viewBox="0 0 86 86" className="mb-7">
          <circle cx="43" cy="43" r="41" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
          <circle
            cx="43"
            cy="43"
            r="41"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 41}
            strokeDashoffset={2 * Math.PI * 41 * (1 - pct / 100)}
            transform="rotate(-90 43 43)"
            style={{ transition: "stroke-dashoffset 120ms linear" }}
          />
          <text
            x="43"
            y="47"
            textAnchor="middle"
            fill="#fff"
            style={{ font: "400 9px var(--font-geist-mono), monospace", letterSpacing: "0.1em" }}
          >
            NIL
          </text>
        </svg>

        <div className="overflow-hidden">
          <p
            className="text-center"
            style={{
              fontWeight: 300,
              fontSize: "clamp(1.4rem,3vw,2.4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#fff",
              transform: leaving ? "translateY(-110%)" : "none",
              transition: "transform 600ms cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          >
            Nomad Investments Limited
          </p>
        </div>

        <span
          className="mt-5 block"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "0.6875rem",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,.45)",
          }}
        >
          {String(pct).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}
