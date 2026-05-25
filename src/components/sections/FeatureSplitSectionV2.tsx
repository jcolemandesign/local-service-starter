
type FeatureSplitSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FeatureGraphic() {
  return (
    <div
      className={cx(
        "radius-medium",
        "border border-service-border bg-white p-8 shadow-service",
      )}
      aria-hidden="true"
    >
      <div className={cx("radius-4", "aspect-video bg-service-surface p-6")}>
        <div className="grid h-full grid-cols-2 gap-4">
          <div className={cx("radius-4", "bg-white shadow-service")} />
          <div className={cx("radius-4", "bg-service-accent/15")} />
          <div
            className={cx(
              "radius-4",
              "col-span-2 bg-white shadow-service",
            )}
          />
        </div>
      </div>
    </div>
  );
}

export function FeatureSplitSectionV2({
  eyebrow,
  title,
  body,
  points,
}: FeatureSplitSectionV2Props) {
  return (
    <section className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
        <FeatureGraphic />
        <div className="fluid-type-frame">
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-xl",
              "measure-heading-wide",
              "wrap-balance",
              "mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
              "mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li
                className={cx(
                  "type-text-md",
                  "measure-copy",
                  "wrap-pretty",
                  "flex gap-4 text-service-muted",
                )}
                key={point}
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-service-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
