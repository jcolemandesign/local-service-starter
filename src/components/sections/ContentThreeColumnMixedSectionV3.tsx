import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ContentThreeColumnMixedAlign = "left" | "center" | "right";

export type ContentThreeColumnMixedImage = {
  imageAlt: string;
  imageSrc: string;
};

export type ContentThreeColumnMixedLink = {
  body: string;
  href: string;
  title: string;
};

export type ContentThreeColumnMixedSectionV3Props = {
  align?: ContentThreeColumnMixedAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  ctaBody: string;
  ctaEyebrow: string;
  ctaTitle: string;
  images: readonly ContentThreeColumnMixedImage[];
  linkLabel?: string;
  links: readonly ContentThreeColumnMixedLink[];
  longformBody: string;
  longformDetail: string;
  longformIntro: string;
  longformLead: string;
  longformPoints: readonly string[];
  longformTitle: string;
  primaryAction: string;
  primaryActionHref?: string;
  secondaryAction?: string;
  secondaryActionHref?: string;
};

// Three rails on the shared 14-column grid: a 5-column image rail, a 6-column
// rail holding the longform block with the primary CTA card under it, and a
// 3-column rail of small secondary CTA links. `align` only moves the start
// columns - every rail keeps its width in all three arrangements.
const alignColumnClassName: Record<
  ContentThreeColumnMixedAlign,
  { cta: string; images: string; links: string }
> = {
  left: {
    cta: "col-span-6 col-start-6",
    images: "col-span-5 col-start-1",
    links: "col-span-3 col-start-12",
  },
  center: {
    cta: "col-span-6 col-start-1",
    images: "col-span-5 col-start-7",
    links: "col-span-3 col-start-12",
  },
  right: {
    cta: "col-span-6 col-start-4",
    images: "col-span-5 col-start-10",
    links: "col-span-3 col-start-1",
  },
};

// The rails carry explicit column starts but auto rows, so without an explicit
// row the placement cursor would push a rail that starts left of the previous
// one onto a second row. `max-lg:row-auto` restores stacking once columns
// collapse.
const railClassName =
  "row-start-1 max-lg:row-auto max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentThreeColumnMixedSectionV3({
  align = "left",
  cardBorder = "on",
  cardFill = "solid",
  ctaBody,
  ctaEyebrow,
  ctaTitle,
  images,
  linkLabel = "Learn more",
  links,
  longformBody,
  longformDetail,
  longformIntro,
  longformLead,
  longformPoints,
  longformTitle,
  primaryAction,
  primaryActionHref = "/contact",
  secondaryAction,
  secondaryActionHref = "/services",
}: ContentThreeColumnMixedSectionV3Props) {
  const columns = alignColumnClassName[align];
  const surfaceClassName =
    cx(
      cardBorder === "off" ? "border-transparent" : "border-service-border",
      cardFill === "none"
        ? "bg-transparent shadow-none"
        : "bg-service-surface shadow-service",
    );

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem
          alignY="top"
          className={cx(columns.images, railClassName)}
        >
          {/* Top-aligned with auto rows so each frame keeps its 4:3 ratio
              instead of being stretched to the height of the middle rail. */}
          <div className="grid gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {images.map((image) => (
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-bg-muted"
                key={image.imageSrc + image.imageAlt}
              >
                <Image
                  alt={image.imageAlt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1023px) 50vw, 36vw"
                  src={image.imageSrc}
                />
              </div>
            ))}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.cta, railClassName)}
        >
          <div className="flex flex-col gap-6">
            {/* No border or fill - the shared card padding alone insets this
                block so it reads as an untinted companion to the CTA card. */}
            <div className="fluid-type-frame p-8 max-md:p-6">
              <h3 className="type-heading-xl text-service-ink">
                {longformTitle}
              </h3>
              <p className="type-text-lg mt-heading-body-sm text-service-ink">
                {longformIntro}
              </p>
              <p className="type-text-sm mt-body-actions-sm text-service-muted">
                {longformBody}
              </p>
              <p className="type-text-sm mt-body-actions-sm text-service-muted">
                {longformDetail}
              </p>
              {/* Ruled band and ink-weight type lift the list out of the
                  surrounding body copy so it reads as the scannable summary. */}
              <ul className="mt-body-actions-md grid grid-cols-2 gap-x-8 gap-y-4 border-y border-service-border py-6 max-sm:grid-cols-1">
                {longformPoints.map((point) => (
                  <li
                    className="type-text-md flex gap-3 font-medium text-service-ink"
                    key={point}
                  >
                    <span aria-hidden="true" className="text-service-accent">
                      &bull;
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="type-text-lg mt-body-actions-md text-service-ink">
                {longformLead}
              </p>
            </div>

            <article
              className={cx(
                "fluid-type-frame rounded-[var(--radius-surface-token)] border p-8 text-service-ink max-md:p-6",
                surfaceClassName,
              )}
            >
              <p className="type-label text-service-accent">{ctaEyebrow}</p>
              <h3 className="type-heading-md wrap-pretty mt-eyebrow-heading-md text-service-ink">
                {ctaTitle}
              </h3>
              <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
                {ctaBody}
              </p>
              <div className="mt-body-actions-md flex flex-wrap items-center inline-gap-med">
                <Button href={primaryActionHref}>{primaryAction}</Button>
                {secondaryAction ? (
                  <Button href={secondaryActionHref} variant="secondary">
                    {secondaryAction}
                  </Button>
                ) : null}
              </div>
            </article>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="top"
          className={cx(columns.links, railClassName)}
        >
          {/* Rows are auto-sized and the cards are not height-locked, so each
              one is only as tall as its own content. */}
          <ul className="grid gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {links.map((link) => (
              <li key={link.title}>
                <a
                  className={cx(
                    // fluid-type-frame gives these cards their own container
                    // context - without it the type-* clamps resolve cqw
                    // against the viewport and pin to their max sizes.
                    "group/card fluid-type-frame flex w-full min-w-0 flex-col rounded-[var(--radius-surface-token)] border p-5 text-service-ink transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                    surfaceClassName,
                  )}
                  href={link.href}
                >
                  <h3 className="type-heading-sm text-service-ink">
                    {link.title}
                  </h3>
                  <p className="type-text-xs wrap-pretty mt-heading-body-sm text-service-muted">
                    {link.body}
                  </p>
                  <span className="type-label mt-body-actions-sm inline-flex items-center gap-2 text-service-accent">
                    {linkLabel} <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
