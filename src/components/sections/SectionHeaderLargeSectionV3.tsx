import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionHeadlineWrap } from "@/content/section-style-options";
import type { HeroCompactAlign } from "./HeroCompactSectionV3";

export type LargeSectionHeaderSize =
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
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
  "display-xl": "type-display-xl",
};

export function SectionHeaderLargeSectionV3({
  align = "center",
  headingLevel = 2,
  headlineWrap = "balance",
  size = "display-xl",
  title,
}: SectionHeaderLargeSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const textAlignment = alignClassName[align];

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        minHeight="none"
        padding="none"
        style={{ paddingBlock: "var(--section-space-med)" }}
      >
        <SevenColumnGridItem
          alignX={align}
          className="col-span-7 col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
        >
          <div className={cx("fluid-type-frame", textAlignment)}>
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
