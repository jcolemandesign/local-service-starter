import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { CardLinkGridAlign } from "@/content/section-style-options";
import { CardLinkShell } from "./CardLinkShell";

export type ThreeCardLinkGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageLabel?: string;
  imageSrc?: string;
  title: string;
};

export type ThreeCardLinkGridSectionV3Props = {
  align?: CardLinkGridAlign;
  cardBorder?: "on" | "off";
  /**
   * Turns the whole family of card links off so these render as plain
   * content cards. Set on the template in pagebuilder, not inferred from
   * whether copy happened to supply a destination.
   */
  cardLinks?: "on" | "off";
  cardFill?: "solid" | "none";
  items: readonly ThreeCardLinkGridItem[];
  linkLabel?: string;
  showImages?: boolean;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Column start per card, indexed by position. Each card is four columns wide,
 * so these are what place the two spare columns of the fourteen. Every card
 * carries an explicit start - auto flow cannot leave the gap that "justified"
 * needs between cards.
 */
const alignColumnStarts: Record<
  CardLinkGridAlign,
  readonly [string, string, string]
> = {
  left: ["col-start-1", "col-start-5", "col-start-9"],
  center: ["col-start-2", "col-start-6", "col-start-10"],
  right: ["col-start-3", "col-start-7", "col-start-11"],
  justified: ["col-start-1", "col-start-6", "col-start-11"],
};

// Alignment is a fourteen-column idea. Below that the row has already reflowed
// to three-up in ten columns and then stacked, where there are no spare columns
// to place, so the explicit starts are released back to auto.
const responsiveColumns =
  "max-lg:col-span-3 max-lg:col-start-auto max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2";

export function ThreeCardLinkGridSectionV3({
  align = "center",
  cardBorder = "on",
  cardLinks = "on",
  cardFill = "solid",
  items,
  linkLabel = "Learn more",
  showImages = true,
}: ThreeCardLinkGridSectionV3Props) {
  const columnStarts = alignColumnStarts[align] ?? alignColumnStarts.center;
  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="med"
      >
        {items.slice(0, 3).map((item, index) => (
          <LayoutGridItem
            alignY="stretch"
            className={cx(
              "col-span-4",
              columnStarts[index],
              responsiveColumns,
            )}
            key={item.title}
          >
            <CardLinkShell
              className={cx(
                "group/card flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service",
                // Hover lift and focus ring belong to a card you can click.
                // A static card keeps the surface and drops the affordance.
                cardLinks === "on" &&
                  "transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                "recipe-card-context",
                cardFill === "none" && "!bg-transparent !shadow-none",
                cardBorder === "off" && "!border-transparent",
              )}
              href={cardLinks === "on" ? item.href : undefined}
            >
              {showImages ? (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-service-border bg-bg-muted">
                  {item.imageSrc ? (
                    <Image
                      alt={item.imageAlt ?? item.title}
                      className="object-cover transition duration-300 ease-out group-hover/card:scale-[1.025]"
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 34vw"
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
                {cardLinks === "on" ? (
                  <span className="type-label mt-auto inline-flex items-center gap-2 pt-4 text-service-accent">
                    {linkLabel}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover/card:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                ) : null}
              </div>
            </CardLinkShell>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
