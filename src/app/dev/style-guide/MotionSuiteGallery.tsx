"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * What each role specimen looks like.
 *
 * They are built to be WATCHED, which is a different job from being described.
 * The first pass was a caption over a small box, and small boxes are exactly
 * what a 28px rise and a left-to-right wipe are hardest to read on - the motion
 * finished before the eye found it. So each specimen is roughly the shape of
 * the thing it stands for: a heading is heading-sized, a card looks like a
 * card, media is a panel with a visible edge. The wipe in particular needs
 * width, because what you are judging is an edge crossing text.
 */
const roleSpecimens: Record<
  SectionAnimationRole,
  { label: string; render: () => React.ReactNode }
> = {
  heading: {
    label: "Heading",
    render: () => (
      <>
        <span className="type-eyebrow block text-service-muted">
          Service area
        </span>
        <span className="type-heading-md mt-2 block text-service-ink">
          Straight answers, fair prices
        </span>
      </>
    ),
  },
  content: {
    label: "Content",
    render: () => (
      <p className="type-text-md wrap-pretty text-service-muted">
        A paragraph of body copy. It arrives as one block rather than line by
        line, because a stagger across three lines of prose reads as fussy
        rather than as arrival.
      </p>
    ),
  },
  card: {
    label: "Card",
    render: () => (
      <span className="block rounded-[var(--radius-surface-token)] border border-service-border p-4">
        <span className="type-text-md block font-semibold text-service-ink">
          Drain clearing
        </span>
        <span className="type-text-sm mt-2 block text-service-muted">
          One of several. Cards stagger.
        </span>
      </span>
    ),
  },
  media: {
    label: "Media",
    render: () => (
      <span className="block h-32 rounded-[var(--radius-surface-token)] border border-service-border bg-gradient-to-br from-service-ink/15 to-service-ink/5" />
    ),
  },
  accent: {
    label: "Accent",
    render: () => (
      <>
        <span className="type-display-lg block leading-none text-service-ink">
          24
        </span>
        <span className="type-label mt-2 block text-service-muted">
          years in business
        </span>
      </>
    ),
  },
  action: {
    label: "Action",
    render: () => (
      <span className="block rounded-[var(--radius-surface-token)] border border-service-border p-4">
        <span className="type-text-md block font-semibold text-service-ink">
          Book the next visit
        </span>
        <span className="mt-3 inline-block rounded-[var(--radius-surface-token)] bg-service-ink px-4 py-2 type-text-sm font-semibold text-white">
          Request service
        </span>
      </span>
    ),
  },
  frame: {
    label: "Frame",
    render: () => (
      <span className="block rounded-[var(--radius-surface-token)] border border-service-border p-4">
        <span className="type-label block text-service-muted">Step 01</span>
        <span className="type-text-md mt-1 block font-semibold text-service-ink">
          A composite unit
        </span>
        <span className="type-text-sm mt-2 block text-service-muted">
          Reveals as one block, not as its parts.
        </span>
      </span>
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

  /**
   * CHANGING A VALUE REPLAYS, and without this the controls above read as dead.
   *
   * Every specimen is on screen when the gallery loads, so the observer settles
   * it immediately - there is no arrival left to play, and nothing on this
   * screen is moving. A new duration or easing only takes effect on the NEXT
   * run, and the only thing that started one was the Replay button. So the
   * honest description of the old behaviour is: drag a slider, watch nothing
   * happen, conclude the slider does nothing. That is the exact failure this
   * project names everywhere else, in the one screen built for judging motion.
   *
   * Debounced rather than immediate. A range input fires continuously while
   * dragging, and replaying on every frame restarts the animation faster than it
   * can play - the specimens would sit permanently at their first frame, which
   * looks even more broken than not replaying at all. The wait is for the hand
   * to stop, not for the value to change.
   *
   * It also fires once on mount, which is deliberate: the gallery is worth
   * looking at the moment it opens rather than after you find the button.
   */
  useEffect(() => {
    if (!rhythm) {
      return;
    }

    const timer = setTimeout(() => {
      for (const suite of sectionAnimationSuites) {
        replaySectionAnimation(frames.current.get(suite.id));
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [rhythm, easing]);

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
    <div className="grid gap-8" ref={readDefaultsOnMount} style={rhythmStyle}>
      <div className="style-guide-control-band grid gap-4 border-y px-[var(--site-grid-inset-inline)] py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1">
            <span className="type-caption font-semibold text-current">
              Rhythm
            </span>
            <span className="type-caption text-current/70">
              Scoped to this gallery. Nothing here is saved, and nothing here
              changes a page — promote a value into globals.css once the rhythm
              has been judged. Every change replays the specimens below.
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
                <span className="type-caption font-semibold text-current">
                  {control.label}
                </span>
                <span className="type-caption text-current/70">
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
            <span className="type-caption font-semibold text-current">
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
        <p className="type-caption text-current/70">
          Trigger inset{" "}
          <span className="font-semibold text-current">
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
          <div className="grid gap-4" key={suite.id}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="grid gap-1">
                <span className="type-heading-sm text-current">
                  {suite.label}
                  {(suite.status as string) !== "offered" ? (
                    <span className="type-caption ml-2 align-middle font-semibold text-current/70">
                      Prototype — not offered in the builder
                    </span>
                  ) : null}
                </span>
                <span className="type-text-sm text-current/70">
                  {suite.description}
                </span>
                <span className="type-caption text-current/70">
                  {suite.guidance}
                </span>
                {/* Where the suite is offered, because a gated one is otherwise
                    a mystery: an editor who cannot find "Wipe" on a section
                    should be able to read why here rather than assume it is
                    broken. */}
                <span className="type-caption text-current/70">
                  {suite.requiresRole
                    ? `Offered on sections that mark a "${suite.requiresRole}" unit.`
                    : "Offered wherever the entrance is offered."}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="type-caption text-current/70">
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
              THE SPECIMEN FRAME IS A STAND-IN FOR A SECTION, SO IT IS PAINTED
              LIKE ONE - page ground, section colour tokens, section type.

              It carries the suite attribute the same way a real frame does, so
              what plays here is the stylesheet's own rule rather than an
              imitation of it. That only reads correctly if the specimens sit on
              the ground they were designed against: on the chrome panel this
              first used, `text-service-ink` is a dark heading on a dark surface
              and the headline specimen was almost invisible. Section tokens
              need a section's ground.
            */}
            <div
              className="grid grid-cols-3 gap-x-6 gap-y-8 rounded-[var(--chrome-radius-panel)] border border-service-border bg-bg-page p-6 max-lg:grid-cols-2 max-sm:grid-cols-1"
              data-pagebuilder-animation={suite.id}
              ref={(node) => {
                frames.current.set(suite.id, node);
              }}
            >
              {sectionAnimationRoles.map((role, index) => (
                <div
                  className={`reveal-on-scroll reveal-role-${role} self-start`}
                  key={role}
                  style={{ "--reveal-index": index } as CSSProperties}
                >
                  {roleSpecimens[role].render()}
                </div>
              ))}
            </div>

            {/*
              The legend is OUTSIDE the frame, in the same columns.

              Inside it, every caption was one more thing that moved when you
              pressed Replay, and the panel read as content and commentary
              wearing the same clothes. Out here the annotation stays still
              while the specimens move, which is also the honest picture: what
              the registry SAYS is not part of what the section does.
            */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {sectionAnimationRoles.map((role) => (
                <div className="grid content-start gap-1" key={role}>
                  <span className="type-caption font-semibold text-current">
                    {roleSpecimens[role].label}
                    {differentiated.has(role) ? (
                      <span className="ml-1 font-normal text-current/60">
                        — differs from this suite&rsquo;s default
                      </span>
                    ) : null}
                  </span>
                  <span className="type-caption text-current/70">
                    {suite.roles[role]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
