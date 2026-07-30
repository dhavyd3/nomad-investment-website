"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollCue from "./ScrollCue";

const WORDS = ["Strategize.", "Organize.", "Globalize."];

/**
 * Breakthrough Energy's hero: one looping reel full-bleed, huge type over it. Scrolling
 * takes the words away one at a time, then the panel shrinks well down and lifts up out
 * of frame, handing off to the next section underneath rather than cutting to it.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const video = useRef<HTMLVideoElement>(null);
  const lead = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const v = video.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // words leave one at a time
      words.current.forEach((w, i) => {
        if (!w) return;
        tl.to(
          w,
          { yPercent: -120, opacity: 0, filter: "blur(6px)", ease: "power2.in", duration: 0.16 },
          i * 0.12
        );
      });

      // lead paragraph leaves with the last word rather than lingering alone
      tl.to(lead.current, { opacity: 0, y: -24, filter: "blur(5px)", ease: "power2.in", duration: 0.14 }, 0.34);

      // then the panel pulls right down and lifts away, per breakthroughenergy
      tl.to(frame.current, { scale: 0.46, borderRadius: 26, ease: "power1.inOut", duration: 0.56 }, 0.2)
        .to(frame.current, { yPercent: -118, opacity: 0, ease: "power2.in", duration: 0.3 }, 0.72);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    /* 260vh of scrub is a long way to travel with a thumb — phones get a shorter run at
       the same choreography. */
    <section ref={root} id="top" data-nav-theme="dark" className="relative h-[190vh] md:h-[260vh]">
      <div ref={stage} className="stage sticky top-0 overflow-hidden">
        <div
          ref={frame}
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{ background: "#000" }}
        >
          <video
            ref={video}
            className="h-full w-full object-cover"
            src="/media/hero-reel.mp4"
            poster="/media/hero-poster.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
          />
          {/* Scrim: the reel is not uniformly mid-tone, so white type needs help. Weighted
              left on desktop where the type sits in the left half; on a phone the type runs
              the full width, so it needs an even vertical wash instead. */}
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div className="wrap pointer-events-none absolute inset-0 flex flex-col justify-center">
          <h1 className="t-h1 m-0" style={{ color: "#fff" }}>
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <span
                  ref={(el) => { words.current[i] = el; }}
                  /* the staircase indent is dropped on narrow screens — see .hero-line;
                     8vw of it would push "Globalize." off a phone */
                  className="hero-line block will-change-transform"
                  style={{ color: i === 2 ? "var(--gold)" : "#fff", "--i": i } as React.CSSProperties}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p ref={lead} className="t-lead mt-5 max-w-[46ch] sm:mt-7" style={{ color: "rgba(255,255,255,.72)" }}>
            A premier Ugandan consulting company. Seven disciplines, one operating standard.
          </p>
        </div>
      </div>

      <ScrollCue within={stage} />
    </section>
  );
}
