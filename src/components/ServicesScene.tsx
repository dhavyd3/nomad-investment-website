"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ZONES, OVERVIEW } from "./servicesZones";

/**
 * Isometric diorama for the services page, with a scroll-driven camera.
 *
 * on.energy pins a three.js scene over ~24 viewports of scroll and flies a camera between
 * points of interest, projecting HTML markers from 3D coordinates. The same reading is had
 * here without the 3D pipeline: the whole scene is one SVG, and the "camera" is the
 * viewBox, lerped toward the active zone's rectangle every frame. Nothing re-renders while
 * it moves — the attribute is written straight onto the element.
 *
 * Zones are the five service lines. Zone 1 lifts the warehouse roof off to show the floor
 * inside, the way the reference swaps its floor texture mid-scroll.
 */

/* ---------- isometric helpers ---------- */
const TX = 0.8660254; // cos 30deg
const TY = 0.5; // sin 30deg
const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * TX, (x + y) * TY - z];
const pts = (list: [number, number][]) => list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

/* Lifted a couple of stops from the first pass — navy-on-near-black read as one dark
   smudge once the veil went over it. */
const C = {
  ground: "#15153e",
  groundEdge: "#0b0b26",
  navy: "#232370",
  navyDim: "#191952",
  navyLit: "#31319a",
  steel: "#3d3d80",
  steelDim: "#2b2b5e",
  steelLit: "#5252a8",
  gold: "#ffde59",
  goldDim: "#b09638",
  crop: "#397f46",
  cropLit: "#4da35c",
  soil: "#5a3c26",
  soilLit: "#6f4b30",
  rust: "#a06a32",
  pale: "#dcdcec",
};

/** A box on the iso grid: top face plus its two visible sides, shaded. */
function Box({
  x, y, w, d, h, z = 0, top = C.navyLit, left = C.navyDim, right = C.navy, opacity,
}: {
  x: number; y: number; w: number; d: number; h: number; z?: number;
  top?: string; left?: string; right?: string; opacity?: number;
}) {
  const t = z + h;
  return (
    <g opacity={opacity}>
      <polygon points={pts([iso(x, y, t), iso(x + w, y, t), iso(x + w, y + d, t), iso(x, y + d, t)])} fill={top} />
      <polygon points={pts([iso(x, y + d, t), iso(x + w, y + d, t), iso(x + w, y + d, z), iso(x, y + d, z)])} fill={left} />
      <polygon points={pts([iso(x + w, y, t), iso(x + w, y + d, t), iso(x + w, y + d, z), iso(x + w, y, z)])} fill={right} />
    </g>
  );
}

/** Flat ground tile. */
function Tile({ x, y, w, d, fill }: { x: number; y: number; w: number; d: number; fill: string }) {
  return <polygon points={pts([iso(x, y), iso(x + w, y), iso(x + w, y + d), iso(x, y + d)])} fill={fill} />;
}

