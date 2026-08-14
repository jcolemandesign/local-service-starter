import type { CSSProperties } from "react";

import {
  LayoutGrid,
  LayoutGridItem,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { MeasuredMarquee } from "@/components/sections/MeasuredMarquee";

/**
 * Five sections share this file, and only three of them may be marked.
 *
 * The two marquees are excluded from the entrance axis outright - their motion
 * is the section and it always runs - so the reveal marker deliberately does
 * NOT live in `LogoPlaceholder`, which the logo marquee's track renders too.
 * It sits on the list items of the sections that own it instead. See
 * `animationExcludedComponents`.
 */

type TrustItemsProps = {
  items: readonly string[];
  label: string;
};

type TrustBarSectionV3Props = TrustItemsProps & {
  className?: string;
};

/** The two card-surface toggles, shared by every section in this file that
 *  draws one. Same names and same defaults as everywhere else in the library -
 *  see `cardStyleComponents`. */
type CardStyleProps = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
};

type TrustLogosProps = CardStyleProps & {
  label: string;
  logos: readonly string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function LogoPlaceholder({
  cardBorder = "on",
  cardFill = "solid",
  compact = false,
  name,
}: CardStyleProps & {
  compact?: boolean;
  name: string;
}) {
  return (
    <div
      className={cx(
        "content-padding-x radius-medium flex items-center justify-center border border-service-border bg-surface-raised shadow-service",
        compact ? "h-18" : "h-24",
        cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
        cardBorder === "off" ? "!border-transparent" : undefined,
      )}
    >
      <div
        className={cx(
          "type-label radius-4 flex w-full items-center justify-center border border-service-border bg-service-surface text-service-muted",
          compact ? "h-10" : "h-12",
          cardFill === "none" ? "!bg-transparent" : undefined,
          cardBorder === "off" ? "!border-transparent" : undefined,
        )}
      >
        {name}
      </div>
    </div>
  );
}

function TextMarqueeItems({
  hidden = false,
  items,
}: {
  hidden?: boolean;
  items: readonly string[];
}) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center inline-gap-lrg px-3"
    >
      {items.map((item) => (
        <li
          className="type-label flex shrink-0 items-center inline-gap-lrg text-service-muted"
          key={item}
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-service-accent" />
        </li>
      ))}
    </ul>
  );
}

function LogoTrack({
  hidden = false,
  cardBorder,
  cardFill,
  logos,
}: CardStyleProps & {
  hidden?: boolean;
  logos: readonly string[];
}) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center inline-gap-med px-2"
    >
      {logos.map((logo) => (
        <li className="w-60 shrink-0 max-lg:w-52 max-md:w-44" key={logo}>
          <LogoPlaceholder cardBorder={cardBorder} cardFill={cardFill} name={logo} />
        </li>
      ))}
    </ul>
  );
}

