import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  CardLinkGridAlign,
  CardLinkMedia,
} from "@/content/section-style-options";
import { CardLinkIcon, CardLinkPhoto } from "./CardLinkMedia";
import { CardLinkShell } from "./CardLinkShell";

export type FourCardLinkGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageLabel?: string;
  imageSrc?: string;
  title: string;
};

export type FourCardLinkGridSectionV3Props = {
  align?: CardLinkGridAlign;
  cardBorder?: "on" | "off";
  /**
   * Turns the whole family of card links off so these render as plain
   * content cards. Set on the template in pagebuilder, not inferred from
   * whether copy happened to supply a destination.
   */
  cardLinks?: "on" | "off";
  cardMedia?: CardLinkMedia;
  cardFill?: "solid" | "none";
  items: readonly FourCardLinkGridItem[];
  linkLabel?: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Column start per card, indexed by position - the same idea as the three-up
 * grid, one column narrower per card. Four cards of three columns fill twelve
 * of the fourteen, so these place the two spare columns: all on the right,
 * split either side, or all on the left.
 *
 * No `justified` row. Two spare columns cannot be shared across three gaps in
 * whole columns, which is why the builder does not offer it here - see
 * `unjustifiableCardLinkGrids` in `section-style-options`. It is still keyed so
 * a section that carries the value from another component renders centred
 * rather than losing its starts.
 */
const alignColumnStarts: Record<
  CardLinkGridAlign,
  readonly [string, string, string, string]
> = {
  left: ["col-start-1", "col-start-4", "col-start-7", "col-start-10"],
  center: ["col-start-2", "col-start-5", "col-start-8", "col-start-11"],
  right: ["col-start-3", "col-start-6", "col-start-9", "col-start-12"],
  justified: ["col-start-2", "col-start-5", "col-start-8", "col-start-11"],
};

// Alignment is a fourteen-column idea. Below that the row has already reflowed
// and then stacked, where there are no spare columns to place, so the explicit
// starts are released back to auto.
const responsiveColumns =
  "max-lg:col-span-5 max-lg:col-start-auto max-md:col-span-3 max-md:col-start-auto max-sm:col-span-2";

export function FourCardLinkGridSectionV3({
  align = "center",
  cardBorder = "on",
  cardLinks = "on",
  cardMedia = "photo",
  cardFill = "solid",
  items,
  linkLabel = "Learn more",
}: FourCardLinkGridSectionV3Props) {
  // See `cardTextPadding` in ServicesBentoCardsSectionV2: fill or border makes
  // the card a container the copy sits inside, so it earns more room off the
  // edge. With neither, the copy is on the section ground beside a full-bleed
  // image and horizontal padding only breaks its alignment with that image.
  const hasCardSurface = cardFill === "solid" || cardBorder === "on";
  const cardTextPadding = hasCardSurface
    ? cardMedia === "icon"
      ? "px-[clamp(1.5rem,1.9vw,2.125rem)] pb-[clamp(1.5rem,1.9vw,2.125rem)] pt-4"
      : "p-[clamp(1.5rem,1.9vw,2.125rem)]"
    : "px-0 py-[clamp(1.25rem,1.6vw,1.75rem)]";
  const columnStarts = alignColumnStarts[align] ?? alignColumnStarts.center;

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
            className={cx(
              "col-span-3",
              columnStarts[index],
              responsiveColumns,
            )}
            key={item.title}
          >
            <CardLinkShell
              className={cx(
                // Marks this card as a revealable unit. Inert unless the
                // section's animation toggle is on - see `section-reveal` in
                // globals.css.
                "reveal-on-scroll",
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
              style={{ "--reveal-index": index } as CSSProperties}
            >
              {cardMedia === "photo" ? (
                <CardLinkPhoto
                  asset={item}
                  hasCardSurface={hasCardSurface}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                />
              ) : null}

              <div
                className={cx(
                  "fluid-type-frame flex flex-1 flex-col",
                  cardTextPadding,
                )}
              >
                {cardMedia === "icon" ? (
                  <CardLinkIcon
                    asset={item}
                    hasCardSurface={hasCardSurface}
                  />
                ) : null}
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
