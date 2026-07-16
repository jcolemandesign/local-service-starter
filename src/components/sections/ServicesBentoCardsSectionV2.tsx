import Image from "next/image";

import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ServiceBentoItem = {
  title: string;
  body: string;
  cardSize?: string;
  imageLabel: string;
  imageSrc?: string;
};

export type ServicesBentoCardsVariant =
  | "default"
  | "split-header"
  | "offset-header";

type ServicesBentoCardsSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceBentoItem[];
  variant?: ServicesBentoCardsVariant;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getShortTitle(title: string, maxWords = 5) {
  const sanitizedTitle = title.trim().replace(/\.$/, "");
  const words = sanitizedTitle.split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return sanitizedTitle;
  }

  return words.slice(0, maxWords).join(" ");
}

function getSectionHeaderText(title: string) {
  return title.trim().replace(/\.$/, "");
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
    <div className="relative aspect-[5/4] overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

const bentoCardSpanPattern = [
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
];

const splitHeaderCardSpanPattern = [
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
];

export function ServicesBentoCardsSectionV2({
  eyebrow,
  title,
  body,
  items,
  variant = "default",
}: ServicesBentoCardsSectionV2Props) {
  const isSplitHeader = variant === "split-header";
  const isOffsetHeader = variant === "offset-header";
  const cardSpanPattern = isSplitHeader
    ? splitHeaderCardSpanPattern
    : bentoCardSpanPattern;
  const displayItems = isSplitHeader ? items : items.slice(0, 9);
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
    <section id="services-bento" className="bg-bg-page">
      <SevenColumnGrid className="items-start" minHeight="none" padding="med">
        {isOffsetHeader ? (
          <>
            <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <h2 className="type-heading-xl max-w-4xl text-left text-service-ink">
                {getSectionHeaderText(title)}
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
              <p className={cx("type-label", "text-service-accent")}>
                {eyebrow}
              </p>
              <h2
                className={cx(
                  isSplitHeader ? "type-display-lg" : "type-heading-xl",
                  isSplitHeader ? "mt-eyebrow-heading-lg" : "mx-auto mt-5",
                  "text-service-ink",
                )}
              >
                {isSplitHeader ? getShortTitle(title) : getSectionHeaderText(title)}
              </h2>
              <p
                className={cx(
                  "type-text-lg",
                  "measure-copy",
                  "wrap-pretty",
                  isSplitHeader
                    ? "mt-heading-body-md"
                    : "mx-auto mt-6",
                  "text-service-muted",
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
                : "mt-16 grid-cols-7 items-center max-lg:grid-cols-5 max-md:mt-12",
            )}
          >
            {displayItems.map((item, index) => (
              <article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "group/service-card relative flex cursor-pointer flex-col overflow-hidden border border-service-border bg-service-surface shadow-service transition-transform duration-300 ease-out hover:scale-[1.015]",
                  isSplitHeader ? "h-full" : undefined,
                  cardSpanPattern[index % cardSpanPattern.length],
                )}
                key={item.title}
              >
                <ServiceImage label={item.imageLabel} src={item.imageSrc} />
                <div
                  className={cx(
                    "radius-medium",
                    "absolute right-3 top-3 flex size-12 items-center justify-center border border-service-border bg-bg-page/90 text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white",
                  )}
                >
                  <span aria-hidden="true">-&gt;</span>
                </div>
                <div className="flex flex-1 flex-col justify-between px-7 pb-7 pt-7 max-lg:px-5 max-lg:pb-5 max-lg:pt-5">
                  <div>
                    <h3
                      className={cx(
                        "type-heading-sm",
                        "text-service-ink",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cx(
                        "type-text-sm",
                        "measure-copy",
                        "wrap-pretty",
                        "mt-4 text-service-muted",
                      )}
                    >
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
