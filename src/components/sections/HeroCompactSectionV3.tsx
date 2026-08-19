import type { CSSProperties } from "react";

import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service/RequestServiceModal";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type HeroCompactSectionV3Props = {
  align?: HeroCompactAlign;
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingSize?: HeroCompactHeadingSize;
  headingLevel?: 1 | 2;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  title: string;
};

export type HeroCompactAlign = "left" | "center" | "right";
export type HeroCompactHeadingSize =
  | "heading-lg"
  | "heading-xl"
  | "display-lg";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Keep the type-scaling frame sized by its grid column. The text styles give
 * the supporting paragraph its reading measure, while the largest centred
 * headline can extend beyond this frame without changing the cqw value that
 * determines its font size.
 */
const alignClassName: Record<
  HeroCompactAlign,
  {
    body: string;
    item: string;
    measure: string;
    text: string;
  }
> = {
  left: {
    body: "",
    item: "col-span-4 col-start-1",
    measure: "mr-auto",
    text: "text-left",
  },
  center: {
    body: "mx-auto",
    item: "col-span-5 col-start-2",
    measure: "mx-auto",
    text: "text-center",
  },
  right: {
    body: "ml-auto",
    item: "col-span-4 col-start-4",
    measure: "ml-auto",
    text: "text-right",
  },
};

const sideActionClassName: Record<Exclude<HeroCompactAlign, "center">, string> = {
  left: "col-span-3 col-start-5",
  right: "col-span-3 col-start-1 row-start-1",
};

const headingSizeClassName: Record<HeroCompactHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

/**
 * `style` exists for the reveal index and nothing else.
 *
 * The side-aligned arrangement renders this into a grid cell of its own, where
 * it has to carry its own marker - and a marker needs an index. Wrapping it in a
 * marked div instead would put a full-width block between the grid item and its
 * centred flex row, which is a layout change to buy a custom property.
 */
function HeroCompactActions({
  actionClassName,
  className,
  primaryAction,
  secondaryAction,
  secondaryActionClassName,
  secondaryActionHref,
  style,
}: {
  actionClassName?: string;
  className?: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionClassName?: string;
  secondaryActionHref: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-center inline-gap-med",
        className,
      )}
      style={style}
    >
      <RequestServiceButton className={actionClassName}>
        {primaryAction}
      </RequestServiceButton>
      <Button
        className={secondaryActionClassName}
        href={secondaryActionHref}
        variant="secondary"
      >
        {secondaryAction}
      </Button>
    </div>
  );
}

const colorRecipeClassName = {
  action: "",
  body: "text-service-muted",
  eyebrow: "text-service-accent",
  ink: "text-service-ink",
  secondaryAction: "",
  section: "bg-bg-page",
};

export function HeroCompactSectionV3({
  align = "center",
  body,
  eyebrow,
  headingSize = "display-lg",
  headingLevel = 1,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  title,
}: HeroCompactSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const alignment = alignClassName[align];
  const colors = colorRecipeClassName;
  const usesWideHeadline =
    align === "center" && headingSize === "display-lg";

  return (
    <section className={colors.section}>
      <SevenColumnGrid
        className="section-min-tiny content-center"
        padding="med"
      >
        <SevenColumnGridItem
          alignX={align}
          className={cx(
            alignment.item,
            "max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <div
            className={cx(
              "fluid-type-frame",
              alignment.measure,
              alignment.text,
            )}
          >
            {/* Eyebrow and headline are one heading unit; body and actions are
                one content unit. Two units rather than one pane around the
                column, because Wipe needs a heading to reveal behind its edge
                and a single unit would give it nothing but a fade - the same
                trade the split full-height hero records in full. */}
            <div
              className="reveal-on-scroll reveal-role-heading"
              style={{ "--reveal-index": 0 } as CSSProperties}
            >
              <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
              <Heading
                className={cx(
                  headingSizeClassName[headingSize],
                  "mt-eyebrow-display",
                  usesWideHeadline
                    ? "hero-compact-wide-headline"
                    : undefined,
                  colors.ink,
                )}
              >
                {title}
              </Heading>
            </div>
            <div
              className="reveal-on-scroll reveal-role-content"
              style={{ "--reveal-index": 1 } as CSSProperties}
            >
              <p
                className={cx(
                  headingSize === "display-lg"
                    ? "type-text-xl"
                    : "type-text-lg",
                  "wrap-pretty mt-heading-body-lg",
                  colors.body,
                  alignment.body,
                )}
              >
                {body}
              </p>
              {align === "center" ? (
                <HeroCompactActions
                  actionClassName={colors.action}
                  className="mt-body-actions-md"
                  primaryAction={primaryAction}
                  secondaryAction={secondaryAction}
                  secondaryActionClassName={colors.secondaryAction}
                  secondaryActionHref={secondaryActionHref}
                />
              ) : null}
            </div>
          </div>
        </SevenColumnGridItem>
        {align !== "center" ? (
          <SevenColumnGridItem
            alignX="center"
            alignY="middle"
            className={cx(
              sideActionClassName[align],
              "max-lg:col-span-5 max-lg:col-start-1 max-lg:row-auto max-lg:mt-body-actions-md max-md:col-span-3 max-sm:col-span-1",
            )}
          >
            {/* INDEX 1, THE SAME AS THE BODY IT BELONGS TO. Side-aligned, the
                actions move to a cell of their own; centred, they sit inside
                the content unit. Same index either way, so rearranging the
                section moves the buttons without changing when they arrive. */}
            <HeroCompactActions
              actionClassName={colors.action}
              className="reveal-on-scroll reveal-role-content"
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              secondaryActionClassName={colors.secondaryAction}
              secondaryActionHref={secondaryActionHref}
              style={{ "--reveal-index": 1 } as CSSProperties}
            />
          </SevenColumnGridItem>
        ) : null}
      </SevenColumnGrid>
    </section>
  );
}
