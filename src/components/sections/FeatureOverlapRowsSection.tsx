type FeatureOverlapItem = {
  eyebrow: string;
  title: string;
  body: string;
  imageLabel: string;
  position: "top" | "middle" | "bottom";
};

type FeatureOverlapRowsSectionProps = {
  items: FeatureOverlapItem[];
};

const positionClass = {
  top: "items-start",
  middle: "items-center",
  bottom: "items-end",
} as const;

function FeatureImage({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[3/2] w-full overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-6 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-6 border-t border-white/45" />
      <div className="absolute inset-10 border border-white/45 max-md:inset-6" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ item, mirrored }: { item: FeatureOverlapItem; mirrored: boolean }) {
  return (
    <article
      className={`relative z-10 w-[min(440px,calc(100vw-3rem))] rounded-lg border border-service-border bg-white p-8 shadow-service max-lg:w-full max-lg:translate-x-0 max-md:p-6 ${
        mirrored ? "-translate-x-1/4" : "translate-x-1/4"
      }`}
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-service-accent">
        {item.eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-tight text-service-ink max-md:text-2xl">
        {item.title}
      </h2>
      <p className="mt-5 text-base leading-7 text-service-muted">{item.body}</p>
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
      className={`flex h-full px-12 py-16 max-lg:h-auto max-lg:px-8 max-lg:py-0 max-md:px-6 ${positionClass[item.position]} ${
        mirrored ? "justify-start" : "justify-end"
      }`}
    >
      <FeatureCard item={item} mirrored={mirrored} />
    </div>
  );
  const image = <FeatureImage label={item.imageLabel} />;

  return (
    <div
      className={`grid overflow-hidden max-lg:grid-cols-1 max-lg:gap-6 max-lg:py-10 ${
        mirrored ? "grid-cols-[3fr_1fr]" : "grid-cols-[1fr_3fr]"
      }`}
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

export function FeatureOverlapRowsSection({
  items,
}: FeatureOverlapRowsSectionProps) {
  return (
    <section className="bg-white">
      {items.map((item, index) => (
        <FeatureRow item={item} key={item.title} mirrored={index % 2 === 1} />
      ))}
    </section>
  );
}
