import Image from "next/image";
import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

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
  icons?: SectionIcons;
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

function SeasonIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M19.5 4.5C12.2 4.8 7.4 8 6.2 13.4c-.7 3.2 1 5.6 3.9 5.6 5.5 0 8.7-6.8 9.4-14.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M5 20c1.6-4.4 4.7-7.6 9.3-9.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M3.8 11.2 11.2 3.8h6.3l2.7 2.7v6.3l-7.4 7.4a2 2 0 0 1-2.8 0L3.8 14a2 2 0 0 1 0-2.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="15.8" cy="8.2" r="1.25" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v4M16 3.5v4M3.5 10h17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
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
  icons = "on",
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
              // One unit: a single bordered card with the photo cropped flush
              // to its own edge. Moving the copy panel independently would
              // slide it out from under the frame it sits in.
              "reveal-on-scroll",
              "grid grid-cols-14 overflow-hidden rounded-[var(--radius-surface-token)] border max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2",
              fillClassName,
              borderClassName,
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div
              className={cx(
                "relative min-h-[var(--media-min-tall)] overflow-hidden bg-bg-muted max-md:min-h-[var(--media-min-medium)]",
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
                <p className="type-label flex items-center gap-2 text-service-accent">
                  {icons === "on" ? <SeasonIcon /> : null}
                  <span>{eyebrow}</span>
                </p>
                <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
                  {heading}
                </h2>
              </header>

              <dl className="mt-heading-body-lg grid grid-cols-2 gap-6 border-b border-service-border pb-8 max-sm:grid-cols-1">
                <div className="flex items-start gap-4">
                  {icons === "on" ? (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-service-border text-service-accent">
                      <PriceIcon />
                    </span>
                  ) : null}
                  <div>
                    <dt className="type-caption text-service-muted">{priceLabel}</dt>
                    <dd className="type-heading-sm mt-1 text-service-ink">{priceValue}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  {icons === "on" ? (
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-service-border text-service-accent">
                      <CalendarIcon />
                    </span>
                  ) : null}
                  <div>
                    <dt className="type-caption text-service-muted">{dateLabel}</dt>
                    {/* A date is a detail, not a headline. At `type-text-xl` it
                      * set larger than the price beside it - the one number the
                      * offer turns on - and any value longer than a word broke
                      * over three lines and pushed the divider below it down
                      * with it. */}
                    <dd className="type-text-md mt-1 font-semibold text-service-ink">{dateValue}</dd>
                  </div>
                </div>
              </dl>

              {/* Not an even split. The bullet list is a column of short
                * fragments and never fills half the panel, while the closing
                * pitch beside it carries a headline, a paragraph and a
                * full-width button - so an even split left a lake of air
                * against the divider on one side and cramped copy on the
                * other, and read as a rule sitting off-centre. */}
              <div className="mt-8 grid flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 max-lg:grid-cols-1">
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
                  {/* Below `type-heading-sm`, which at this column width set as
                    * large as the section's own price figure. Note the scale is
                    * not ordered the way the names suggest here - `type-text-lg`
                    * resolves *larger* than `type-heading-sm`, so the step down
                    * is to `type-text-md`, carried by weight rather than size. */}
                  {/* Weight comes from the type token, because nothing else
                    * reaches it: `.type-text-md` declares `font-weight` with
                    * `!important`, which beats a plain class, an inline style,
                    * and even `!font-semibold` (equal specificity, and the type
                    * utility is emitted last). Setting the variable the utility
                    * itself reads is the way in. */}
                  <h3
                    className="type-text-md wrap-pretty text-service-ink"
                    style={{ "--type-text-md-weight": 600 } as CSSProperties}
                  >
                    {benefitTitle}
                  </h3>
                  <p className="type-text-md wrap-pretty mt-3 text-service-muted">
                    {benefitBody}
                  </p>
                  <div className="mt-auto pt-8">
                    <RequestServiceButton className="w-full">{action}</RequestServiceButton>
                    {/* Centred on the full-width button it belongs to, rather
                      * than ranged left away from it. */}
                    <p className="type-caption mt-3 text-center text-service-muted">
                      {terms}
                    </p>
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
