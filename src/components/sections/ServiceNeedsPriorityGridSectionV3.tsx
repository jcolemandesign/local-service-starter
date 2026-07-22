import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ServiceNeedsPriorityGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageSrc?: string;
  title: string;
};

export type ServiceNeedsPriorityGridSectionV3Props = {
  align?: ServiceNeedsPriorityGridAlign;
  items: readonly ServiceNeedsPriorityGridItem[];
  linkLabel?: string;
  showImages?: boolean;
};

export type ServiceNeedsPriorityGridAlign = "left" | "right";

const itemPositions: Record<ServiceNeedsPriorityGridAlign, readonly string[]> = {
  left: [
    "col-span-5 col-start-1",
    "col-span-3 col-start-6",
    "col-span-3 col-start-9",
    "col-span-3 col-start-12",
  ],
  right: [
    "col-span-3 col-start-1",
    "col-span-3 col-start-4",
    "col-span-3 col-start-7",
    "col-span-5 col-start-10",
  ],
};

export function ServiceNeedsPriorityGridSectionV3({
  align = "right",
  items,
  linkLabel = "View options",
  showImages = true,
}: ServiceNeedsPriorityGridSectionV3Props) {
  const positions = itemPositions[align];
  const displayItems =
    align === "left" ? [items[3], ...items.slice(0, 3)] : items.slice(0, 4);
  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        {displayItems.map((item, index) => {
          const isPriority = align === "left" ? index === 0 : index === 3;

          return (
          <LayoutGridItem
            alignY={isPriority ? "stretch" : "middle"}
            className={`${positions[index]} max-lg:col-span-5 max-lg:col-start-auto max-md:col-span-3 max-sm:col-span-2`}
            key={item.title}
          >
            <a
              className={`group/card fluid-type-frame flex min-w-0 flex-col overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent ${
                isPriority ? "h-full" : ""
              }`}
              href={item.href}
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
              <div className="flex flex-1 flex-col p-6 max-md:p-5">
                <h3 className="type-heading-sm text-service-ink">{item.title}</h3>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {item.body}
                </p>
                <span className="type-label mt-auto inline-flex items-center gap-2 pt-5 text-service-accent">
                  {linkLabel} <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </a>
          </LayoutGridItem>
          );
        })}
      </LayoutGrid>
    </section>
  );
}
