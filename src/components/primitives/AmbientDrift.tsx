/**
 * AmbientDrift - drawn linework that drifts across a section or a whole band.
 *
 * This is the first background treatment that renders markup instead of a
 * stylesheet rule. Every other treatment is one `::before` on the frame, which
 * is why they cost nothing across the builder, the preview, staged pages and
 * the exporter alike - the data attribute travels and CSS does the rest. Twelve
 * sprites moving on independent cycles is not expressible as one pseudo-element,
 * so this one needs a DOM child, and `BackgroundTreatmentOverlay` below is the
 * seam every render path drops in.
 *
 * Each wisp is its own absolutely-positioned sprite rather than a group inside
 * one big SVG. That decouples the animation from viewBox scaling: lanes are
 * percentages, sprite widths are CSS lengths, and stroke weight is held constant
 * with `vector-effect`. A 400px hero and a 4000px band render identically.
 *
 * No `"use client"`, deliberately. The reference version reached for `useId` to
 * keep two instances' gradient `<defs>` from colliding; the along-path fade is a
 * CSS mask here instead, so there are no ids, no hooks, and no hydration - it
 * renders on the server and survives the exporter without a client boundary.
 *
 * Colour is not set here. The stroke inherits `--ambient-drift-color` from
 * `globals.css`, which resolves against the recipe already painting the ground,
 * so one treatment reads correctly on all five recipes.
 */

import type { CSSProperties } from "react";

export type DriftShape = {
  id: string;
  d: string;
  /** viewBox for this shape's own sprite - pad ~4 units beyond the path bbox. */
  vb: string;
};

