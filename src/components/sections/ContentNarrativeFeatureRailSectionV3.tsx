import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type NarrativeFeatureRailCard = {
  actionHref?: string;
  actionLabel?: string;
  body: string;
  eyebrow: string;
  title: string;
};

export type ContentNarrativeFeatureRailAlign = "left" | "right";

export type ContentNarrativeFeatureRailSectionV3Props = {
  align?: ContentNarrativeFeatureRailAlign;
  bullets: readonly string[];
  cards: readonly NarrativeFeatureRailCard[];
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  intro: string;
  paragraphs: readonly string[];
  showImage?: boolean;
  textLinkHref: string;
  textLinkLabel: string;
  title: string;
};

export function ContentNarrativeFeatureRailSectionV3({
  align = "right",
  bullets,
  cards,
  eyebrow,
  imageAlt,
  imageSrc,
  intro,
  paragraphs,
  showImage = true,
  textLinkHref,
  textLinkLabel,
  title,
}: ContentNarrativeFeatureRailSectionV3Props) {
  const contentPosition =
    align === "right" ? "col-start-1" : "col-start-7 max-lg:col-start-5";
  const railPosition =
    align === "right" ? "col-start-9 max-lg:col-start-7" : "col-start-1";

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="items-start"
        columns={14}
        minHeight="none"
        padding="lrg"
      >
        <LayoutGridItem
          alignY="stretch"
          className={`col-span-8 ${contentPosition} row-start-1 max-lg:col-span-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2`}
        >
          <article className="fluid-type-frame sticky top-[var(--site-grid-inset-block)] self-start pr-8 max-lg:pr-2 max-md:static max-md:pr-0">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-display-lg wrap-pretty mt-eyebrow-display text-service-ink">
              {title}
            </h2>
            <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
              {intro}
            </p>

            <div className="measure-longform mt-14 grid gap-8 max-md:mt-10">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={
                    index === 0
                      ? "type-text-lg wrap-pretty text-service-ink"
                      : "type-text-md wrap-pretty text-service-muted"
                  }
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="measure-copy-wide mt-10 grid gap-3">
              {bullets.map((bullet) => (
                <li
                  className="type-text-sm flex items-start gap-3 text-service-ink"
                  key={bullet}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <a
              className="type-text-sm mt-8 inline-block font-semibold text-service-ink underline decoration-service-accent decoration-2 underline-offset-4 transition-colors hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={textLinkHref}
            >
              {textLinkLabel}
            </a>
          </article>
        </LayoutGridItem>

        <LayoutGridItem
          className={`col-span-6 ${railPosition} row-start-1 max-lg:col-span-4 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-md:mt-12 max-sm:col-span-2`}
        >
          <aside className="grid card-grid-gap-med">
            {showImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-surface-token)] bg-service-border">
                <Image
                  alt={imageAlt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 43vw"
                  src={imageSrc}
                />
              </div>
            ) : null}

            {cards.slice(0, 3).map((card) => (
              <article
                className="fluid-type-frame radius-medium border border-service-border bg-service-surface p-6 shadow-service"
                key={`${card.eyebrow}-${card.title}`}
              >
                <p className="type-label text-service-accent">{card.eyebrow}</p>
                <h3 className="type-heading-md wrap-pretty mt-eyebrow-heading-md text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {card.body}
                </p>
                {card.actionLabel && card.actionHref ? (
                  <Button
                    className="mt-body-actions-sm"
                    href={card.actionHref}
                    treatment="text-lift"
                  >
                    {card.actionLabel}
                  </Button>
                ) : null}
              </article>
            ))}
          </aside>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
