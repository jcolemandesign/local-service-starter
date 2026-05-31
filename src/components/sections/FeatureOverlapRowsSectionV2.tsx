
type FeatureOverlapItem = {
  eyebrow: string;
  title: string;
  body: string;
  imageLabel: string;
  position: "top" | "middle" | "bottom";
};

type FeatureOverlapRowsSectionV2Props = {
  items: FeatureOverlapItem[];
};

const positionClass = {
  top: "items-start",
  middle: "items-center",
  bottom: "items-end",
} as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FeatureImage() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[3/2] w-full overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function FeatureCard({
  item,
  mirrored,
}: {
  item: FeatureOverlapItem;
  mirrored: boolean;
}) {
  return (
    <article
      className={cx(
        "fluid-type-frame",
        "radius-medium",
        "relative z-10 w-[min(560px,calc(100vw-3rem))] border border-service-border bg-white p-10 shadow-service max-lg:w-full max-lg:translate-x-0 max-md:p-6",
        mirrored ? "-translate-x-1/4" : "translate-x-1/4",
      )}
    >
      <p className={cx("type-label", "text-service-accent")}>
        {item.eyebrow}
      </p>
      <h2
        className={cx(
          "type-heading-lg",
          "mt-4 text-service-ink",
        )}
      >
        {item.title}
      </h2>
      <p
        className={cx(
          "type-text-md",
          "measure-copy",
          "wrap-pretty",
          "mt-6 text-service-muted",
        )}
      >
        {item.body}
      </p>
    </article>
  );
}

function FeatureRow({
  item,
  mirrored = false,
}: {
  item: FeatureOverlapItem;
  mirrored?: boolean;
}) {
  const card = (
    <div
      className={cx(
        "flex h-full px-12 py-16 max-lg:h-auto max-lg:px-8 max-lg:py-0 max-md:px-6",
        positionClass[item.position],
        mirrored ? "justify-start" : "justify-end",
      )}
    >
      <FeatureCard item={item} mirrored={mirrored} />
    </div>
  );
  const image = <FeatureImage />;

  return (
    <div
      className={cx(
        "grid overflow-hidden max-lg:grid-cols-1 max-lg:gap-6 max-lg:py-10",
        mirrored ? "grid-cols-[3fr_1fr]" : "grid-cols-[1fr_3fr]",
      )}
    >
      {mirrored ? (
        <>
          {image}
          {card}
        </>
      ) : (
        <>
          {card}
          {image}
        </>
      )}
    </div>
  );
}

export function FeatureOverlapRowsSectionV2({
  items,
}: FeatureOverlapRowsSectionV2Props) {
  return (
    <section className="bg-white">
      {items.map((item, index) => (
        <FeatureRow item={item} key={item.title} mirrored={index % 2 === 1} />
      ))}
    </section>
  );
}
