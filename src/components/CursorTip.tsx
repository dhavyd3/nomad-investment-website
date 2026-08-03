"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The small label that appears beside the pointer after a short hover — the same
 * affordance a browser's native `title` gives, but styled to match the site instead
 * of looking like OS chrome.
 *
 * Anything opts in by carrying `data-tip="…"`. One delegated listener covers the whole
 * document, so new elements need no wiring.
 *
 * Mouse only: it listens for pointerover and bails on coarse pointers. On a phone
 * "hover" is a tap, and a tooltip that appears on tap is just a thing in the way.
 */
const DELAY_MS = 550;
const OFFSET_X = 16;
const OFFSET_Y = 20;
const EDGE = 8;

export default function CursorTip() {
  const [tip, setTip] = useState<string | null>(null);
  const node = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const point = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const place = () => {
      const el = node.current;
      if (!el) return;
      // flip to the other side of the cursor rather than run off the edge
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      let x = point.current.x + OFFSET_X;
      let y = point.current.y + OFFSET_Y;
      if (x + w > window.innerWidth - EDGE) x = point.current.x - w - OFFSET_X / 2;
      if (y + h > window.innerHeight - EDGE) y = point.current.y - h - OFFSET_Y / 2;
      el.style.transform = `translate3d(${Math.max(EDGE, x)}px, ${Math.max(EDGE, y)}px, 0)`;
    };

    const clear = () => {
      window.clearTimeout(timer.current);
      timer.current = 0;
    };

    const hide = () => {
      clear();
      setTip(null);
    };

    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = (e.target as HTMLElement | null)?.closest?.("[data-tip]");
      const label = target?.getAttribute("data-tip");
      clear();
      if (!label) {
        setTip(null);
        return;
      }
      point.current = { x: e.clientX, y: e.clientY };
      timer.current = window.setTimeout(() => {
        setTip(label);
        // position before the first paint of the visible state
        requestAnimationFrame(place);
      }, DELAY_MS);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      point.current = { x: e.clientX, y: e.clientY };
      if (timer.current || node.current?.dataset.show) place();
    };

    document.addEventListener("pointerover", over);
    document.addEventListener("pointermove", move, { passive: true });
    // a click is a decision made — the hint has done its job
    document.addEventListener("pointerdown", hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);

    return () => {
      clear();
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", hide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  /* Always mounted, shown by attribute: keeping the node in the DOM means it can be
     positioned before it becomes visible, so it never flashes at 0,0 first. */
  return (
    <div ref={node} className="cursor-tip" data-show={tip ? "true" : undefined} aria-hidden="true">
      {tip}
    </div>
  );
}
