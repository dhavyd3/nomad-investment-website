/**
 * The navy flood with the drawing ring and the counter.
 *
 * Pulled out of Preloader so the first load, a page navigation and a language change
 * all show the same thing — three different triggers, one piece of choreography.
 */
const R = 41;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function LoaderPanel({
  pct,
  leaving,
}: {
  pct: number;
  leaving: boolean;
}) {
  return (
    <div aria-hidden="true" className="loader-panel" data-leaving={leaving || undefined}>
      {/* soft gold rake, so the panel belongs to the same world as the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 90% at 22% 30%, rgba(255,222,89,.16), transparent 62%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <svg width="86" height="86" viewBox="0 0 86 86" className="mb-7">
          <circle cx="43" cy="43" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
          <circle
            cx="43"
            cy="43"
            r={R}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
            transform="rotate(-90 43 43)"
            style={{ transition: "stroke-dashoffset 120ms linear" }}
          />
          <text
            x="43"
            y="47"
            textAnchor="middle"
            fill="#fff"
            style={{ font: "400 9px var(--font-geist-mono), monospace", letterSpacing: "0.1em" }}
          >
            NIL
          </text>
        </svg>

        <div className="overflow-hidden">
          <p className="loader-word">Nomad Investments Limited</p>
        </div>

        <span className="loader-count">{String(pct).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
