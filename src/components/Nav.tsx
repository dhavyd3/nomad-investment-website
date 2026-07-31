"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* Mirrors the chapter thresholds in ServiceScroll so a dropdown pick can land on the
   right frame of the scrubbed section rather than dumping everyone at the top of it. */
const SERVICES = [
  { label: "Business Consulting & Investor Relations", at: 0.0 },
  { label: "ICT Consultancy, AI & Cybersecurity", at: 0.28 },
  { label: "Engineering & Infrastructure", at: 0.48 },
  { label: "Agricultural Services & Consultancy", at: 0.7 },
  { label: "Oil, Gas & Green Energy", at: 0.88 },
];

const LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "#services", menu: SERVICES },
  { label: "Contact Us", href: "#contact" },
];

const LANGS = ["EN", "FR", "SW", "LG"];

function Label({ label }: { label: string }) {
  return <span className="nav-link-label">{label}</span>;
}

function Caret() {
  return (
    <svg className="nav-caret" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Lenis owns the scroll, so hand programmatic jumps to it rather than letting the browser's
   own smooth scroll run against its rAF loop. Falls back when reduced motion left it off. */
function scrollTo(top: number) {
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(top, { duration: 1.2 });
  else window.scrollTo({ top, behavior: "smooth" });
}

/* #services is 620vh of pinned scrubbing, so its chapters are scroll offsets rather than
   anchors. Convert a chapter's progress back into a scroll position. */
function goToService(at: number) {
  const el = document.getElementById("services");
  if (!el) return;
  const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
  // land just past the threshold so the chapter is the active one on arrival
  scrollTo(el.offsetTop + scrollable * Math.min(at + 0.02, 1));
}

export default function Nav() {
  const [lang, setLang] = useState("EN");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const [services, setServices] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const leave = useRef(0);

  useEffect(() => {
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServices(false);
      setOpen(false);
      closeMenu();
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => () => window.clearTimeout(leave.current), []);

  /* Hold the page still behind the open sheet. Lenis drives the real window scroll, so
     `overflow: hidden` on its own does not stop it — it has to be told to stop too. */
  useEffect(() => {
    if (!menu) return;
    const lenis = window.__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [menu]);

  /* Close the sheet if the viewport grows into the desktop layout while it is open,
     otherwise it stays mounted underneath the full nav. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => { if (mq.matches) { setMenu(false); setSub(false); } };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const closeMenu = () => { setMenu(false); setSub(false); };

  /* Native anchor jumps fight Lenis' rAF loop, so route them through it like the
     desktop links already do. Real routes (/about) are left to the router — passing one
     to querySelector throws, and preventDefault would then strand the click. */
  const isAnchor = (href: string) => href.startsWith("#");
  const goToAnchor = (href: string) => {
    closeMenu();
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) window.setTimeout(() => scrollTo(el.offsetTop), 0);
  };

  /* a short grace period on the way out, otherwise the gap between the trigger and the
     panel closes the menu while the pointer is still travelling to it */
  const hold = () => { window.clearTimeout(leave.current); setServices(true); };
  const release = () => {
    window.clearTimeout(leave.current);
    leave.current = window.setTimeout(() => setServices(false), 140);
  };

  /* The brief wants the bar to adapt to whatever it is sitting over. Rather than guess from
     scroll offsets, sample what is actually painted just under the bar and read its flag —
     that stays correct even as section heights change. */
  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const y = 104;
      const hits = document.elementsFromPoint(window.innerWidth / 2, y);
      const owner = hits.find((el) => (el as HTMLElement).dataset?.navTheme);
      setOnLight((owner as HTMLElement | undefined)?.dataset.navTheme === "light");
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sample); };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      data-light={onLight ? "true" : undefined}
      data-menu={menu ? "true" : undefined}
      className="nav-root fixed inset-x-0 top-0 z-50 px-[clamp(14px,4vw,56px)] pt-[clamp(12px,2vw,20px)]"
    >
      {/* the rows are translucent, so the page behind has to be covered or the hero type
          reads straight through the gaps between them */}
      {menu && <div aria-hidden="true" className="nav-scrim lg:hidden" />}

      {/* On mobile the bar carries nothing but the mark and the burger, so it shrinks to
          its content and sits right — on.energy's pattern. Opening it spans the width
          again. Desktop keeps the centred 1240px pill either way. */}
      <div
        className={`nav-pill flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:mx-auto lg:w-full lg:max-w-[1240px] lg:gap-6 ${
          menu ? "w-full" : "ml-auto w-fit"
        }`}
      >
        {/* logo + wordmark */}
        {/* no text-white here: .nav-root a supplies --nav-fg, which turns navy over the
            light sections. Hardcoding white left the wordmark at 1.04:1 on them. */}
        <a href="#top" className="flex shrink-0 items-center gap-3 no-underline">
          <span
            className="grid h-9 w-9 place-items-center rounded-full border-2 text-[7px] tracking-[0.08em]"
            style={{ borderColor: "var(--gold)", fontFamily: "var(--font-geist-mono)" }}
          >
            NIL
          </span>
          <span className="text-[12px] font-medium leading-[1.15] tracking-[0.02em] sm:text-[13px]">
            NOMAD INVESTMENTS
            <br />
            LIMITED
          </span>
        </a>

        {/* spacing, per the brief. Hidden on mobile so the shrunken bar does not carry a
            gap either side of a zero-width spacer. */}
        <div className="hidden flex-1 lg:block" />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) =>
            l.menu ? (
              <div
                key={l.href}
                className="relative"
                onMouseEnter={hold}
                onMouseLeave={release}
                onFocus={hold}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setServices(false);
                }}
              >
                <button
                  type="button"
                  className="nav-link"
                  data-open={services ? "true" : undefined}
                  aria-expanded={services}
                  aria-haspopup="true"
                  onClick={() => {
                    setServices(false);
                    const el = document.getElementById("services");
                    if (el) scrollTo(el.offsetTop);
                  }}
                >
                  <Label label={l.label} />
                  <Caret />
                </button>

                {services && (
                  <ul className="nav-pill nav-menu">
                    {l.menu.map((s) => (
                      <li key={s.label}>
                        <button
                          type="button"
                          className="nav-menu-item"
                          onClick={() => { setServices(false); goToService(s.at); }}
                        >
                          {s.label}
                          <svg className="tick" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              isAnchor(l.href) ? (
                <a
                  key={l.href}
                  className="nav-link"
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); goToAnchor(l.href); }}
                >
                  <Label label={l.label} />
                </a>
              ) : (
                <Link key={l.href} className="nav-link" href={l.href} onClick={closeMenu}>
                  <Label label={l.label} />
                </Link>
              )
            )
          )}
        </nav>

        {/* language selector */}
        <div ref={box} className="relative hidden lg:block">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Select language"
            className="nav-chip flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] tracking-[0.08em]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {lang}
            <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden="true"
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s var(--ease)" }}>
              <path d="M0 0l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          {open && (
            <ul
              className="nav-pill absolute right-0 top-[calc(100%+8px)] w-[86px] list-none overflow-hidden p-1"
              style={{ animation: "none" }}
            >
              {LANGS.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => { setLang(c); setOpen(false); }}
                    data-current={c === lang ? "true" : undefined}
                    className="nav-opt block w-full rounded px-3 py-2 text-left text-[12px] tracking-[0.08em]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <a href="#contact" className="btn btn-gold hidden lg:inline-flex">
          Get in touch <span className="arrow">→</span>
        </a>

        {/* on.energy separates the mark from the toggle with a hairline */}
        <span aria-hidden="true" className="nav-divider lg:hidden" />

        {/* mobile toggle — the live site is missing this entirely */}
        <button
          onClick={() => (menu ? closeMenu() : setMenu(true))}
          aria-expanded={menu}
          aria-label={menu ? "Close menu" : "Menu"}
          className="nav-chip ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-md border lg:hidden"
        >
          <span className="relative block h-[10px] w-[18px]">
            {[0, 4, 8].map((t, i) => (
              <span
                key={t}
                /* bg-current, not bg-white: --nav-fg turns navy over the light sections and
                   a white burger vanished against them */
                className="absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300"
                style={{
                  top: t,
                  transform: menu
                    ? i === 0
                      ? "translateY(4px) rotate(45deg)"
                      : i === 2
                        ? "translateY(-4px) rotate(-45deg)"
                        : "scaleX(0)"
                    : "none",
                }}
              />
            ))}
          </span>
        </button>
      </div>

      {menu && (
        /* The sheet is inside a fixed header, so it needs its own scroller — with the
           services group expanded a landscape phone cannot reach the bottom otherwise. */
        <div className="nav-sheet lg:hidden">
          <div className="nav-sheet-list">
            {LINKS.map((l) =>
              l.menu ? (
                <div key={l.href}>
                  <button
                    type="button"
                    className="nav-sheet-row"
                    aria-expanded={sub}
                    onClick={() => setSub((v) => !v)}
                  >
                    {l.label}
                    <svg
                      className="nav-caret"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      style={{ transform: sub ? "rotate(180deg)" : "none" }}
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {sub && (
                    <div className="nav-sheet-sub">
                      {l.menu.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          className="nav-sheet-subrow"
                          onClick={() => { closeMenu(); goToService(s.at); }}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                isAnchor(l.href) ? (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); goToAnchor(l.href); }}
                    className="nav-sheet-row"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} onClick={closeMenu} className="nav-sheet-row">
                    {l.label}
                  </Link>
                )
              )
            )}
          </div>

          {/* pinned to the bottom of the sheet, as on the reference */}
          <div className="nav-sheet-foot">
            <div className="flex items-center gap-1">
              {LANGS.map((c) => (
                <button
                  key={c}
                  onClick={() => setLang(c)}
                  aria-pressed={c === lang}
                  className={`rounded px-3 py-2 text-[12px] tracking-[0.08em] ${
                    c === lang ? "text-[var(--gold)]" : "text-white/60"
                  }`}
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {c}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); goToAnchor("#contact"); }}
              className="btn btn-gold mt-3 w-full justify-center"
            >
              Get in touch <span className="arrow">→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
