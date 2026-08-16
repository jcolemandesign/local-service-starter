import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type {
  HeroCompactAlign,
  HeroCompactHeadingSize,
} from "./HeroCompactSectionV3";

type SectionHeaderCompactSectionV3Props = {
  align?: HeroCompactAlign;
  body: string;
  eyebrow: string;
  headingSize?: HeroCompactHeadingSize;
  headingLevel?: 1 | 2;
  title: string;
};

const headingSizeClassName: Record<HeroCompactHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * `measure` caps the body copy, not the block.
 *
 * It used to sit on the wrapper, which capped the headline at the same 70ch a
 * paragraph wants. A headline is set at three times the body size, so that
 * ceiling landed a hundred pixels inside its own column and broke a short
 * headline over three lines with the room to spare sitting empty beside it.
 * Reading measure is a property of running text; a headline is sized by its
 * column.
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
    body: "mr-auto",
    item: "col-span-5 col-start-1",
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
    item: "col-span-5 col-start-3",
    measure: "ml-auto",
    text: "text-right",
  },
};

export function SectionHeaderCompactSectionV3({
  align = "center",
  body,
  eyebrow,
  headingSize = "heading-xl",
  headingLevel = 2,
  title,
}: SectionHeaderCompactSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const alignment = alignClassName[align];

  return (
    <section className="bg-bg-page">
      {/* Spacing through the shared scale rather than an inline
        * `--section-space-vsml`. The one-off value was both too tight to read as
        * a section in its own right and invisible to the builder, which tunes
        * density by the `section-space-*` classes - so the header stayed at its
        * hardcoded 2rem whatever the canvas was set to. */}
      <SevenColumnGrid minHeight="none" padding="sml">
        <SevenColumnGridItem
          alignX={align}
          className={cx(
            alignment.item,
            "max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          {/* One revealable unit, not three, and its role is `heading`. A
              header's eyebrow, headline and body are a single block of copy:
              staggering the three lines reads as fussy rather than as arrival,
              so no `--reveal-index` here, and the Wipe suite runs one edge
              across the block rather than three edges racing. Recorded in
              `singleUnitReveals`. */}
          <div
            className={cx(
              "reveal-on-scroll reveal-role-heading",
              "fluid-type-frame",
              alignment.measure,
              alignment.text,
            )}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <Heading
              className={cx(
                headingSizeClassName[headingSize],
                "mt-eyebrow-heading-lg text-service-ink",
              )}
            >
              {title}
            </Heading>
            <p
              className={cx(
                headingSize === "display-lg"
                  ? "type-text-xl"
                  : "type-text-lg",
                "wrap-pretty mt-heading-body-lg max-w-[var(--measure-copy-wide)] text-service-muted",
                alignment.body,
              )}
            >
              {body}
            </p>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
