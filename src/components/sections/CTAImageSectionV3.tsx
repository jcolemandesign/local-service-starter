import Image from "next/image";
import type { CSSProperties } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type CTAImageAlign = "left" | "right";

export type CTAImageSectionV3Props = {
  action: string;
  /** Which side the copy sits on; the image always takes the opposite side. */
  align?: CTAImageAlign;
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  imageAlt?: string;
  imageSrc?: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  title: string;
};

const columnClasses: Record<
  CTAImageAlign,
  { content: string; image: string; media: string }
> = {
  left: {
    content: "col-span-6 col-start-1",
    image: "col-span-7 col-start-8",
    media: "left-1/2 right-0",
  },
  right: {
    content: "col-span-6 col-start-9",
    image: "col-span-7 col-start-1",
    media: "left-0 right-1/2",
  },
};

const stackedClasses =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CTAImageSectionV3({
  action,
  align = "left",
  body,
  eyebrow,
  imageAlt,
  imageSrc,
  secondaryAction,
  secondaryActionHref = "#services",
  title,
}: CTAImageSectionV3Props) {
  const columns = columnClasses[align];
  // `align` names the side the COPY sits on, so the image leads the reading
  // order whenever the copy is on the right.
  const imageLeadsReadingOrder = align === "right";

  return (
    <section className="relative overflow-hidden bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="med"
      >
        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.content, stackedClasses)}
        >
          <div
            className="reveal-on-scroll flex h-full flex-col"
            style={
              {
                "--reveal-index": imageLeadsReadingOrder ? 1 : 0,
              } as CSSProperties
            }
          >
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
                {title}
              </h2>
              <p className="type-text-lg measure-copy-wide wrap-pretty mt-heading-body-lg text-service-muted">
                {body}
              </p>
            </div>

            <div className="mt-body-actions-md flex flex-wrap items-center gap-4 max-md:items-stretch">
              <RequestServiceButton className="w-auto shrink-0 max-md:w-full">
                {action}
              </RequestServiceButton>
              <Button
                className="w-auto shrink-0 max-md:w-full"
                href={secondaryActionHref}
                variant="secondary"
              >
                {secondaryAction}
              </Button>
            </div>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.image, stackedClasses)}
        >
          <div
            className={cx(
              // Fades without moving. The panel is absolutely positioned to
              // the section's own edges, so the library's 18px rise would open
              // a band of bare ground along the top of the bleed - the same
              // reason the full-image narrative split re-points this token.
              "reveal-on-scroll",
              "media-min-medium absolute inset-y-0 !w-auto overflow-hidden bg-bg-muted max-lg:relative max-lg:inset-auto max-lg:-mx-[var(--site-grid-inset-inline)] max-lg:!w-[calc(100%+var(--site-grid-inset-inline)+var(--site-grid-inset-inline))]",
              columns.media,
            )}
            style={
              {
                "--anim-reveal-distance": "0px",
                "--reveal-index": imageLeadsReadingOrder ? 0 : 1,
              } as CSSProperties
            }
          >
            {imageSrc ? (
              <Image
                alt={imageAlt ?? ""}
                className="object-cover object-center"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                src={imageSrc}
              />
            ) : null}
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
