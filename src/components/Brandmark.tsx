"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Roundel from "./Roundel";

/* The roundel and wordmark appear in the nav bar and in both footers. Wherever it
   shows up it is the way back to the homepage, so the markup lives here once rather than
   being re-typed — and re-linked — at each site. */

/* The three placements differ only in scale: the nav lets the wordmark grow a point past
   the small breakpoint, the homepage footer sits a size down from the nav.

   The mark runs a size above the wordmark it sits with. The roundel is two thin arcs, and
   at the old h-9 they came out 2.27px and 1.50px — a hairline that disappeared against the
   bar. h-11 carries them to roughly 3.4px and 2.5px. */
const SIZES = {
  nav: { mark: "h-11 w-11", word: "text-[12px] sm:text-[13px]" },
  footer: { mark: "h-11 w-11", word: "text-[12px]" },
  compact: { mark: "h-10 w-10", word: "text-[12px]" },
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
      <Roundel className={`shrink-0 ${s.mark}`} />
      <span className={`font-medium leading-[1.15] tracking-[0.02em] ${s.word}`}>
        NOMAD INVESTMENTS
        <br />
        LIMITED
      </span>
    </Link>
  );
}
