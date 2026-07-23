import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

export type HeroCompactServiceSectionV3Props = {
  body: string;
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

export function HeroCompactServiceSectionV3({
  body,
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

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-center" columns={14} padding="med">
        <LayoutGridItem
          alignY="middle"
          className="col-span-4 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-heading-lg wrap-pretty mt-eyebrow-heading-md text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="middle"
          className="col-span-6 col-start-5 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
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
          alignY="middle"
          className="col-span-4 col-start-11 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
        >
          <article className="rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-service-ink shadow-service max-md:p-6">
            <h3 className="type-heading-sm text-service-accent">{ctaTitle}</h3>
            <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
              {ctaBody}
            </p>
            <div className="mt-body-actions-md flex flex-col items-stretch gap-3">
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
