import type { CSSProperties } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionHeadingSize } from "@/content/section-style-options";

type SectionHeaderSplitLinkSectionV3Props = {
  actionHref?: string;
  actionLabel: string;
  body: string;
  cardLinks?: "on" | "off";
  headingLevel?: 1 | 2;
  headingSize?: SectionHeadingSize;
  title: string;
};

/** Purely visual, so it rides its own field rather than `variant` - the copy
 *  this section asks for is the same at every step. */
const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

// Heading left, description and link right. Deliberately fixed: the mirrored
// arrangement put the heading's ragged edge against the description's and read
// as a misalignment rather than a choice, so the axis was dropped instead of
// shipped broken.
const headingClassName =
  "col-span-4 col-start-1 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1";
const asideClassName =
  "col-span-3 col-start-5 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1";

/**
 * Heading on one side, with a short description and optional text link on the
 * other. Lifted out of the split-large-cards section, which used to carry this
 * header inline - as its own section it can introduce any block, and the cards
 * section is free to be only cards.
 */
export function SectionHeaderSplitLinkSectionV3({
  actionHref = "#contact",
  actionLabel,
  body,
  cardLinks = "on",
  headingLevel = 2,
  headingSize = "heading-xl",
  title,
}: SectionHeaderSplitLinkSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const hasLink = cardLinks !== "off";

  return (
    /**
     * The block padding here is a floor, not the section's spacing.
     *
     * Section spacing set to Reduced zeroes the grid's padding with
     * `!important` (see the `data-pagebuilder-padding-*` rules in
     * `globals.css`), which left this header sitting flush against whatever it
     * introduces. This sits on the section element instead, where neither the
     * `.site-grid-frame` nor the `> [class*="py-"]` rule reaches it, so a
     * little breathing room survives with spacing off - and adds to the grid's
     * padding rather than replacing it when spacing is on.
     *
     * Half the smallest section step rather than a new value, so it tracks the
     * scale if that step is ever retuned.
     */
    <section
      className="bg-bg-page"
      style={{ paddingBlock: "calc(var(--section-space-vsml) / 2)" }}
    >
      <SevenColumnGrid
        className="items-end"
        minHeight="none"
        padding="none"
        style={{ paddingBlock: "var(--section-space-vsml)" }}
      >
        <SevenColumnGridItem
          className={headingClassName}
          measure="none"
        >
          {/* Two units here, unlike the other two headers: the headline and the
              aside sit side by side, so they earn a real two-step stagger
              rather than one block fade. The headline is the `heading` unit and
              the aside is `content` - which is what lets the Wipe suite wipe
              the title while the aside beside it simply rises. */}
          <Heading
            className={`reveal-on-scroll reveal-role-heading ${
              headingSizeClassName[headingSize] ??
              headingSizeClassName["heading-xl"]
            } max-w-3xl text-service-ink`}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            {title}
          </Heading>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="bottom"
          className={asideClassName}
          measure="none"
        >
          <div
            className="reveal-on-scroll reveal-role-content fluid-type-frame"
            style={{ "--reveal-index": 1 } as CSSProperties}
          >
            <p
              className={
                hasLink
                  ? "type-text-md wrap-pretty text-service-muted"
                  : "type-text-xl wrap-pretty text-service-muted"
              }
            >
              {body}
            </p>
            {hasLink ? (
              <a
                className="type-label mt-body-actions-md inline-flex w-fit items-center border-b border-service-ink pb-1 text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href={actionHref}
              >
                {actionLabel}
              </a>
            ) : null}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
