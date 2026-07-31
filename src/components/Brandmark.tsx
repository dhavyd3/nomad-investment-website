"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* The NIL roundel and wordmark appear in the nav bar and in both footers. Wherever it
   shows up it is the way back to the homepage, so the markup lives here once rather than
   being re-typed — and re-linked — at each site. */

/* The three placements differ only in scale: the nav lets the wordmark grow a point past
   the small breakpoint, the homepage footer sits a size down from the nav. */
const SIZES = {
  nav: { mark: "h-9 w-9 text-[7px]", word: "text-[12px] sm:text-[13px]" },
  footer: { mark: "h-9 w-9 text-[7px]", word: "text-[12px]" },
  compact: { mark: "h-8 w-8 text-[6px]", word: "text-[12px]" },
};

export default function Brandmark({
  size = "footer",
  onNavigate,
  className = "",
}: {
  size?: keyof typeof SIZES;
  /* lets the nav shut its mobile sheet on the way out */
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const s = SIZES[size];

  /* On the homepage a push to "/" is a no-op that leaves the reader wherever they had
     scrolled to — which reads as a dead click. Ride back to the top instead, handed to
     Lenis the way the nav's own jumps are: it owns the scroll, and the browser's smooth
     behaviour would run against its rAF loop. */
  const click = (e: React.MouseEvent) => {
    onNavigate?.();
    if (pathname !== "/") return;
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      href="/"
      onClick={click}
      aria-label="Nomad Investments Limited — home"
      className={`flex shrink-0 items-center gap-3 no-underline ${className}`}
    >
      <span
        className={`grid place-items-center rounded-full border-2 tracking-[0.08em] ${s.mark}`}
        style={{ borderColor: "var(--gold)", fontFamily: "var(--font-geist-mono)" }}
      >
        NIL
      </span>
      <span className={`font-medium leading-[1.15] tracking-[0.02em] ${s.word}`}>
        NOMAD INVESTMENTS
        <br />
        LIMITED
      </span>
    </Link>
  );
}