export type DriftInstance = {
  shape: string;
  /** Vertical lane as a percentage of the overlay height. */
  lane: number;
  /** Sprite width. Any CSS length - clamp() is recommended for mobile. */
  w: string;
  dur: number;
  delay: number;
  bob: number;
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

/**
 * Each path alternates direction 3-4 times. The first cubic carries a full S on
 * its own; every following S command reflects into the opposite hump.
 *
 * Layers are broad and dim, and opacity comes down as weight goes up - a 15px
 * band at 0.4 would read as a painted stripe rather than as weather.
 */
export const BREEZE: DriftPreset = {
  shapes: [
    { id: "w1", d: "M0 0 C 100 -78 200 78 300 0 S 500 -78 600 0 S 800 78 900 0", vb: "-6 -90 912 180" },
    { id: "w2", d: "M0 0 C 73 -60 147 60 220 0 S 367 -60 440 0 S 587 60 660 0", vb: "-6 -70 672 140" },
    { id: "w3", d: "M0 0 C 51 -44 102 44 153 0 S 256 -44 307 0 S 409 44 460 0", vb: "-6 -52 472 104" },
    { id: "w4", d: "M0 0 C 50 -26 100 26 150 0 S 250 -26 300 0", vb: "-6 -38 312 76" },
  ],
  layers: [
    { strokeWidth: 6, opacity: 0.1 },
    { strokeWidth: 10, opacity: 0.15 },
    { strokeWidth: 15, opacity: 0.22 },
  ],
  instances: [
    { shape: "w1", lane: 16, w: "clamp(340px, 58vw, 820px)", dur: 92, delay: -28, bob: 13, layer: 0 },
    { shape: "w2", lane: 48, w: "clamp(260px, 44vw, 620px)", dur: 84, delay: -61, bob: 11, layer: 0 },
    { shape: "w3", lane: 82, w: "clamp(200px, 34vw, 470px)", dur: 76, delay: -14, bob: 15, layer: 0 },
    { shape: "w1", lane: 30, w: "clamp(360px, 60vw, 860px)", dur: 66, delay: -41, bob: 9, layer: 1 },
    { shape: "w3", lane: 60, w: "clamp(220px, 36vw, 500px)", dur: 58, delay: -12, bob: 12, layer: 1 },
    { shape: "w2", lane: 90, w: "clamp(280px, 46vw, 660px)", dur: 62, delay: -35, bob: 10, layer: 1 },
    { shape: "w4", lane: 8, w: "clamp(150px, 24vw, 340px)", dur: 54, delay: -20, bob: 8, layer: 1 },
    { shape: "w1", lane: 42, w: "clamp(400px, 64vw, 900px)", dur: 44, delay: -9, bob: 7.5, layer: 2 },
    { shape: "w2", lane: 70, w: "clamp(300px, 50vw, 700px)", dur: 48, delay: -30, bob: 9.5, layer: 2 },
    { shape: "w4", lane: 22, w: "clamp(170px, 28vw, 380px)", dur: 40, delay: -17, bob: 6.5, layer: 2 },
  ],
};

type Props = {
  preset?: DriftPreset;
  /** Multiplier on every cycle. Above 1 is faster. */
  speed?: number;
  /** Multiplier on every layer's opacity. */
  intensity?: number;
  /** Percentage of width faded at each edge. */
  edgeFade?: number;
  /**
   * Percentage of height faded top and bottom. Use where a band meets a
   * differently-coloured section; 0 when the run is self-contained.
   */
  vFade?: number;
};

export default function AmbientDrift({
  preset = BREEZE,
  speed = 1,
  intensity = 1,
  edgeFade = 8,
  vFade = 0,
}: Props) {
  const masks: string[] = [];

  if (edgeFade > 0) {
    masks.push(
      `linear-gradient(90deg, transparent, #000 ${edgeFade}%, #000 ${100 - edgeFade}%, transparent)`,
    );
  }

  if (vFade > 0) {
    masks.push(
      `linear-gradient(180deg, transparent, #000 ${vFade}%, #000 ${100 - vFade}%, transparent)`,
    );
  }

  const mask = masks.length ? masks.join(", ") : undefined;

  return (
    <div
      aria-hidden="true"
      className="ambient-drift"
      style={
        {
          WebkitMaskImage: mask,
          maskImage: mask,
          // Two masks have to intersect, not stack - stacked, the vertical fade
          // would re-reveal what the horizontal one took away.
          WebkitMaskComposite: masks.length > 1 ? "source-in" : undefined,
          maskComposite: masks.length > 1 ? "intersect" : undefined,
          "--ambient-drift-speed": 1 / speed,
        } as CSSProperties
      }
    >
      {preset.instances.map((wisp, index) => {
        const shape = preset.shapes.find((entry) => entry.id === wisp.shape);

        if (!shape) {
          return null;
        }

        const layer = preset.layers[wisp.layer] ?? preset.layers[0];
        // Under reduced motion each sprite freezes where its negative delay
        // would have carried it, rather than all twelve stacking on the start
        // line - a still frame of the composition instead of a pile.
        const rest = -100 + ((Math.abs(wisp.delay) % wisp.dur) / wisp.dur) * 200;

        return (
          <div
            className="ambient-drift-wisp"
            key={`${wisp.shape}-${wisp.layer}-${index}`}
            style={
              {
                top: `${wisp.lane}%`,
                "--ambient-drift-duration": `${wisp.dur}s`,
                "--ambient-drift-delay": `${wisp.delay}s`,
                "--ambient-drift-rest": `${rest.toFixed(1)}%`,
              } as CSSProperties
            }
          >
            <svg
              className="ambient-drift-sprite"
              viewBox={shape.vb}
              style={
                {
                  "--ambient-drift-width": wisp.w,
                  opacity: layer.opacity * intensity,
                } as CSSProperties
              }
            >
              <g
                className="ambient-drift-bob"
                style={{ "--ambient-drift-bob": `${wisp.bob}s` } as CSSProperties}
              >
                <path
                  d={shape.d}
                  fill="none"
                  strokeLinecap="round"
                  strokeWidth={layer.strokeWidth}
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

/**
 * The one seam every render path drops in beside the treatment attribute.
 *
 * Returns `null` for all but `ambient`, so a call site is one unconditional
 * line rather than a condition repeated five times - and the next treatment
 * that needs markup is added here instead of at each frame and band in turn.
 *
 * Band members pass `none`, exactly as they do for the attribute: the band owns
 * the texture for its run, and a member drawing its own would stack a second
 * set of sprites on top of the first.
 */
export function BackgroundTreatmentOverlay({
  treatment,
}: {
  /** An already-resolved treatment - see `resolveBackgroundTreatment`. */
  treatment: string;
}) {
  return treatment === "ambient" ? <AmbientDrift /> : null;
}
