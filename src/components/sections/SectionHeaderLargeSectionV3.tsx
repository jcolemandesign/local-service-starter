import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { HeroCompactAlign } from "./HeroCompactSectionV3";

export type LargeSectionHeaderSize =
  | "heading-xl"
  | "display-lg"
  | "display-xl";

type SectionHeaderLargeSectionV3Props = {
  align?: HeroCompactAlign;
  headingLevel?: 1 | 2;
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
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
  "display-xl": "type-display-xl",
};

export function SectionHeaderLargeSectionV3({
  align = "center",
  headingLevel = 2,
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
            <Heading
              className={cx(sizeClassName[size], "text-service-ink")}
            >
              {title}
            </Heading>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
