import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import type {
  SectionIcons,
  TableCompareAlign,
} from "@/content/section-style-options";
import {
  HorizontalCardLink,
  type HorizontalCardLinkGridItem,
} from "./HorizontalCardLinkGridSectionV3";

export type HorizontalCardLinkGridTwoUpSectionV3Props = {
  align?: TableCompareAlign;
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  cardLinks?: "on" | "off";
  heading: string;
  icons?: SectionIcons;
  items: readonly HorizontalCardLinkGridItem[];
  linkLabel?: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const alignColumnStarts: Record<
  TableCompareAlign,
  readonly [string, string]
> = {
  left: ["col-start-1", "col-start-7"],
  center: ["col-start-2", "col-start-8"],
  right: ["col-start-3", "col-start-9"],
};

const responsiveColumns =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

export function HorizontalCardLinkGridTwoUpSectionV3({
  align = "center",
  cardBorder = "on",
  cardFill = "solid",
  cardLinks = "on",
  heading,
  icons = "on",
  items,
  linkLabel = "View service",
}: HorizontalCardLinkGridTwoUpSectionV3Props) {
  const columnStarts = alignColumnStarts[align] ?? alignColumnStarts.center;

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-stretch" columns={14} padding="med">
        <LayoutGridItem className="col-span-12 col-start-2 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          <h2 className="type-eyebrow text-service-accent">{heading}</h2>
        </LayoutGridItem>

        {items.slice(0, 2).map((item, index) => (
          <LayoutGridItem
            alignY="stretch"
            className={cx("col-span-6", columnStarts[index], responsiveColumns)}
            key={item.title}
          >
            <HorizontalCardLink
              cardBorder={cardBorder}
              cardFill={cardFill}
              cardLinks={cardLinks}
              icons={icons}
              imageSizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 26vw"
              index={index}
              item={item}
              linkLabel={linkLabel}
            />
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
