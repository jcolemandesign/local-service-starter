"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

import { triggerInset } from "@/components/primitives/SectionEntrance";
import {
  type SectionAnimationRole,
  sectionAnimationRoles,
  sectionAnimationSuites,
} from "@/content/section-animations";
import { replaySectionAnimation } from "@/utils/replay-section-animation";

/**
 * The browsable half of the animation library.
 *
 * DERIVED FROM THE REGISTRY, never hand-listed. A suite added to
 * `sectionAnimationSuites` appears here with no edit to this file and no edit to
 * the style-guide page - which is the whole point of the groundwork, and is
 * pinned by `animation-css-agreement.test.ts`.
 *
 * It lives in the style-guide route rather than in `components/sections/`
 * because the specimen frames set `data-pagebuilder-animation` themselves. In
 * the sections folder that would be a section switching its own animation on,
 * and `animation-marker-ownership.test.ts` fails any section that does. Here it
 * is correct: these frames are standing in for the section frame, which is
 * exactly what the two frame owners do.
 */

/** What a role specimen looks like, so the caption is not the only clue. */
const roleSpecimens: Record<
  SectionAnimationRole,
  { label: string; render: () => React.ReactNode }
> = {
  heading: {
    label: "Heading",
    render: () => (
      <>
        <span className="type-eyebrow block text-service-accent">Eyebrow</span>
        <span className="type-heading-sm mt-2 block text-service-ink">
          A section heading
        </span>
      </>
    ),
  },
  content: {
    label: "Content",
    render: () => (
      <span className="type-text-sm block text-service-muted">
        A paragraph of body copy, which arrives as one block rather than line by
        line.
      </span>
    ),
  },
  card: {
    label: "Card",
    render: () => (
      <span className="type-text-sm block font-semibold text-service-ink">
        An independent card
      </span>
    ),
  },
  media: {
    label: "Media",
    render: () => (
      <span className="block h-16 rounded-[var(--radius-surface-token)] bg-service-ink/10" />
    ),
  },
  accent: {
    label: "Accent",
    render: () => (
      <>
        <span className="type-heading-md block text-service-accent">24</span>
        <span className="type-caption block text-service-muted">years</span>
      </>
    ),
  },
  frame: {
    label: "Frame",
    render: () => (
      <>
        <span className="type-text-sm block font-semibold text-service-ink">
          A composite unit
        </span>
        <span className="type-caption mt-1 block text-service-muted">
          reveals as one block, not as its parts
        </span>
      </>
    ),
  },
};

/**
 * The rhythm controls, and the tokens they drive.
 *
 * LOCAL AND RESETTABLE ON PURPOSE. These are scoped to the gallery's own
 * element, so nothing here touches production state or any saved page - you are
 * judging a rhythm, not authoring one. Promoting a value into the shared tokens
 * in `globals.css` is a separate, deliberate edit, and should happen only once
 * the rhythm has actually been judged.
 */
const rhythmControls = [
  {
    token: "--anim-reveal-duration",
    label: "Duration",
    min: 120,
    max: 1600,
    step: 20,
    unit: "ms",
  },
  {
    token: "--anim-reveal-delay-step",
    label: "Stagger",
    min: 0,
    max: 400,
    step: 10,
    unit: "ms",
  },
  {
    token: "--anim-reveal-distance",
    label: "Distance",
    min: 0,
    max: 120,
    step: 2,
    unit: "px",
  },
] as const;

/**
 * Easing presets, named for what they do to the arrival.
 *
 * Deliberately not tokens. They exist to answer "is the default the right
 * curve?" and a preset that earned its place would be promoted into
 * `--anim-reveal-easing` rather than kept here.
 */
