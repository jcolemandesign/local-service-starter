"use client";

import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

type FeatureOverlapItem = {
  body: string;
  eyebrow: string;
  imageLabel: string;
  position: "top" | "middle" | "bottom";
  title: string;
};

type Testimonial = {
  author: string;
  detail: string;
  quote: string;
};

type FeatureOverlapRowsSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  items: readonly FeatureOverlapItem[];
};

type TestimonialsSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  items: readonly Testimonial[];
  title: string;
};

const positionClass = {
  top: "self-start",
  middle: "self-center",
  bottom: "self-end",
} as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FeatureImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className="relative aspect-[3/2] min-h-80 w-full overflow-hidden bg-service-border max-lg:min-h-72 max-md:min-h-56"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function FeatureOverlapCard({
  cardBorder = "on",
  cardFill = "solid",
  item,
  mirrored,
}: {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  item: FeatureOverlapItem;
  mirrored: boolean;
}) {
  return (
    <article
      className={cx(
        "fluid-type-frame radius-medium relative z-10 border border-service-border bg-surface-raised p-10 shadow-service max-md:p-6",
        positionClass[item.position],
        mirrored ? "max-lg:translate-x-0 lg:-translate-x-10" : "max-lg:translate-x-0 lg:translate-x-10",
        cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
        cardBorder === "off" ? "!border-transparent" : undefined,
      )}
    >
      <p className="type-label text-service-accent">{item.eyebrow}</p>
      <h2 className="type-heading-lg mt-4 text-service-ink">{item.title}</h2>
      <p className="type-text-md wrap-pretty mt-6 text-service-muted">
        {item.body}
      </p>
    </article>
  );
}

function FeatureOverlapRow({
  cardBorder,
  cardFill,
  compactTop = false,
  item,
  mirrored = false,
}: {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  compactTop?: boolean;
  item: FeatureOverlapItem;
  mirrored?: boolean;
}) {
  return (
    <SevenColumnGrid
      className={cx(
        "section-min-none py-0 max-lg:py-10",
        compactTop ? "-mt-8 max-lg:mt-0" : undefined,
      )}
      padding="none"
    >
      {mirrored ? (
        <>
          <SevenColumnGridItem
            alignY="stretch"
            className="col-span-5 col-start-1 row-start-1 max-lg:col-span-7"
          >
            <FeatureImage label={item.imageLabel} />
          </SevenColumnGridItem>
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 col-start-5 row-start-1 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
          >
            <FeatureOverlapCard
              cardBorder={cardBorder}
              cardFill={cardFill}
              item={item}
              mirrored
            />
          </SevenColumnGridItem>
        </>
      ) : (
        <>
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 col-start-1 row-start-1 max-lg:col-span-7"
          >
            <FeatureOverlapCard
              cardBorder={cardBorder}
              cardFill={cardFill}
              item={item}
              mirrored={false}
            />
          </SevenColumnGridItem>
          <SevenColumnGridItem
            alignY="stretch"
            className="col-span-5 col-start-3 row-start-1 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
          >
            <FeatureImage label={item.imageLabel} />
          </SevenColumnGridItem>
        </>
      )}
    </SevenColumnGrid>
  );
}

export function FeatureOverlapRowsSectionV3({
  cardBorder,
  cardFill,
  items,
}: FeatureOverlapRowsSectionV3Props) {
  return (
    <section className="bg-bg-page">
      {items.map((item, index) => (
        <FeatureOverlapRow
          cardBorder={cardBorder}
          cardFill={cardFill}
          compactTop={index > 0}
          item={item}
          key={item.title}
          mirrored={index % 2 === 1}
        />
      ))}
    </section>
  );
}

export function TestimonialsSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  items,
  title,
}: TestimonialsSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          measure="copy"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-5 text-service-ink">{title}</h2>
            <p className="type-text-lg wrap-pretty mt-6 text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="stretch"
        >
          <div className="grid h-full grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item, index) => (
              <article
                className={cx(
                  "fluid-type-frame radius-medium border p-8",
                  cardFill === "none"
                    ? "bg-transparent shadow-none"
                    : "bg-service-surface shadow-service",
                  cardBorder === "off"
                    ? "border-transparent"
                    : "border-service-border",
                )}
                key={index}
              >
                <blockquote className="type-text-xl wrap-pretty font-medium text-service-ink">
                  &quot;{item.quote}&quot;
                </blockquote>
                <p className="type-heading-sm mt-8 text-service-ink">
                  {item.author}
                </p>
                <p className="type-text-sm wrap-pretty mt-2 text-service-muted">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
