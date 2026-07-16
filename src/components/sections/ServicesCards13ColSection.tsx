import Image from "next/image";
import type { CSSProperties } from "react";

import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { ServicesBentoCardsVariant } from "./ServicesBentoCardsSectionV2";

type ServiceCardItem = {
  title: string;
  body: string;
  cardSize?: string;
  imageLabel: string;
  imageSrc?: string;
  size?: "large" | "medium" | "small";
};

type ServicesCards13ColSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceCardItem[];
  variant?: ServicesBentoCardsVariant;
};

type ThirteenColumnCardPlacement = {
  row: number;
  span: number;
  start: number;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getShortTitle(title: string, maxWords = 5) {
  const sanitizedTitle = title.trim().replace(/\.$/, "");
  const words = sanitizedTitle.split(/\s+/).filter(Boolean);

  return words.length <= maxWords
    ? sanitizedTitle
    : words.slice(0, maxWords).join(" ");
}

function ServiceImage({
  label,
  src,
}: {
  label: string;
  src?: string;
}) {
  if (src) {
    return (
      <div className="relative aspect-[5/4] overflow-hidden bg-service-border">
        <Image
          alt={label}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 34vw"
          src={src}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[5/4] overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

const splitHeaderCardSpanPattern = [
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
];

function getThirteenColumnCardSpanValue(item: ServiceCardItem) {
  const size = item.size ?? item.cardSize ?? "";
  const normalizedSize = size.toLowerCase();

  return normalizedSize.includes("large") ||
    normalizedSize.includes("featured") ||
    normalizedSize.includes("3 col") ||
    normalizedSize.includes("3-col")
    ? 3
    : 2;
}

function getCenteredDensePlacements(items: ServiceCardItem[]) {
  const columnCount = 13;
  const rowOccupancy: boolean[][] = [];
  const placements: ThirteenColumnCardPlacement[] = [];

  items.forEach((item) => {
    const span = getThirteenColumnCardSpanValue(item);
    let placed = false;
    let rowIndex = 0;

    while (!placed) {
      const row =
        rowOccupancy[rowIndex] ??
        Array.from({ length: columnCount }, () => false);

      for (let startIndex = 0; startIndex <= columnCount - span; startIndex += 1) {
        const canPlace = row
          .slice(startIndex, startIndex + span)
          .every((slotIsFilled) => !slotIsFilled);

        if (canPlace) {
          for (let slotIndex = startIndex; slotIndex < startIndex + span; slotIndex += 1) {
            row[slotIndex] = true;
          }

          rowOccupancy[rowIndex] = row;
          placements.push({
            row: rowIndex + 1,
            span,
            start: startIndex + 1,
          });
          placed = true;
          break;
        }
      }

      rowIndex += 1;
    }
  });

  const finalRow = Math.max(...placements.map((placement) => placement.row));
  const finalRowWidth = placements
    .filter((placement) => placement.row === finalRow)
    .reduce((width, placement) => width + placement.span, 0);
  const finalRowOffset = Math.floor((columnCount - finalRowWidth) / 2);

  return placements.map((placement) =>
    placement.row === finalRow && finalRowOffset > 0
      ? {
          ...placement,
          start: placement.start + finalRowOffset,
        }
      : placement,
  );
}

function getThirteenColumnCardStyle(
  placement: ThirteenColumnCardPlacement | undefined,
) {
  if (!placement) {
    return undefined;
  }

  return {
    "--service-card-grid-column": `${placement.start} / span ${placement.span}`,
    "--service-card-grid-row": `${placement.row}`,
  } as CSSProperties;
}

export function ServicesCards13ColSection({
  eyebrow,
  title,
  body,
  items,
  variant = "default",
}: ServicesCards13ColSectionProps) {
  const isSplitHeader = variant === "split-header";
  const isOffsetHeader = variant === "offset-header";
  const displayItems = isSplitHeader ? items : items.slice(0, 9);
  const thirteenColumnCardPlacements = isSplitHeader
    ? []
    : getCenteredDensePlacements(displayItems);
  const splitHeaderSupportItems = displayItems.slice(0, 4).map((item) => item.title);
  const splitHeaderBody = [
    body,
    displayItems
      .slice(0, 2)
      .map((item) => item.body)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="service-cards-13col" className="bg-bg-page">
      <SevenColumnGrid className="items-start" minHeight="none" padding="med">
        {isOffsetHeader ? (
          <>
            <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <h2 className="type-heading-xl max-w-4xl text-left text-service-ink">
                {title.trim().replace(/\.$/, "")}
              </h2>
            </SevenColumnGridItem>
            <SevenColumnGridItem
              alignY="bottom"
              className="col-span-3 col-start-5 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1"
            >
              <p className="type-text-lg measure-copy wrap-pretty text-service-muted">
                {body}
              </p>
            </SevenColumnGridItem>
          </>
        ) : (
          <SevenColumnGridItem
            alignX={isSplitHeader ? "left" : "center"}
            className={cx(
              isSplitHeader
                ? "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                : "col-span-5 col-start-2 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1",
            )}
            measure={isSplitHeader ? "copyWide" : undefined}
          >
            <div
              className={cx(
                isSplitHeader ? "text-left" : "text-center",
                "fluid-type-frame",
                isSplitHeader
                  ? "sticky top-[var(--site-grid-inset-block)] max-lg:static"
                  : undefined,
              )}
            >
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2
                className={cx(
                  isSplitHeader ? "type-display-lg" : "type-heading-xl",
                  isSplitHeader ? "mt-eyebrow-heading-lg" : "mx-auto mt-5",
                  "text-service-ink",
                )}
              >
                {isSplitHeader ? getShortTitle(title) : title.trim().replace(/\.$/, "")}
              </h2>
              <p
                className={cx(
                  "type-text-lg measure-copy wrap-pretty text-service-muted",
                  isSplitHeader ? "mt-heading-body-md" : "mx-auto mt-6",
                )}
              >
                {isSplitHeader ? splitHeaderBody : body}
              </p>
              {isSplitHeader ? (
                <ul className="mt-body-actions-lg grid gap-2">
                  {splitHeaderSupportItems.map((item) => (
                    <li
                      className="type-text-sm flex items-center gap-2 font-semibold text-service-ink"
                      key={item}
                    >
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full bg-service-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </SevenColumnGridItem>
        )}

        <SevenColumnGridItem
          className={cx(
            isSplitHeader
              ? "col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1"
              : "col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <div
            className={cx(
              "grid card-grid-gap-med max-md:grid-cols-3 max-sm:grid-cols-1",
              isSplitHeader
                ? "grid-cols-4 items-stretch"
                : "mt-16 grid-flow-dense grid-cols-13 items-center max-lg:grid-cols-7 max-md:mt-12",
            )}
          >
            {displayItems.map((item, index) => (
              <article
                className={cx(
                  "fluid-type-frame radius-medium",
                  "group/service-card relative flex cursor-pointer flex-col overflow-hidden border border-service-border bg-service-surface shadow-service transition-transform duration-300 ease-out hover:scale-[1.015]",
                  isSplitHeader ? "h-full" : undefined,
                  isSplitHeader
                    ? splitHeaderCardSpanPattern[
                        index % splitHeaderCardSpanPattern.length
                      ]
                    : "[grid-column:var(--service-card-grid-column)] [grid-row:var(--service-card-grid-row)] max-lg:[grid-column:span_7_/_span_7] max-lg:[grid-row:auto] max-md:[grid-column:span_3_/_span_3] max-sm:[grid-column:span_1_/_span_1]",
                )}
                key={item.title}
                style={getThirteenColumnCardStyle(
                  thirteenColumnCardPlacements[index],
                )}
              >
                <ServiceImage label={item.imageLabel} src={item.imageSrc} />
                <div className="radius-medium absolute right-3 top-3 flex size-12 items-center justify-center border border-service-border bg-bg-page/90 text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white">
                  <span aria-hidden="true">-&gt;</span>
                </div>
                <div className="flex flex-1 flex-col justify-between px-7 pb-7 pt-7 max-lg:px-5 max-lg:pb-5 max-lg:pt-5">
                  <div>
                    <h3 className="type-heading-sm text-service-ink">{item.title}</h3>
                    <p className="type-text-sm measure-copy mt-4 wrap-pretty text-service-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