/** A person, at the scale the reference draws its cars — a few pixels, read by silhouette. */
function Figure({ x, y, z = 0, c = C.pale, className }: { x: number; y: number; z?: number; c?: string; className?: string }) {
  const [sx, sy] = iso(x, y, z);
  /* the positioning transform has to live on its own node: a CSS transform from the
     animation class would otherwise replace the attribute and drop the figure at 0,0 */
  return (
    <g transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`}>
      <g className={className}>
        <rect x={-1.6} y={-9} width={3.2} height={6.4} rx={1.5} fill={c} />
        <circle cx={0} cy={-11} r={1.9} fill={c} />
      </g>
    </g>
  );
}

/* ---------- zone 0: economic city ---------- */
function City() {
  const towers = useMemo(
    () => [
      { x: 0, y: 0, w: 26, d: 26, h: 96 }, { x: 34, y: 4, w: 22, d: 22, h: 64 },
      { x: 4, y: 34, w: 22, d: 24, h: 120 }, { x: 36, y: 34, w: 26, d: 26, h: 82 },
      { x: -30, y: 12, w: 20, d: 20, h: 54 }, { x: -26, y: 44, w: 24, d: 22, h: 70 },
      { x: 68, y: 16, w: 20, d: 24, h: 100 }, { x: 66, y: 50, w: 22, d: 20, h: 58 },
    ],
    []
  );
  return (
    <g>
      <Tile x={-46} y={-14} w={158} d={104} fill={C.ground} />
      {towers.map((t, i) => (
        <g key={i}>
          <Box {...t} top={C.steelLit} left={C.navyDim} right={C.navy} />
          {/* lit windows on the sunward face */}
          {Array.from({ length: Math.floor(t.h / 16) }).map((_, r) =>
            Array.from({ length: 3 }).map((__, cIdx) => {
              const [wx, wy] = iso(t.x + t.w, t.y + 4 + cIdx * 6, t.h - 10 - r * 16);
              return (
                <rect
                  key={`${r}-${cIdx}`}
                  className="svc-window"
                  x={wx - 1.6} y={wy - 3} width={3.2} height={5} fill={C.gold}
                  style={{ animationDelay: `${((i * 7 + r * 3 + cIdx) % 11) * 0.7}s` }}
                />
              );
            })
          )}
        </g>
      ))}
      {/* boulevard with traffic */}
      <polygon points={pts([iso(-46, 66), iso(112, 66), iso(112, 78), iso(-46, 78)])} fill={C.steelDim} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="svc-car" style={{ animationDelay: `${i * 2.6}s` }}>
          <circle r={2.4} fill={C.gold} />
        </g>
      ))}
    </g>
  );
}

/* ---------- zone 1: warehouse, roof lifts ---------- */
function Warehouse({ open }: { open: boolean }) {
  const W = 108, D = 76, H = 30;
  return (
    <g>
      <Tile x={-16} y={-14} w={140} d={110} fill={C.ground} />
      {/* floor + interior, revealed when the roof goes */}
      <g>
        <Tile x={0} y={0} w={W} d={D} fill="#181840" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => {
            const dx = 12 + col * 24, dy = 12 + row * 22;
            return (
              <g key={`${row}-${col}`}>
                <Box x={dx} y={dy} w={14} d={8} h={5} top={C.steel} left={C.steelDim} right={C.steelDim} />
                {/* monitor, lit */}
                <Box x={dx + 4} y={dy + 1} w={6} d={1} h={6} z={5} top={C.gold} left={C.goldDim} right={C.gold} />
                <Figure x={dx + 7} y={dy + 14} className="svc-bob" />
              </g>
            );
          })
        )}
        {/* server racks along the back wall */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} x={4 + i * 9} y={-8} w={6} d={6} h={22} top={C.steelLit} left={C.steelDim} right={C.steel} />
        ))}
      </g>
      {/* shell — walls stay, roof lifts away */}
      <g className="svc-roof" data-open={open ? "true" : undefined}>
        <polygon points={pts([iso(0, 0, H), iso(W, 0, H), iso(W, D, H), iso(0, D, H)])} fill={C.steelLit} />
        <polygon points={pts([iso(0, D, H), iso(W, D, H), iso(W, D, 0), iso(0, D, 0)])} fill={C.navyDim} />
        <polygon points={pts([iso(W, 0, H), iso(W, D, H), iso(W, D, 0), iso(W, 0, 0)])} fill={C.navy} />
        {[0, 1, 2, 3].map((i) => (
          <polygon
            key={i}
            points={pts([iso(10 + i * 24, D, H - 6), iso(26 + i * 24, D, H - 6), iso(26 + i * 24, D, H - 18), iso(10 + i * 24, D, H - 18)])}
            fill={C.gold}
            opacity={0.5}
          />
        ))}
      </g>
    </g>
  );
}

/* ---------- zone 2: construction ---------- */
function Construction() {
  return (
    <g>
      <Tile x={-20} y={-16} w={150} d={112} fill={C.soil} />
      {/* steel frame going up */}
      {[0, 1, 2].map((lvl) =>
        [0, 1, 2, 3].map((c) => (
          <Box key={`${lvl}-${c}`} x={10 + c * 20} y={10} w={3} d={3} h={26} z={lvl * 26} top={C.steelLit} left={C.steelDim} right={C.steel} opacity={lvl === 2 ? 0.55 : 1} />
        ))
      )}
      {[0, 1, 2].map((lvl) => (
        <polygon key={lvl} points={pts([iso(10, 10, lvl * 26), iso(93, 10, lvl * 26), iso(93, 40, lvl * 26), iso(10, 40, lvl * 26)])} fill={C.steelDim} opacity={0.85} />
      ))}
      {/* tower crane */}
      <g className="svc-crane">
        <Box x={112} y={14} w={5} d={5} h={130} top={C.gold} left={C.goldDim} right={C.goldDim} />
        <g className="svc-crane-jib">
          <polygon points={pts([iso(114.5, 16.5, 132), iso(46, 16.5, 128), iso(46, 18.5, 128), iso(114.5, 18.5, 132)])} fill={C.gold} />
          <line {...lineProps(iso(60, 17.5, 128), iso(60, 17.5, 96))} stroke={C.pale} strokeWidth={0.8} />
          <polygon points={pts([iso(57, 14, 96), iso(64, 14, 96), iso(64, 21, 96), iso(57, 21, 96)])} fill={C.rust} />
        </g>
      </g>
      {/* excavator */}
      <g>
        <Box x={22} y={62} w={18} d={11} h={7} top={C.gold} left={C.goldDim} right={C.goldDim} />
        <g className="svc-dig">
          <polygon points={pts([iso(38, 66, 12), iso(56, 66, 22), iso(56, 68, 22), iso(38, 68, 12)])} fill={C.goldDim} />
        </g>
      </g>
      {/* dump truck + spoil */}
      <Box x={66} y={70} w={22} d={12} h={9} top={C.steelLit} left={C.steelDim} right={C.steel} />
      <polygon points={pts([iso(96, 62), iso(118, 62), iso(112, 84), iso(100, 84)])} fill={C.soilLit} />
      {[[52, 82], [76, 56], [30, 84], [96, 44]].map(([x, y], i) => (
        <Figure key={i} x={x} y={y} c={C.gold} className="svc-bob" />
      ))}
    </g>
  );
}

/* ---------- zone 3: farm ---------- */
function Farm() {
  return (
    <g>
      <Tile x={-24} y={-18} w={168} d={122} fill={C.soil} />
      {/* plantation rows */}
      {Array.from({ length: 9 }).map((_, r) => (
        <polygon
          key={r}
          points={pts([iso(4, 6 + r * 10), iso(84, 6 + r * 10), iso(84, 12 + r * 10), iso(4, 12 + r * 10)])}
          fill={r % 2 ? C.crop : C.cropLit}
        />
      ))}
      {/* barn, with a pitched roof ridged along x */}
      <Box x={100} y={12} w={34} d={26} h={22} top={C.rust} left="#5e3a1c" right="#734725" />
      <polygon points={pts([iso(100, 12, 22), iso(134, 12, 22), iso(134, 25, 34), iso(100, 25, 34)])} fill="#8a5a2a" />
      <polygon points={pts([iso(100, 38, 22), iso(134, 38, 22), iso(134, 25, 34), iso(100, 25, 34)])} fill="#6b4420" />
      <polygon points={pts([iso(134, 12, 22), iso(134, 25, 34), iso(134, 38, 22)])} fill="#5e3a1c" />
      {/* livestock, ambling */}
      {[[96, 66], [110, 74], [122, 62], [104, 88], [126, 84]].map(([x, y], i) => {
        const [sx, sy] = iso(x, y);
        return (
          <g key={i} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`}>
            <g className="svc-graze" style={{ animationDelay: `${i * 1.3}s` }}>
              <ellipse cx={0} cy={-6} rx={6} ry={3.4} fill={C.pale} />
              <circle cx={5.5} cy={-8} r={2.4} fill={C.pale} />
              <rect x={-4} y={-3} width={1.4} height={3.4} fill={C.pale} />
              <rect x={3} y={-3} width={1.4} height={3.4} fill={C.pale} />
            </g>
          </g>
        );
      })}
      {/* tractor */}
      <g className="svc-tractor">
        <Box x={10} y={102} w={14} d={8} h={7} top={C.gold} left={C.goldDim} right={C.goldDim} />
      </g>
      <Figure x={92} y={100} c={C.gold} className="svc-bob" />
    </g>
  );
}

