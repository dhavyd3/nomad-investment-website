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
    <section ref={root} id="top" data-nav-theme="dark" className="relative h-[260vh]">
      <div ref={stage} className="sticky top-0 h-screen overflow-hidden">
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
          {/* left-weighted scrim: the reel is not uniformly mid-tone, so white type needs help */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(6,6,68,.62) 0%, rgba(6,6,68,.3) 40%, transparent 72%)",
            }}
          />
        </div>

        <div className="wrap pointer-events-none absolute inset-0 flex flex-col justify-center">
          <h1 className="t-h1 m-0" style={{ color: "#fff" }}>
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <span
                  ref={(el) => { words.current[i] = el; }}
                  className="block will-change-transform"
                  style={{ color: i === 2 ? "var(--gold)" : "#fff", paddingLeft: `${i * 4}vw` }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>
          <p ref={lead} className="t-lead mt-7 max-w-[46ch]" style={{ color: "rgba(255,255,255,.72)" }}>
            A premier Ugandan consulting company. Seven disciplines, one operating standard.
          </p>
        </div>
      </div>

      <ScrollCue within={stage} />
    </section>
  );
}
