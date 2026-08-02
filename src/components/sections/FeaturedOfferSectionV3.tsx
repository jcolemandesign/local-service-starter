import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";

export type FeaturedOfferAlign = "left" | "right";

export type FeaturedOfferSectionV3Props = {
  action: string;
  align?: FeaturedOfferAlign;
  bannerLabel: string;
  benefitBody: string;
  benefitTitle: string;
  bullets: readonly string[];
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  dateLabel: string;
  dateValue: string;
  eyebrow: string;
  heading: string;
  imageAlt?: string;
  imageSrc?: string;
  includesLabel: string;
  priceLabel: string;
  priceValue: string;
  terms: string;
};

const placementClasses: Record<
  FeaturedOfferAlign,
  { content: string; image: string }
> = {
  left: {
    content:
      "col-span-8 col-start-7 row-start-1 max-lg:col-span-7 max-lg:col-start-4",
    image:
      "col-span-6 col-start-1 row-start-1 max-lg:col-span-3 max-lg:col-start-1",
  },
  right: {
    content:
      "col-span-8 col-start-1 row-start-1 max-lg:col-span-7 max-lg:col-start-1",
    image:
      "col-span-6 col-start-9 row-start-1 max-lg:col-span-3 max-lg:col-start-8",
  },
};

const stackedClasses =
  "max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FeaturedOfferSectionV3({
  action,
  align = "left",
  bannerLabel,
  benefitBody,
  benefitTitle,
  bullets,
  cardBorder = "on",
  cardFill = "solid",
  dateLabel,
  dateValue,
  eyebrow,
  heading,
  imageAlt,
  imageSrc,
  includesLabel,
  priceLabel,
  priceValue,
  terms,
}: FeaturedOfferSectionV3Props) {
  const placement = placementClasses[align];
  const fillClassName =
    cardFill === "none"
      ? "bg-transparent shadow-none"
      : "bg-service-surface shadow-service";
  const borderClassName =
    cardBorder === "off" ? "border-transparent" : "border-service-border";

  return (
    <section className="bg-bg-page">
      <LayoutGrid columns={14} minHeight="none" padding="med">
        <LayoutGridItem className="col-span-14 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <article
            className={cx(
              "grid grid-cols-14 overflow-hidden rounded-[var(--radius-surface-token)] border max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2",
              fillClassName,
              borderClassName,
            )}
          >
            <div
              className={cx(
                "media-min-tall relative overflow-hidden bg-bg-muted max-md:media-min-medium",
                placement.image,
                stackedClasses,
              )}
            >
              {imageSrc ? (
                <Image
                  alt={imageAlt ?? ""}
                  className="object-cover object-center"
                  fill
                  sizes="(max-width: 767px) 100vw, 43vw"
                  src={imageSrc}
                />
              ) : null}
              <p className="absolute left-0 top-0 z-10 rounded-br-[var(--radius-surface-token)] bg-bg-dark px-6 py-4 type-label text-white">
                {bannerLabel}
              </p>
            </div>

            <div
              className={cx(
                "content-padding flex flex-col",
                placement.content,
                stackedClasses,
              )}
            >
              <header className="fluid-type-frame">
                <p className="type-label text-service-accent">{eyebrow}</p>
                <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
                  {heading}
                </h2>
              </header>

              <dl className="mt-heading-body-lg grid grid-cols-2 gap-6 border-b border-service-border pb-8 max-sm:grid-cols-1">
                <div>
                  <dt className="type-caption text-service-muted">{priceLabel}</dt>
                  <dd className="type-heading-sm mt-1 text-service-ink">{priceValue}</dd>
                </div>
                <div>
                  <dt className="type-caption text-service-muted">{dateLabel}</dt>
                  <dd className="type-heading-sm mt-1 text-service-ink">{dateValue}</dd>
                </div>
              </dl>

              <div className="mt-8 grid flex-1 grid-cols-2 gap-8 max-lg:grid-cols-1">
                <div>
                  <h3 className="type-label text-service-accent">{includesLabel}</h3>
                  <ul className="mt-5 grid gap-4">
                    {bullets.map((bullet) => (
                      <li className="type-text-md flex gap-3 text-service-ink" key={bullet}>
                        <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="flex flex-col border-l border-service-border pl-8 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-8">
                  <h3 className="type-heading-sm text-service-ink">{benefitTitle}</h3>
                  <p className="type-text-md wrap-pretty mt-3 text-service-muted">
                    {benefitBody}
                  </p>
                  <div className="mt-auto pt-8">
                    <RequestServiceButton className="w-full">{action}</RequestServiceButton>
                    <p className="type-caption mt-3 text-service-muted">{terms}</p>
                  </div>
                </aside>
              </div>
            </div>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
