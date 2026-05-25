import styles from "./section-v2-type.module.css";

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
        styles["radius-medium"],
        "border border-service-border bg-white p-8 shadow-service",
      )}
      aria-hidden="true"
    >
      <div className={cx(styles["radius-4"], "aspect-video bg-service-surface p-6")}>
        <div className="grid h-full grid-cols-2 gap-4">
          <div className={cx(styles["radius-4"], "bg-white shadow-service")} />
          <div className={cx(styles["radius-4"], "bg-service-accent/15")} />
          <div
            className={cx(
              styles["radius-4"],
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
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 items-center gap-16 px-12 max-lg:grid-cols-1 max-lg:gap-10 max-lg:px-8 max-md:px-6">
        <FeatureGraphic />
        <div className={styles["fluid-type-frame"]}>
          <p className={cx(styles["fluid-label"], "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              styles["fluid-heading-xl"],
              styles["measure-heading-wide"],
              styles["wrap-balance"],
              "mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              styles["fluid-text-lg"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li
                className={cx(
                  styles["fluid-text-md"],
                  styles["measure-copy"],
                  styles["wrap-pretty"],
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
