/**
 * The navy flood with the drawing ring and the counter.
 *
 * Pulled out of Preloader so the first load, a page navigation and a language change
 * all show the same thing — three different triggers, one piece of choreography.
 */
import Lockup from "./Lockup";

/* The ring holds the mark now, so it is sized around it rather than around the three
   letters it used to hold: 96 for the mark, a 24px moat, then the ring at r=72. */
const DIAL = 150;
const MARK = 96;
const R = 72;
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
        {/* Laid out inline rather than with utility classes. Tailwind is dropping a
            number of them in this project — .h-9, .w-10, .lg:flex among others — and a
            missing rule here would put the ring somewhere other than around the mark. */}
        <div
          className="mb-7"
          style={{
            position: "relative",
            width: DIAL,
            height: DIAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            /* the mark's arcs and words ride on currentColor */
            color: "#fff",
          }}
        >
          <svg
            width={DIAL}
            height={DIAL}
            viewBox={`0 0 ${DIAL} ${DIAL}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <circle
              cx={DIAL / 2}
              cy={DIAL / 2}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,.12)"
              strokeWidth="2"
            />
            <circle
              cx={DIAL / 2}
              cy={DIAL / 2}
              r={R}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
              transform={`rotate(-90 ${DIAL / 2} ${DIAL / 2})`}
              style={{ transition: "stroke-dashoffset 120ms linear" }}
            />
          </svg>

          <Lockup size={MARK} />
        </div>

        <div className="overflow-hidden">
          <p className="loader-word">Nomad Investments Limited</p>
        </div>

        <span className="loader-count">{String(pct).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
