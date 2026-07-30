"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Terminal's cursor-following "scroll to explore" tag. It trails the pointer with a lag
 * (a lerp, not a hard follow) and only exists while the pointer is inside the hero.
 * Hidden on touch, where there is no cursor to follow.
 */
export default function ScrollCue({ within }: { within: React.RefObject<HTMLElement | null> }) {
  const tag = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const host = within.current;
    if (!host) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0, my = 0, x = 0, y = 0, raf = 0, seeded = false;
    let px = -1, py = -1; // last known pointer position, kept so scroll can re-test containment

    const inside = () => {
      if (px < 0) return false;
      const r = host.getBoundingClientRect();
      // the hero is pinned, so once it has scrolled past, its rect leaves the viewport
      return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom
        && r.bottom > 80 && r.top < window.innerHeight;
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      const ok = inside();
      setOn(ok);
      if (!ok) return;
      mx = px;
      my = py;
      if (!seeded) { x = mx; y = my; seeded = true; }
    };

    // scrolling out of the hero must dismiss it even if the pointer never moves
    const onScroll = () => setOn(inside());

    const tick = () => {
      x += (mx - x) * 0.13;
      y += (my - y) * 0.13;
      if (tag.current) tag.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [within]);

  return (
    <div
      ref={tag}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{ opacity: on ? 1 : 0, transition: "opacity 420ms var(--ease)" }}
    >
      <span
        className="block -translate-x-1/2 translate-y-6 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.82)",
          textShadow: "0 1px 14px rgba(0,0,0,.6)",
        }}
      >
        Scroll to explore
      </span>
    </div>
  );
}
