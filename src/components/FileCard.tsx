"use client";

import type { ReactNode } from "react";

/**
 * The folded-corner sheet from 21st.dev's stagger-testimonials, pulled out of the
 * carousel and sized to hold a form.
 *
 * Two things make the shape: a clip-path that cuts only the top-right corner, and a 2px
 * bar rotated 45deg from that corner standing in for the crease. The original hard-codes
 * both at 50px (its crease is `sqrt(5000)` wide — 50 x root two, the hypotenuse of the
 * cut). Here the cut is a registered custom property instead, so the fold can be animated
 * open and the crease tracks it.
 */
export type FileState = "idle" | "folding";

export function FileCard({
  children,
  state = "idle",
  className,
  onFolded,
}: {
  children: ReactNode;
  state?: FileState;
  className?: string;
  onFolded?: () => void;
}) {
  return (
    <div
      className={`file-card ${className ?? ""}`}
      data-state={state}
      onAnimationEnd={(e) => {
        if (e.animationName.startsWith("fileFoldAway")) onFolded?.();
      }}
    >
      <span aria-hidden="true" className="file-crease" />
      {children}
    </div>
  );
}
