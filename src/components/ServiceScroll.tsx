"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video 2 scrubbed by scroll. Each of the five segments carries one service line, and its
 * title + copy animate in over its own frames and out again.
 *
 * Thresholds are NOT the segment boundaries (.2/.4/.6/.8). Each segment opens on the previous
 * segment's subject and reveals its own about halfway through, so labels sit where the subject
 * actually lands — otherwise "Agriculture" appears over an excavator.
 */
const CHAPTERS = [
  {
    at: 0.0,
    title: "Business Consulting\n& Investor Relations",
    body: "Our business consulting division provides tailored, results-driven solutions to help organizations unlock their full potential.",
  },
  {
    at: 0.28,
    title: "ICT Consultancy, AI\n& Cybersecurity",
    body: "Exceptional ICT consultancy and cybersecurity services tailored to the unique needs of your business — from IT strategy and system integration to penetration testing and incident response.",
  },
  {
    at: 0.48,
    title: "Engineering\n& Infrastructure",
    body: "Our commitment to quality, innovation and sustainability ensures that we meet the unique needs of our clients across construction and infrastructure delivery.",
  },
  {
    at: 0.7,
    title: "Agricultural Services\n& Consultancy",
    body: "With our team of experts we provide comprehensive agricultural services and consulting — improving agricultural infrastructure and productivity through innovative solutions.",
  },
  {
    at: 0.88,
    title: "Oil, Gas\n& Green Energy",
    body: "With extensive expertise we help clients navigate the complexities of the oil and gas sector, alongside environmental assessment and green energy advisory.",
  },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ServiceScroll() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const v = video.current;
    const el = root.current;
    if (!v || !el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let duration = 0;
    let target = 0;
    let current = 0;
    let ready = false;
    let raf = 0;

    const progress = () => {
      const r = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      return scrollable <= 0 ? 0 : clamp(-r.top / scrollable, 0, 1);
    };

    const onScroll = () => {
      const p = progress();
      if (!duration && v.duration && isFinite(v.duration)) duration = v.duration;
      target = p * duration;

      let next = 0;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        if (p >= CHAPTERS[i].at) { next = i; break; }
      }
      setIdx(next);
    };

    /* scroll only ever sets a target; the rAF loop eases currentTime toward it.
       Assigning currentTime straight from the scroll handler outpaces the decoder. */
    const tick = () => {
      if (ready) {
        current = lerp(current, target, 0.12);
        if (Math.abs(current - target) > 0.002) {
          try { v.currentTime = current; } catch {}
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const activate = () => {
      if (ready) return;
      ready = true;
      duration = v.duration && isFinite(v.duration) ? v.duration : 25;
      // iOS Safari will not seek a video that has never played
      const nudge = () => { v.play().then(() => v.pause()).catch(() => {}); };
      nudge();
      window.addEventListener("touchstart", nudge, { once: true, passive: true });
      onScroll();
    };

    // preload="auto" often completes before this runs, so the load events never fire for us
    if (v.readyState >= 2) activate();
    v.addEventListener("loadeddata", activate);
    v.addEventListener("canplay", activate);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadeddata", activate);
      v.removeEventListener("canplay", activate);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ch = CHAPTERS[idx];

  return (
    /* 620vh is six-and-a-bit screens of thumb travel; phones get a shorter run through the
       same five chapters (the thresholds are fractions of the section, so they still land
       on the right frames). */
    <section id="services" ref={root} data-nav-theme="dark" className="relative h-[400vh] md:h-[620vh]">
      <div className="stage sticky top-0 overflow-hidden bg-black">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/media/scroll-sequence.mp4"
          poster="/media/scroll-poster.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="svc-scrim absolute inset-0" />

        {/* the top pad clears the fixed nav pill, which otherwise sits over the title on a
            phone once the copy is centred in a short viewport */}
        <div className="wrap absolute inset-0 flex flex-col justify-center pb-10 pt-[104px] md:py-0">
          <div key={idx} className="service-copy max-w-full md:max-w-[min(560px,48vw)]">
            <h2 className="t-h2 whitespace-pre-line" style={{ color: "#fff" }}>
              {ch.title}
            </h2>
            <p className="t-body mt-4 sm:mt-5" style={{ color: "rgba(255,255,255,.74)" }}>
              {ch.body}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* the reel is left-weighted on desktop, where the copy sits in the left half. On a
           phone the copy runs full width, so it needs an even scrim instead. */
        .svc-scrim {
          background: linear-gradient(
            100deg,
            rgba(6, 6, 68, 0.66) 0%,
            rgba(6, 6, 68, 0.34) 42%,
            transparent 72%
          );
        }
        @media (max-width: 767px) {
          .svc-scrim {
            background: linear-gradient(
              180deg,
              rgba(6, 6, 68, 0.5) 0%,
              rgba(6, 6, 68, 0.68) 45%,
              rgba(6, 6, 68, 0.82) 100%
            );
          }
        }
        .service-copy {
          animation: copyIn 0.75s var(--ease) both;
        }
        @keyframes copyIn {
          from { opacity: 0; transform: translateY(22px); filter: blur(5px); }
          to   { opacity: 1; transform: none; filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .service-copy { animation: none; }
        }
      `}</style>
    </section>
  );
}
