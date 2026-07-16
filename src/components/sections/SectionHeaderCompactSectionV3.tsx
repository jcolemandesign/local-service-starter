import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { HeroCompactAlign } from "./HeroCompactSectionV3";

type SectionHeaderCompactSectionV3Props = {
  align?: HeroCompactAlign;
  body: string;
  eyebrow: string;
  headingLevel?: 1 | 2;
  title: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
    item: "col-span-5 col-start-1",
    measure: "mr-auto max-w-[var(--measure-copy-wide)]",
    text: "text-left",
  },
  center: {
    body: "mx-auto",
    item: "col-span-5 col-start-2",
    measure: "mx-auto max-w-[var(--measure-copy-wide)]",
    text: "text-center",
  },
  right: {
    body: "ml-auto",
    item: "col-span-5 col-start-3",
    measure: "ml-auto max-w-[var(--measure-copy-wide)]",
    text: "text-right",
  },
};

export function SectionHeaderCompactSectionV3({
  align = "center",
  body,
  eyebrow,
  headingLevel = 2,
  title,
}: SectionHeaderCompactSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const alignment = alignClassName[align];

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        minHeight="none"
        padding="none"
        style={{ paddingBlock: "var(--section-space-vsml)" }}
      >
        <SevenColumnGridItem
          alignX={align}
          className={cx(
            alignment.item,
            "max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3",
          )}
        >
          <div
            className={cx(
              "fluid-type-frame",
              alignment.measure,
              alignment.text,
            )}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <Heading
              className={cx(
                "type-heading-xl",
                "mt-eyebrow-heading-lg text-service-ink",
              )}
            >
              {title}
            </Heading>
            <p
              className={cx(
                "type-text-lg wrap-pretty mt-heading-body-lg text-service-muted",
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