export function TrustBarSectionV3({
  className,
  items,
  label,
}: TrustBarSectionV3Props) {
  return (
    <section className={cx(className ?? "bg-bg-page")}>
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          className="content-padding-y col-span-3 max-lg:col-span-7"
          measure="copy"
        >
          <p
            className="reveal-on-scroll type-text-md wrap-pretty font-semibold text-service-ink"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            {label}
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="content-padding-y col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1 max-lg:pt-0"
          alignY="middle"
        >
          <ul className="grid grid-cols-4 card-grid-gap-med max-md:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item, index) => (
              <li
                className={cx(
                  "reveal-on-scroll",
                  "type-text-sm wrap-pretty font-medium text-service-muted",
                  index > 0
                    ? "relative pl-4 before:absolute before:inset-y-0 before:left-0 before:border-l before:border-service-border before:[border-left-width:var(--border-surface-width-token)] max-sm:before:hidden max-sm:pl-0"
                    : undefined,
                  index > 0 && index % 2 === 0
                    ? "max-md:before:hidden max-md:pl-0"
                    : undefined,
                )}
                key={item}
                style={{ "--reveal-index": index + 1 } as CSSProperties}
              >
                {item}
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

type TrustBarFloatingBentoSectionV3Props = TrustItemsProps & {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
};

/** Column position for each of the three stat cards on a 14-column grid: the
 *  label card takes the first 5, leaving 9 for three 3-column cards. */
const trustBarStatPositions = [
  "col-span-3 col-start-6 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-2 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1",
  "col-span-3 col-start-9 max-lg:col-span-3 max-lg:col-start-4 max-md:col-span-2 max-md:col-start-3 max-sm:col-span-2 max-sm:col-start-1",
  "col-span-3 col-start-12 max-lg:col-span-3 max-lg:col-start-7 max-md:col-span-2 max-md:col-start-5 max-sm:col-span-2 max-sm:col-start-1",
];

export function TrustBarFloatingBentoSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  items,
  label,
}: TrustBarFloatingBentoSectionV3Props) {
  const statItems = items.slice(0, 3);

  return (
    <section className="bg-service-surface">
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        <LayoutGridItem
          alignY="stretch"
          className="col-span-5 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
        >
          <div
            className={cx(
              "reveal-on-scroll",
              "radius-medium flex min-h-44 items-end p-7 border border-service-border bg-service-surface text-service-ink max-md:min-h-0 max-md:p-6",
              cardFill === "none" ? "!bg-transparent" : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-text-lg">{label}</p>
          </div>
        </LayoutGridItem>

        {statItems.map((item, index) => (
          <LayoutGridItem
            alignY="stretch"
            className={trustBarStatPositions[index]}
            key={item}
          >
            <div
              className={cx(
                "reveal-on-scroll",
                "p-6 radius-medium flex h-full min-h-32 flex-col justify-between border border-service-border bg-service-surface shadow-service max-md:p-5 max-md:min-h-0",
                cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
                cardBorder === "off" ? "!border-transparent" : undefined,
              )}
              style={{ "--reveal-index": index + 1 } as CSSProperties}
            >
              <span className="type-caption text-service-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="type-text-sm wrap-pretty font-semibold text-service-ink">
                {item}
              </p>
            </div>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}

export function TrustMarqueeSectionV3({ items }: TrustItemsProps) {
  return (
    <section className="flex min-h-[var(--section-space-sml)] items-center overflow-hidden bg-bg-page">
      <MeasuredMarquee className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <TextMarqueeItems items={items} />
      </MeasuredMarquee>
    </section>
  );
}

export function TrustLogoMarqueeSectionV3({
  cardBorder,
  cardFill,
  logos,
}: TrustLogosProps) {
  /* Clipped on one axis only. The marquee needs the horizontal clip - the
   * track is wider than the screen by design - but `overflow-hidden` clips
   * both, and the logo tiles' `shadow-service` paints below the track, so the
   * bottom of every shadow was being cut off square. `overflow-x: clip` is the
   * pair that `hidden` cannot be: it does not force the other axis to `auto`,
   * so the vertical stays genuinely visible.
   *
   * Padded `sml` rather than `vsml` for the same reason from the other end:
   * the tiles' shadow reaches 32px below them, exactly the 2rem `vsml` was
   * padding, so its outer edge landed on the section's own boundary. Nothing
   * clipped it, but the surface below starts at that pixel, so the falloff
   * still read as a cut. `sml` leaves it 2rem of slack. */
  return (
    <section className="section-min-none section-space-sml overflow-x-clip bg-bg-page">
      <MeasuredMarquee className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip">
        <LogoTrack cardBorder={cardBorder} cardFill={cardFill} logos={logos} />
      </MeasuredMarquee>
    </section>
  );
}

export function TrustLogoGridSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  label,
  logos,
}: TrustLogosProps) {
  const visibleLogos = logos.slice(0, 5);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none py-6 max-md:py-5">
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-2 max-lg:col-span-7"
          measure="caption"
        >
          <div
            className={cx(
              "reveal-on-scroll",
              "radius-medium flex h-full items-center justify-center border border-service-border bg-service-surface px-5 py-4 text-center",
              cardFill === "none" ? "!bg-transparent" : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-text-xl wrap-balance font-semibold text-service-ink">
              {label}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="middle"
          className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <ul className="grid grid-cols-5 justify-items-center site-grid-gap max-lg:grid-cols-3 max-sm:grid-cols-2">
            {visibleLogos.map((logo, index) => (
              <li
                className="reveal-on-scroll w-full"
                key={logo}
                style={{ "--reveal-index": index + 1 } as CSSProperties}
              >
                <LogoPlaceholder
                  cardBorder={cardBorder}
                  cardFill={cardFill}
                  compact
                  name={logo}
                />
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
