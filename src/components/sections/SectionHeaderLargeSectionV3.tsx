import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionHeadlineWrap } from "@/content/section-style-options";
import type { HeroCompactAlign } from "./HeroCompactSectionV3";

export type LargeSectionHeaderSize =
  | "eyebrow"
  | "heading-sm"
  | "heading-md"
  | "heading-lg"
  | "heading-xl"
  | "display-lg"
  | "display-xl";

type SectionHeaderLargeSectionV3Props = {
  align?: HeroCompactAlign;
  headingLevel?: 1 | 2;
  /** This section's take on the shared headline wrap axis: the title is the
   *  whole composition here, so how it breaks is the layout. See
   *  `headlineWrapOptions` in `section-style-options`. */
  headlineWrap?: SectionHeadlineWrap;
  size?: LargeSectionHeaderSize;
  title: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const alignClassName: Record<
  HeroCompactAlign,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const sizeClassName: Record<LargeSectionHeaderSize, string> = {
  eyebrow: "type-eyebrow",
  "heading-sm": "type-heading-sm",
  "heading-md": "type-heading-md",
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
  "display-xl": "type-display-xl",
};

export function SectionHeaderLargeSectionV3({
  align = "center",
  headingLevel = 2,
  headlineWrap = "balance",
  size = "heading-xl",
  title,
}: SectionHeaderLargeSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const textAlignment = alignClassName[align];
  const usesCompactSectionSpacing =
    size === "heading-sm" || size === "eyebrow";

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        minHeight="none"
        padding="none"
        style={{
          paddingBlock: usesCompactSectionSpacing
            ? "var(--section-space-vsml)"
            : "var(--section-space-med)",
        }}
      >
        <SevenColumnGridItem
          alignX={align}
          className="col-span-7 col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
        >
          {/* A single revealable unit, and a `heading` one - this section is
              one headline. See `singleUnitReveals`.

              ALSO `lines`, which is what offers it Text wipe. The role says this
              block is worth splitting into its visual lines, and this section
              is the clearest case in the library: it is one sentence set large
              enough to wrap, with nothing else on screen to compete with an
              edge crossing it. The lines are found after layout - see
              `TextWipeLines` - so the headline stays ordinary flowing text and
              the `headlineWrap` control keeps deciding where it breaks. */}
          <div
            className={cx(
              "reveal-on-scroll reveal-role-heading reveal-role-lines",
              "fluid-type-frame",
              // Large fluid type can visually overshoot its line box at both
              // ends. Keep a small internal buffer so ascenders and descenders
              // are never clipped by a surrounding preview or band frame.
              "py-1",
              textAlignment,
            )}
          >
            {/* Set inline rather than with the `wrap-*` utility: every
                `type-*` utility declares `text-wrap` itself and is emitted
                after the wrap utilities in the same layer, so the class would
                lose the cascade and the control would read as dead. */}
            <Heading
              className={cx(sizeClassName[size], "text-service-ink")}
              style={{ textWrap: headlineWrap }}
            >
              {title}
            </Heading>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