const easingPresets = [
  { label: "Default", value: "" },
  { label: "Linear", value: "linear" },
  { label: "Soft", value: "cubic-bezier(0.33, 1, 0.68, 1)" },
  { label: "Sharp", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
] as const;

type RhythmToken = (typeof rhythmControls)[number]["token"];

/** The stylesheet's own values, read once rather than restated here.
 *  Restating them is how a "reset" quietly stops matching the default. */
function readTokenDefaults() {
  const computed = getComputedStyle(document.documentElement);
  const defaults = {} as Record<RhythmToken, number>;

  for (const control of rhythmControls) {
    defaults[control.token] =
      Number.parseFloat(computed.getPropertyValue(control.token)) || 0;
  }

  return defaults;
}

export function MotionSuiteGallery() {
  const frames = useRef(new Map<string, HTMLDivElement | null>());
  const [rhythm, setRhythm] = useState<Record<RhythmToken, number> | null>(null);
  const [easing, setEasing] = useState<string>("");

  /**
   * Read the stylesheet's values once the DOM exists.
   *
   * A ref callback rather than an effect, and not to dodge the lint rule: the
   * thing being waited for is a mounted document to measure, which is precisely
   * what a ref callback signals. There is no stylesheet on the server, so a
   * lazy `useState` initialiser would render numbers on the client and dashes
   * on the server - a hydration mismatch. Guarded, so it runs once.
   */
  function readDefaultsOnMount(node: HTMLDivElement | null) {
    if (node && !rhythm) {
      setRhythm(readTokenDefaults());
    }
  }

  function replay(id: string) {
    replaySectionAnimation(frames.current.get(id));
  }

  function replayAll() {
    for (const suite of sectionAnimationSuites) {
      replay(suite.id);
    }
  }

  const rhythmStyle = {
    ...(rhythm
      ? Object.fromEntries(
          rhythmControls.map((control) => [
            control.token,
            `${rhythm[control.token]}${control.unit}`,
          ]),
        )
      : {}),
    ...(easing ? { "--anim-reveal-easing": easing } : {}),
  } as CSSProperties;

  return (
    <div className="grid gap-5" ref={readDefaultsOnMount} style={rhythmStyle}>
      <div className="style-guide-control-band grid gap-4 border-y px-[var(--site-grid-inset-inline)] py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1">
            <span className="type-caption font-semibold text-service-ink">
              Rhythm
            </span>
            <span className="type-caption text-service-muted">
              Scoped to this gallery. Nothing here is saved, and nothing here
              changes a page — promote a value into globals.css once the rhythm
              has been judged.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="token-chrome-card min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors"
              onClick={replayAll}
              type="button"
            >
              Replay all
            </button>
            <button
              className="token-chrome-card min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors"
              onClick={() => {
                setRhythm(readTokenDefaults());
                setEasing("");
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {rhythmControls.map((control) => (
            <label className="grid gap-2" key={control.token}>
              <span className="flex items-center justify-between gap-2">
                <span className="type-caption font-semibold text-service-ink">
                  {control.label}
                </span>
                <span className="type-caption text-service-muted">
                  {rhythm ? `${rhythm[control.token]}${control.unit}` : "—"}
                </span>
              </span>
              <input
                className="style-guide-control-slider w-full"
                disabled={!rhythm}
                max={control.max}
                min={control.min}
                onChange={(event) =>
                  setRhythm((current) =>
                    current
                      ? {
                          ...current,
                          [control.token]: Number(event.target.value),
                        }
                      : current,
                  )
                }
                step={control.step}
                type="range"
                value={rhythm?.[control.token] ?? control.min}
              />
            </label>
          ))}

          <label className="grid gap-2">
            <span className="type-caption font-semibold text-service-ink">
              Easing
            </span>
            <select
              className="token-chrome-card min-h-10 rounded-[var(--chrome-radius-control)] border px-2 text-xs"
              onChange={(event) => setEasing(event.target.value)}
              value={easing}
            >
              {easingPresets.map((preset) => (
                <option key={preset.label} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/*
          Read-only, and that is the honest presentation rather than a missing
          feature. The trigger inset is a TypeScript constant in
          `SectionEntrance`, not a custom property - and more to the point,
          replaying a specimen that is already on screen never exercises the
          intersection trigger at all, so a slider here would change nothing you
          could see. Judging it needs a scroll-trigger lab with its own
          constrained scroller, which is a separate build.
        */}
        <p className="type-caption text-service-muted">
          Trigger inset{" "}
          <span className="font-semibold text-service-ink">
            {Math.round(triggerInset * 100)}%
          </span>{" "}
          of viewport height — read-only. It decides <em>when</em> an entrance
          starts, which a replay in place cannot show. Entrances are also
          suppressed entirely under <code>prefers-reduced-motion</code>.
        </p>
      </div>

      {sectionAnimationSuites.map((suite) => {
        const differentiated = new Set<string>(suite.differentiatedRoles);

        return (
          <div className="grid gap-3" key={suite.id}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="grid gap-1">
                <span className="type-heading-sm text-service-ink">
                  {suite.label}
                  {suite.status === "prototype" ? (
                    <span className="type-caption ml-2 align-middle font-semibold text-service-accent">
                      Prototype — not offered in the builder
                    </span>
                  ) : null}
                </span>
                <span className="type-text-sm text-service-muted">
                  {suite.description}
                </span>
                <span className="type-caption text-service-muted">
                  {suite.guidance}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="type-caption text-service-muted">
                  stored id <code>{suite.id}</code>
                </span>
                <button
                  className="token-chrome-card min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors"
                  onClick={() => replay(suite.id)}
                  type="button"
                >
                  Replay
                </button>
              </div>
            </div>

            {/*
              The specimen frame stands in for the section frame. It carries the
              suite the same way a real frame does, so what plays here is the
              stylesheet's own rule rather than an imitation of it - there is
              nothing to keep in sync.
            */}
            <div
              className="token-chrome-card grid grid-cols-6 gap-4 rounded-[var(--chrome-radius-panel)] border p-5 max-lg:grid-cols-3 max-sm:grid-cols-2"
              data-pagebuilder-animation={suite.id}
              ref={(node) => {
                frames.current.set(suite.id, node);
              }}
            >
              {sectionAnimationRoles.map((role, index) => (
                <div className="grid gap-2" key={role}>
                  <div
                    className={`reveal-on-scroll reveal-role-${role} min-h-20 rounded-[var(--radius-surface-token)] bg-bg-surface p-3`}
                    style={{ "--reveal-index": index } as CSSProperties}
                  >
                    {roleSpecimens[role].render()}
                  </div>
                  <div className="grid gap-1">
                    <span className="type-caption font-semibold text-service-ink">
                      {roleSpecimens[role].label}
                      {differentiated.has(role) ? (
                        <span className="ml-1 font-normal text-service-accent">
                          • differs
                        </span>
                      ) : null}
                    </span>
                    <span className="type-caption text-service-muted">
                      {suite.roles[role]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
