import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ServiceNeedsPriorityGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageSrc?: string;
  title: string;
};

export type ServiceNeedsPriorityGridSectionV3Props = {
  align?: ServiceNeedsPriorityGridAlign;
  cardFill?: "solid" | "none";
  items: readonly ServiceNeedsPriorityGridItem[];
  linkLabel?: string;
  primaryAction?: string;
  primaryActionHref?: string;
  priorityEyebrow?: string;
  secondaryAction?: string;
  secondaryActionHref?: string;
  showImages?: boolean;
};

export type ServiceNeedsPriorityGridAlign = "left" | "right";

export function ServiceNeedsPriorityGridSectionV3({
  align = "right",
  cardFill = "solid",
  items,
  linkLabel = "View options",
  primaryAction = "Request service",
  primaryActionHref = "/contact",
  priorityEyebrow = "Priority need",
  secondaryAction = "Explore service options",
  secondaryActionHref = "/services",
  showImages = true,
}: ServiceNeedsPriorityGridSectionV3Props) {
  const priorityItem = items[3];
  const smallItems = items.slice(0, 3);
  const priorityPosition =
    "col-span-5 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-2";
  const smallCardsPosition =
    align === "left"
      ? "col-span-9 col-start-6 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
      : "col-span-9 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

  function renderCard(item: ServiceNeedsPriorityGridItem, isPriority: boolean) {
    return (
      <article
        className={`group/card fluid-type-frame flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent ${
          cardFill === "none" ? "!bg-transparent !shadow-none" : ""
        }`}
      >
        {showImages ? (
          <div className="relative aspect-[4/3] overflow-hidden border-b border-service-border bg-bg-muted">
            {item.imageSrc ? (
              <Image
                alt={item.imageAlt ?? item.title}
                className="object-cover transition duration-300 ease-out group-hover/card:scale-[1.025]"
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 28vw"
                src={item.imageSrc}
              />
            ) : null}
          </div>
        ) : null}
        <div
          className={`flex flex-1 flex-col ${
            isPriority ? "p-8 max-md:p-6" : "p-6 max-md:p-5"
          }`}
        >
          {isPriority ? (
            <p className="type-label text-service-accent">{priorityEyebrow}</p>
          ) : null}
          <h3
            className={
              isPriority
                ? "type-heading-lg wrap-pretty mt-eyebrow-heading-md text-service-ink"
                : "type-heading-sm text-service-ink"
            }
          >
            {item.title}
          </h3>
          <p
            className={`${
              isPriority ? "type-text-md" : "type-text-sm"
            } wrap-pretty mt-heading-body-sm text-service-muted`}
          >
            {item.body}
          </p>
          {isPriority ? (
            <div className="mt-auto flex flex-nowrap gap-3 pt-8 max-sm:flex-wrap">
              <Button href={primaryActionHref}>{primaryAction}</Button>
              <Button href={secondaryActionHref} variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          ) : (
            <a
              className="type-label mt-auto inline-flex items-center gap-2 pt-5 text-service-accent transition-colors hover:text-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={item.href}
            >
              {linkLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </article>
    );
  }

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        {align === "left" ? (
          <LayoutGridItem
            alignY="stretch"
            className={`${priorityPosition} col-start-1`}
          >
            {renderCard(priorityItem, true)}
          </LayoutGridItem>
        ) : null}

        <LayoutGridItem alignY="middle" className={smallCardsPosition}>
          <div className="grid auto-rows-fr grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {smallItems.map((item) => (
              <div className="flex" key={item.title}>
                {renderCard(item, false)}
              </div>
            ))}
          </div>
        </LayoutGridItem>

        {align === "right" ? (
          <LayoutGridItem
            alignY="stretch"
            className={`${priorityPosition} col-start-10 max-lg:col-start-1`}
          >
            {renderCard(priorityItem, true)}
          </LayoutGridItem>
        ) : null}
      </LayoutGrid>
    </section>
  );
}
