import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { HeroCompactAlign } from "./HeroCompactSectionV3";

export type HeroCompactServiceSectionV3Props = {
  align?: HeroCompactAlign;
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  ctaBody: string;
  ctaTitle: string;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  title: string;
};

// `align` positions the CTA panel across the 14-column grid. The text block and
// image keep their widths in every alignment - only their start columns move, so
// the CTA lands first (left), between text and image (center), or last (right).
const alignColumnClassName: Record<
  HeroCompactAlign,
  { cta: string; image: string; text: string }
> = {
  left: {
    cta: "col-span-4 col-start-1",
    image: "col-span-6 col-start-9",
    text: "col-span-4 col-start-5",
  },
  center: {
    cta: "col-span-4 col-start-5",
    image: "col-span-6 col-start-9",
    text: "col-span-4 col-start-1",
  },
  right: {
    cta: "col-span-4 col-start-11",
    image: "col-span-6 col-start-5",
    text: "col-span-4 col-start-1",
  },
};

// `row-start-1` keeps all three items on one row: they carry explicit column
// starts but auto rows, so once the placement cursor passes a start column the
// item would otherwise wrap to a new row. `max-lg:row-auto` restores normal
// stacking once the columns collapse.
const gridItemClassName =
  "row-start-1 max-lg:row-auto max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroCompactServiceSectionV3({
  align = "right",
  body,
  cardBorder = "on",
  cardFill = "solid",
  ctaBody,
  ctaTitle,
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  title,
}: HeroCompactServiceSectionV3Props) {
  const HeadingTag = `h${headingLevel}` as const;
  const columns = alignColumnClassName[align];

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-center" columns={14} padding="med">
        <LayoutGridItem
          alignY="middle"
          className={cx(columns.text, gridItemClassName)}
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-heading-xl wrap-pretty mt-eyebrow-heading-md text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="middle"
          className={cx(columns.image, gridItemClassName)}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface shadow-service">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 43vw"
              src={imageSrc}
            />
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.cta, gridItemClassName)}
        >
          <article
            className={cx(
              "flex h-full flex-col rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-service-ink shadow-service max-md:p-6",
              cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
          >
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="type-heading-sm text-service-accent">{ctaTitle}</h3>
              <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                {ctaBody}
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 pt-8">
              <RequestServiceButton className="!text-sm !font-semibold">
                {primaryAction}
              </RequestServiceButton>
              <Button href={secondaryActionHref} variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
