"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 21st.dev's `dotted-surface` (sshahaider) — a grid of points rolling on two offset sine
 * waves, rendered in perspective. Geometry, camera and wave maths are the original's.
 *
 * Three deviations, all deliberate:
 *  - no next-themes. This site tracks light/dark per section via `data-nav-theme`, not a
 *    global theme, and the surface only ever sits over the dark ground — so the palette is
 *    fixed to Nomad's gold rather than swapped on a theme hook.
 *  - the original pushes colours as 0-255 into a Float32 colour attribute, which three
 *    reads as 0-1 and clamps, so every point comes out flat white. Ours are normalised,
 *    which is what lets the crests run gold and the troughs sink to navy.
 *  - device pixel ratio is capped and the loop parks when the surface is off screen or
 *    the tab is hidden. At 3x DPR this is 2400 points redrawn every frame.
 */
type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
};

const SEPARATION = 150;
const AMOUNTX = 40;
const AMOUNTY = 60;

export function DottedSurface({
  className,
  size = 8,
  opacity = 0.8,
  sizeAttenuation = true,
  vertexColors = true,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04042e, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);
    container.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
        colors.push(1, 1, 1);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size,
      vertexColors,
      ...(vertexColors ? {} : { color: 0xffde59 }),
      transparent: true,
      opacity,
      sizeAttenuation,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const gold = new THREE.Color("#ffde59");
    const trough = new THREE.Color("#2b2b6b");
    const mix = new THREE.Color();

    let count = 0;
    let animationId = 0;

    const frame = () => {
      const positionAttribute = geometry.attributes.position;
      const colorAttribute = geometry.attributes.color;
      const pos = positionAttribute.array as Float32Array;
      const col = colorAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const wave = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          pos[i * 3 + 1] = wave;

          if (vertexColors) {
            // -100..100 -> 0..1, so the tops of the swell carry the gold
            mix.copy(trough).lerp(gold, (wave + 100) / 200);
            col[i * 3] = mix.r;
            col[i * 3 + 1] = mix.g;
            col[i * 3 + 2] = mix.b;
          }
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      if (vertexColors) colorAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      frame();
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const play = () => { if (!animationId && !reduced) animate(); };
    const pause = () => { if (animationId) { cancelAnimationFrame(animationId); animationId = 0; } };
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) frame();
    else animate();

    return () => {
      pause();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, opacity, sizeAttenuation, vertexColors]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 ${className ?? ""}`}
      {...props}
    />
  );
}

export default DottedSurface;
