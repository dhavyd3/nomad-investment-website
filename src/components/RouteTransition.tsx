"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import LoaderPanel from "./LoaderPanel";

/**
 * The loading panel for everything after the first paint: moving between pages, and
 * switching language.
 *
 * Two signals drive it. `begin()` covers the screen; `end()` says the new content is
 * ready. It only lifts once BOTH the minimum hold has elapsed and `end()` has been
 * called — so a fast navigation still shows the full animation instead of a flicker,
 * and a slow one stays covered until the page is actually there.
 *
 * A hard timeout lifts it regardless. An overlay that can get stuck at z-999 over the
 * whole site is a worse failure than one that lifts early.
 */

const MIN_HOLD_MS = 850; // long enough to read the counter
const LIFT_MS = 900; // matches the panel's transform transition
const SAFETY_MS = 5000;

type Ctx = { begin: () => void; end: () => void };
const TransitionCtx = createContext<Ctx | null>(null);

export function useRouteTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("useRouteTransition must be used inside <RouteTransition>");
  return ctx;
}

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "covering" | "leaving">("idle");
  const [pct, setPct] = useState(0);

  const ready = useRef(false);
  const held = useRef(false);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const firstPath = useRef(pathname);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
  };

  const lift = useCallback(() => {
    setPhase((p) => (p === "covering" ? "leaving" : p));
    timers.current.push(
      window.setTimeout(() => {
        setPhase("idle");
        setPct(0);
      }, LIFT_MS)
    );
  }, []);

  const maybeLift = useCallback(() => {
    if (ready.current && held.current) lift();
  }, [lift]);

  const begin = useCallback(() => {
    clearTimers();
    ready.current = false;
    held.current = false;
    setPct(0);
    setPhase("covering");

    /* The counter runs on rAF for smoothness, but every phase change is on a timer —
       a background tab throttles rAF, and the panel must still resolve. */
    const started = performance.now();
    const step = () => {
      const t = (performance.now() - started) / MIN_HOLD_MS;
      const eased = 1 - Math.pow(1 - Math.min(t, 1), 2.2);
      setPct(Math.round(eased * 100));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);

    timers.current.push(
      window.setTimeout(() => {
        held.current = true;
        setPct(100);
        maybeLift();
      }, MIN_HOLD_MS)
    );
    timers.current.push(window.setTimeout(lift, SAFETY_MS));
  }, [lift, maybeLift]);

  const end = useCallback(() => {
    ready.current = true;
    maybeLift();
  }, [maybeLift]);

  /* A navigation has landed when the pathname changes. Skipped on mount so the first
     paint is left to Preloader, which owns that moment. */
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = pathname;
    end();
  }, [pathname, end]);

  /* Cover on the click rather than on arrival, so the outgoing page is hidden while
     the next one is being fetched. One delegated listener beats wrapping every Link. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // same page, or a jump within it — nothing to load
      if (url.pathname === window.location.pathname) return;

      begin();
    };

    /* Capture phase, not bubble. Next's <Link> calls preventDefault() in its own
       handler to take over the navigation, and React attaches that inside document —
       so a bubble listener sees defaultPrevented already true and skips every link. */
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [begin]);

  useEffect(() => clearTimers, []);

  return (
    <TransitionCtx.Provider value={{ begin, end }}>
      {children}
      {phase !== "idle" && <LoaderPanel pct={pct} leaving={phase === "leaving"} />}
    </TransitionCtx.Provider>
  );
}
