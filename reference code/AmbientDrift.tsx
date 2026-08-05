"use client";

/**
 * AmbientDrift — a reusable ambient overlay that spans one or many sections.
 *
 * Each wisp is its own absolutely-positioned sprite rather than a group inside
 * one big SVG. That decouples the animation from viewBox scaling: lanes are
 * percentages, sprite widths are CSS lengths, and stroke weight is held constant
 * with vector-effect. A 400px hero and a 4000px band render identically.
 *
 * Drop it into a wrapper that has `position: relative`. The wrapper's section
 * content needs `position: relative` so it sits above the overlay — but the
 * sections themselves must stay unpositioned, or their backgrounds cover it.
 */

import * as React from "react";

export type DriftShape = {
  id: string;
  d: string;
  /** viewBox for this shape's own sprite — pad ~4 units beyond the path bbox. */
  vb: string;
};

export type DriftInstance = {
  shape: string;
  /** Vertical lane as a percentage of the overlay height. */
  lane: number;
  /** Sprite width. Any CSS length — clamp() is recommended for mobile. */
  w: string;
  dur: number;   // seconds for one full pass (container width × 2)
  delay: number; // negative — pre-distributes sprites mid-flight
  bob: number;   // vertical drift period; keep non-harmonic with dur
  layer: number;
};

export type DriftLayer = {
  /** Real CSS pixels, held constant at any sprite size. */
  strokeWidth: number;
  opacity: number;
};

export type DriftPreset = {
  shapes: DriftShape[];
  layers: DriftLayer[];
  instances: DriftInstance[];
};

/* ------------------------------------------------------------------ */
/* Preset: cool breeze                                                 */
/* ------------------------------------------------------------------ */

export const BREEZE: DriftPreset = {
  // Each path alternates direction 3–4 times. The first cubic carries a full S on
  // its own; every following S command reflects into the opposite hump.
  shapes: [
    { id: "w1", d: "M0 0 C 100 -78 200 78 300 0 S 500 -78 600 0 S 800 78 900 0", vb: "-6 -90 912 180" },
    { id: "w2", d: "M0 0 C 73 -60 147 60 220 0 S 367 -60 440 0 S 587 60 660 0", vb: "-6 -70 672 140" },
    { id: "w3", d: "M0 0 C 51 -44 102 44 153 0 S 256 -44 307 0 S 409 44 460 0", vb: "-6 -52 472 104" },
    { id: "w4", d: "M0 0 C 50 -26 100 26 150 0 S 250 -26 300 0", vb: "-6 -38 312 76" },
  ],
  // Broad and dim. Opacity comes down as weight goes up — a 15px band at 0.4
  // would read as a painted stripe, not weather.
  layers: [
    { strokeWidth: 6, opacity: 0.1 },   // back
    { strokeWidth: 10, opacity: 0.15 }, // mid
    { strokeWidth: 15, opacity: 0.22 }, // front
  ],
  instances: [
    { shape: "w1", lane: 16, w: "clamp(340px, 58vw, 820px)", dur: 92, delay: -28, bob: 13,  layer: 0 },
    { shape: "w2", lane: 48, w: "clamp(260px, 44vw, 620px)", dur: 84, delay: -61, bob: 11,  layer: 0 },
    { shape: "w3", lane: 82, w: "clamp(200px, 34vw, 470px)", dur: 76, delay: -14, bob: 15,  layer: 0 },
    { shape: "w1", lane: 30, w: "clamp(360px, 60vw, 860px)", dur: 66, delay: -41, bob: 9,   layer: 1 },
    { shape: "w3", lane: 60, w: "clamp(220px, 36vw, 500px)", dur: 58, delay: -12, bob: 12,  layer: 1 },
    { shape: "w2", lane: 90, w: "clamp(280px, 46vw, 660px)", dur: 62, delay: -35, bob: 10,  layer: 1 },
    { shape: "w4", lane: 8,  w: "clamp(150px, 24vw, 340px)", dur: 54, delay: -20, bob: 8,   layer: 1 },
    { shape: "w1", lane: 42, w: "clamp(400px, 64vw, 900px)", dur: 44, delay: -9,  bob: 7.5, layer: 2 },
    { shape: "w2", lane: 70, w: "clamp(300px, 50vw, 700px)", dur: 48, delay: -30, bob: 9.5, layer: 2 },
    { shape: "w4", lane: 22, w: "clamp(170px, 28vw, 380px)", dur: 40, delay: -17, bob: 6.5, layer: 2 },
  ],
};

/* ------------------------------------------------------------------ */

