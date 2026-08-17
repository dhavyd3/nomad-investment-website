"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Lockup from "./Lockup";

/* The roundel and wordmark appear in the nav bar and in both footers. Wherever it
   shows up it is the way back to the homepage, so the markup lives here once rather than
   being re-typed — and re-linked — at each site. */

/* The lockup carries INVESTMENTS / LIMITED inside the arcs, so the typed wordmark that used
   to sit beside it would only repeat itself and is gone.

   These sizes are set by what the inner lines need. They are 4.8% of the mark's height, so
   at the old 44 they came out 2.12px and smeared; 88 puts them at 4.24px, which reads. Below
   about 80 use Roundel instead — it drops the words rather than showing mush.

   A pixel number rather than a Tailwind height or width class: Tailwind is not emitting
   .h-9, .h-10, .h-11 or .w-10 in this project, and an svg has no intrinsic height to fall
   back on, so a missing class let it stretch to fill its parent. */
const SIZES = {
  nav: { mark: 88 },
  footer: { mark: 96 },
  compact: { mark: 88 },
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
      <Lockup size={s.mark} className="shrink-0" />
    </Link>
  );
}
