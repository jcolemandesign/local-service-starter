import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type FourCardLinkGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageLabel?: string;
  imageSrc?: string;
  title: string;
};

export type FourCardLinkGridSectionV3Props = {
  items: readonly FourCardLinkGridItem[];
  linkLabel?: string;
  showImages?: boolean;
};

export function FourCardLinkGridSectionV3({
  items,
  linkLabel = "Learn more",
  showImages = true,
}: FourCardLinkGridSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="med"
      >
        {items.slice(0, 4).map((item, index) => (
          <LayoutGridItem
            alignY="stretch"
            className={
              index === 0
                ? "col-span-3 col-start-2 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-2"
                : "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-2"
            }
            key={item.title}
          >
            <a
              className="group/card flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={item.href}
            >
              {showImages ? (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-service-border bg-bg-muted">
                  {item.imageSrc ? (
                    <Image
                      alt={item.imageAlt ?? item.title}
                      className="object-cover transition duration-300 ease-out group-hover/card:scale-[1.025]"
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      src={item.imageSrc}
                    />
                  ) : (
                    <span className="type-label grid h-full place-items-center px-4 text-center text-service-muted">
                      {item.imageLabel ?? item.title}
                    </span>
                  )}
                </div>
              ) : null}

              <div className="fluid-type-frame flex flex-1 flex-col p-[clamp(1.25rem,1.6vw,1.75rem)]">
                <h3 className="type-heading-sm text-service-ink">{item.title}</h3>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {item.body}
                </p>
                <span className="type-label mt-auto inline-flex items-center gap-2 pt-4 text-service-accent">
                  {linkLabel}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover/card:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </div>
            </a>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