type Props = {
  preset?: DriftPreset;
  speed?: number;
  intensity?: number;
  blend?: "normal" | "plus-lighter";
  /** Percentage of width faded at each edge. */
  edgeFade?: number;
  /** Percentage of height faded top and bottom. Use where the band meets a
   *  differently-coloured section; 0 when the band is self-contained. */
  vFade?: number;
  /** Sits below content (z-index: 1) and nav. Raise only if you know why. */
  zIndex?: number;
  className?: string;
};

export default function AmbientDrift({
  preset = BREEZE,
  speed = 1,
  intensity = 1,
  blend = "normal",
  edgeFade = 8,
  vFade = 0,
  zIndex = 0,
  className = "",
}: Props) {
  // Unique defs id so two instances on one page don't collide.
  const uid = React.useId().replace(/:/g, "");
  const fadeId = `${uid}-fade`;

  const masks: string[] = [];
  if (edgeFade > 0)
    masks.push(
      `linear-gradient(90deg, transparent, #000 ${edgeFade}%, #000 ${100 - edgeFade}%, transparent)`
    );
  if (vFade > 0)
    masks.push(
      `linear-gradient(180deg, transparent, #000 ${vFade}%, #000 ${100 - vFade}%, transparent)`
    );
  const mask = masks.length ? masks.join(", ") : undefined;

  return (
    <div
      aria-hidden="true"
      className={`ad-root pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={
        {
          zIndex,
          mixBlendMode: blend,
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskComposite: masks.length > 1 ? "source-in" : undefined,
          maskComposite: masks.length > 1 ? "intersect" : undefined,
          "--ad-spd": 1 / speed,
        } as React.CSSProperties
      }
    >
      <style>{`
        .ad-wisp { position:absolute; left:0; width:100%; height:0;
                   animation: ad-x calc(var(--d) * var(--ad-spd)) linear infinite;
                   animation-delay: calc(var(--dl) * var(--ad-spd)); will-change: transform; }
        .ad-sprite { position:absolute; left:0; top:0; width:var(--w); height:auto;
                     transform: translateY(-50%); overflow:visible; }
        .ad-y { animation: ad-y calc(var(--b) * var(--ad-spd)) ease-in-out infinite alternate; }
        @keyframes ad-x { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes ad-y { from { transform: translateY(-7px); } to { transform: translateY(9px); } }
        @media (prefers-reduced-motion: reduce) {
          .ad-wisp, .ad-y { animation: none; }
          .ad-wisp { transform: translateX(var(--rest)); }
        }
      `}</style>

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".18" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".44" stopColor="#fff" stopOpacity="1" />
            <stop offset=".74" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {preset.instances.map((w, i) => {
        const shape = preset.shapes.find((s) => s.id === w.shape);
        if (!shape) return null;
        const layer = preset.layers[w.layer] ?? preset.layers[0];
        // Freeze each sprite where it would have been, not at the start line.
        const rest = -100 + ((Math.abs(w.delay) % w.dur) / w.dur) * 200;

        return (
          <div
            key={i}
            className="ad-wisp"
            style={
              {
                top: `${w.lane}%`,
                "--d": `${w.dur}s`,
                "--dl": `${w.delay}s`,
                "--rest": `${rest.toFixed(1)}%`,
              } as React.CSSProperties
            }
          >
            <svg
              className="ad-sprite"
              viewBox={shape.vb}
              style={{ "--w": w.w, opacity: layer.opacity * intensity } as React.CSSProperties}
            >
              <g className="ad-y" style={{ "--b": `${w.bob}s` } as React.CSSProperties}>
                <path
                  d={shape.d}
                  fill="none"
                  stroke={`url(#${fadeId})`}
                  strokeWidth={layer.strokeWidth}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* Usage — wrap the contiguous band, not the whole page:

<div className="relative isolate bg-[--live-surface-cool]">
  <AmbientDrift speed={1} intensity={0.9} vFade={4} />
  <Hero />
  <Intro />
  <Services />
</div>

…where Hero / Intro / Services each render:

<section className="…">             // stays unpositioned — background paints below
  <div className="relative z-[1]">  // content wrapper — sits above the overlay
    …
  </div>
</section>

Gotchas:
 - Any section with a transform, filter, opacity < 1, or will-change becomes its
   own stacking context and covers the overlay entirely. If you animate sections
   on scroll, animate the inner wrapper instead.
 - `isolate` on the band wrapper is only needed for plus-lighter. It scopes the
   blend to the band's own background instead of the page.
 - Sprite widths use vw, so they grow with the viewport rather than the container.
   Swap to cqw with `container-type: inline-size` on the wrapper if the band is
   ever narrower than the page.
 - Twelve sprites is the budget. If a tall band looks sparse, add lanes — but
   check frame time on a mid-range Android before shipping.
*/