/* ---------- zone 4: oil, gas and green energy ---------- */
function Energy() {
  return (
    <g>
      <Tile x={-24} y={-18} w={172} d={126} fill={C.ground} />
      {/* storage tanks */}
      {[[6, 12], [46, 8], [26, 46]].map(([x, y], i) => {
        const [sx, sy] = iso(x, y);
        return (
          <g key={i} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)})`}>
            <ellipse cx={0} cy={-34} rx={20} ry={11} fill={C.steelLit} />
            <path d={`M -20 -34 L -20 -12 A 20 11 0 0 0 20 -12 L 20 -34 Z`} fill={C.steel} />
            <ellipse cx={0} cy={-34} rx={20} ry={11} fill="none" stroke={C.gold} strokeWidth={0.8} opacity={0.5} />
          </g>
        );
      })}
      {/* pump jack — the beam rocks */}
      <g>
        {(() => { const [px, py] = iso(96, 30); return (
          <g transform={`translate(${px.toFixed(1)},${py.toFixed(1)})`}>
            <polygon points="-14,0 -8,-30 8,-30 14,0" fill={C.steelDim} />
            <g className="svc-pump">
              <rect x={-30} y={-34} width={58} height={4.5} rx={2} fill={C.gold} />
              <rect x={-32} y={-34} width={9} height={13} rx={3} fill={C.goldDim} />
            </g>
            <rect x={22} y={-16} width={5} height={16} fill={C.steel} />
          </g>
        ); })()}
      </g>
      {/* wind turbines — blades turn */}
      {[[24, 96, 0.9], [66, 108, 1.05], [110, 88, 0.8]].map(([x, y, s], i) => {
        const [sx, sy] = iso(x as number, y as number);
        return (
          <g key={i} transform={`translate(${sx.toFixed(1)},${sy.toFixed(1)}) scale(${s})`}>
            <polygon points="-2.4,0 -1.4,-58 1.4,-58 2.4,0" fill={C.pale} />
            {/* the hub sits at the top of the tower, so the blades have to rotate there */}
            <g transform="translate(0,-58)">
              <g className="svc-blades" style={{ animationDuration: `${5 + i * 1.6}s` }}>
                {[0, 120, 240].map((a) => (
                  <polygon key={a} points="0,-3.4 9,-2.2 26,-0.7 26,0.7 9,2.2 0,3.4" fill={C.pale} transform={`rotate(${a})`} />
                ))}
                <circle r={3} fill={C.gold} />
              </g>
            </g>
          </g>
        );
      })}
      <Figure x={72} y={54} c={C.gold} className="svc-bob" />
    </g>
  );
}

function lineProps([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return { x1, y1, x2, y2 };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ServicesScene({ active }: { active: number }) {
  const svg = useRef<SVGSVGElement>(null);
  const target = useRef<[number, number, number, number]>(OVERVIEW);
  const current = useRef<[number, number, number, number]>(OVERVIEW);

  target.current = active < 0 ? OVERVIEW : ZONES[active].box;

  useEffect(() => {
    const el = svg.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const [x, y, w, h] = target.current;
      el.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
      return;
    }

    let raf = 0;
    const tick = () => {
      const c = current.current;
      const t = target.current;
      // easing the box rather than the element keeps the move resolution-independent
      for (let i = 0; i < 4; i++) c[i] = lerp(c[i], t[i], 0.055);
      el.setAttribute("viewBox", `${c[0].toFixed(1)} ${c[1].toFixed(1)} ${c[2].toFixed(1)} ${c[3].toFixed(1)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svg}
      className="svc-svg"
      viewBox={`${OVERVIEW[0]} ${OVERVIEW[1]} ${OVERVIEW[2]} ${OVERVIEW[3]}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="svcGlow" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#1a1a5e" />
          <stop offset="100%" stopColor="#05051a" />
        </radialGradient>
      </defs>
      <rect x={OVERVIEW[0]} y={OVERVIEW[1]} width={OVERVIEW[2]} height={OVERVIEW[3]} fill="url(#svcGlow)" />

      {ZONES.map((z, i) => (
        <g key={z.id} transform={`translate(${z.at[0]},${z.at[1]})`}>
          {i === 0 && <City />}
          {i === 1 && <Warehouse open={active === 1} />}
          {i === 2 && <Construction />}
          {i === 3 && <Farm />}
          {i === 4 && <Energy />}
        </g>
      ))}
    </svg>
  );
}

export function useZoneCount() {
  return ZONES.length;
}

/** Small helper the page uses to keep its scroll maths and the scene in step. */
export function useActiveZone(root: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = scrollable <= 0 ? 0 : Math.min(Math.max(-r.top / scrollable, 0), 1);
      // a short lead-in on the overview before the first zone takes hold
      const lead = 0.07;
      if (p < lead) return setActive(-1);
      const idx = Math.min(ZONES.length - 1, Math.floor(((p - lead) / (1 - lead)) * ZONES.length));
      setActive(idx);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [root]);
  return active;
}
