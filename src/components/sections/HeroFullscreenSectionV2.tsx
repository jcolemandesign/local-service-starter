import type { CSSProperties } from "react";

import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import type {
  SectionHeadingSize,
  SectionMirrorAlign,
} from "@/content/section-style-options";

type ReviewSnippet = {
  rating: string;
  label: string;
  detail: string;
};

type TrustSignal = {
  value: string;
  label: string;
};

type HeroFullscreenSectionV2Props = {
  /** Which side the copy sits on; the proof tray takes the other. */
  align?: SectionMirrorAlign;
  body: string;
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  eyebrow: string;
  headingLevel?: 1 | 2;
  headingSize?: SectionHeadingSize;
  primaryAction: string;
  review: ReviewSnippet;
  secondaryAction: string;
  secondaryActionHref?: string;
  title: string;
  trustSignals: TrustSignal[];
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The two mirrored arrangements.
 *
 * Copy takes four of the seven columns and the proof tray two, so one column is
 * always spare between them whichever side the copy is on.
 *
 * BOTH SLOTS PIN ROW 1, AND THE MIRROR DOES NOT WORK WITHOUT IT. The copy comes
 * first in the DOM, so on `right` it is placed at columns 4-7 and the proof tray
 * then asks for columns 1-2 - behind the placement cursor. Grid's sparse
 * auto-placement never moves the cursor backwards, so the tray drops to a second
 * row and the two stack instead of sitting side by side. `left` hides the
 * problem completely, because there the columns only ever run forwards.
 */
const alignClassName: Record<
  SectionMirrorAlign,
  { copy: string; proof: string }
> = {
  left: {
    copy: "col-span-4 col-start-1 row-start-1",
    proof: "col-span-2 col-start-6 row-start-1",
  },
  right: {
    copy: "col-span-4 col-start-4 row-start-1",
    proof: "col-span-2 col-start-1 row-start-1",
  },
};

/**
 * REVEAL ORDER, COMPUTED FROM `align` RATHER THAN FROM JSX ORDER.
 *
 * The proof tray takes the leading columns under `right` while staying second in
 * the DOM - the placement quirk the note above already documents. Staggering by
 * source order would sweep right-to-left on that arrangement.
 *
 * `proof` is the index the FIRST card takes; the three of them run from there.
 * They are independent cards in a grid, so they stagger - the convention the
 * Decision family settled, where joined panels reveal as one block and separate
 * cards do not.
 *
 * NO MEDIA UNIT, AND NOTHING TO FIX. This hero's picture belongs to the
 * ground-image axis rather than to an element of its own, so there is no
 * `<img>` for `settle-load` to scale and the role gate simply does not offer it.
 * Rise, Fade and Wipe are the three it gets, which is the gate working rather
 * than an omission.
 */
const revealIndex: Record<
  SectionMirrorAlign,
  { content: number; heading: number; proof: number }
> = {
  left: { heading: 0, content: 1, proof: 2 },
  right: { proof: 0, heading: 3, content: 4 },
};

const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

export function HeroFullscreenSectionV2({
  align = "left",
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  headingLevel = 1,
  headingSize = "heading-lg",
  primaryAction,
  review,
  secondaryAction,
  secondaryActionHref = "#services",
  title,
  trustSignals,
}: HeroFullscreenSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;
  const alignment = alignClassName[align] ?? alignClassName.left;
  const order = revealIndex[align] ?? revealIndex.left;
  const cardClassName = cx(
    "radius-medium recipe-card-context border border-service-border bg-service-surface text-service-ink shadow-service",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  return (
    /*
     * No ground of its own.
     *
     * This section used to paint an opaque stand-in photograph plus two dark
     * scrims across its whole box, which sat on top of everything the frame
     * paints - so the colour recipe, a background band and a real ground image
     * were all invisible behind it, and the copy had to be hardcoded white to
     * clear a scrim nobody could change. The image belongs to the ground-image
     * axis (`backgroundTreatment` + the `backgroundImage` asset), which already
     * spans a band and already composes with the recipe.
     */
    <section className="text-service-ink">
      <SevenColumnGrid className="section-min-sliver content-end">
        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className={cx(
            alignment.copy,
            // Stacked below lg, copy first in both alignments. Spelled as an
            // explicit row rather than `row-auto`, which is the `grid-row`
            // shorthand and would be fighting the `grid-row-start` longhand
            // above it for who wins in the cascade.
            "max-lg:col-span-7 max-lg:col-start-1 max-lg:row-start-1",
          )}
        >
          <div className="fluid-type-frame min-w-0">
            <div
              className="reveal-on-scroll reveal-role-heading"
              style={{ "--reveal-index": order.heading } as CSSProperties}
            >
              <p className="type-label text-service-accent">{eyebrow}</p>
              <HeadingTag
                className={cx(
                  headingSizeClassName[headingSize] ??
                    headingSizeClassName["heading-lg"],
                  "measure-copy-wide mt-eyebrow-display text-service-ink",
                )}
              >
                {title}
              </HeadingTag>
            </div>
            <div
              className="reveal-on-scroll reveal-role-content"
              style={{ "--reveal-index": order.content } as CSSProperties}
            >
            <p className="type-text-lg measure-copy wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap inline-gap-med">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href={secondaryActionHref} variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="bottom"
          className={cx(
            alignment.proof,
            "max-lg:col-span-7 max-lg:col-start-1 max-lg:row-start-2",
          )}
        >
          <aside className="grid w-full shrink-0 grid-cols-2 gap-4 max-lg:max-w-md max-md:gap-3">
            {trustSignals.map((signal, index) => (
              <div
                className={cx(
                  "reveal-on-scroll reveal-role-card",
                  cardClassName,
                  "p-5 max-md:p-4",
                )}
                key={signal.label}
                style={{ "--reveal-index": order.proof + index } as CSSProperties}
              >
                <p className="type-heading-sm leading-none">{signal.value}</p>
                <p className="type-caption mt-3 font-semibold text-service-muted max-md:mt-2">
                  {signal.label}
                </p>
              </div>
            ))}
            <div
              className={cx(
                "reveal-on-scroll reveal-role-card",
                cardClassName,
                "col-span-2 p-6 max-md:p-4",
              )}
              style={
                {
                  "--reveal-index": order.proof + trustSignals.length,
                } as CSSProperties
              }
            >
              <p className="type-heading-md leading-none">{review.rating}</p>
              <p className="type-text-sm mt-4 font-semibold max-md:mt-2">
                {review.label}
              </p>
              <p className="type-caption mt-2 text-service-muted max-lg:hidden">
                {review.detail}
              </p>
            </div>
          </aside>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
