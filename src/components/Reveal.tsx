"use client";

import { useEffect, useRef } from "react";

/**
 * The two reveals terminal-industries uses on its about page.
 *
 * `RevealWords` is for headings: each word rises out of a clipped line and fades in, on a
 * stagger. `RevealChars` is for body copy: the paragraph is set dim and its characters
 * light up as the block travels through the viewport, so the copy reads as you scroll
 * rather than all at once.
 */

const splitWords = (text: string) => text.split(/(\s+)/);

export function RevealWords({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  style,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("in");
        io.disconnect();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // whitespace is kept as its own chunk so wrapping behaves like normal text
  const parts = splitWords(text);
  let wordIndex = 0;

  return (
    <Tag ref={root as never} className={`rv-words ${className ?? ""}`} style={style}>
      {parts.map((p, i) => {
        if (/^\s+$/.test(p)) return <span key={i}> </span>;
        const d = delay + wordIndex * 0.055;
        wordIndex++;
        return (
          <span key={i} className="rv-word">
            <span className="rv-word-in" style={{ transitionDelay: `${d}s` }}>
              {p}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

export function RevealChars({ text, className }: { text: string; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>(".rv-char"));
    if (!chars.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chars.forEach((c) => c.classList.add("lit"));
      return;
    }

    let raf = 0;
    let lit = -1;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // run the sweep while the block crosses the middle band of the viewport
      const start = window.innerHeight * 0.86;
      const end = window.innerHeight * 0.36;
      const p = (start - r.top) / (start - end + r.height);
      const next = Math.round(Math.min(Math.max(p, 0), 1) * chars.length);
      if (next === lit) return;
      // only touch the characters that actually changed state
      if (next > lit) for (let i = Math.max(lit, 0); i < next; i++) chars[i]?.classList.add("lit");
      else for (let i = lit - 1; i >= next; i--) chars[i]?.classList.remove("lit");
      lit = next;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <p ref={root} className={`rv-chars ${className ?? ""}`}>
      {/* split per word so a word never breaks across lines, then per char inside it */}
      {splitWords(text).map((part, i) =>
        /^\s+$/.test(part) ? (
          <span key={i} className="rv-char"> </span>
        ) : (
          <span key={i} className="rv-wordwrap">
            {Array.from(part).map((ch, j) => (
              <span key={j} className="rv-char">
                {ch}
              </span>
            ))}
          </span>
        )
      )}
    </p>
  );
}
