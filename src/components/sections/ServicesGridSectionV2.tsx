import styles from "./section-v2-type.module.css";

type ServiceItem = {
  title: string;
  body: string;
};

type ServicesGridSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServicesGridSectionV2({
  eyebrow,
  title,
  body,
  items,
}: ServicesGridSectionV2Props) {
  return (
    <section id="services" className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className="grid grid-cols-3 items-end gap-6 max-lg:grid-cols-1 max-lg:gap-8">
          <div className={cx("col-span-2 max-lg:col-span-1", styles["fluid-type-frame"])}>
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
          </div>
          <p
            className={cx(
              styles["fluid-text-lg"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "text-service-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {items.map((item) => (
            <article
              className={cx(
                styles["fluid-type-frame"],
                styles["radius-medium"],
                "border border-service-border bg-white p-7 shadow-service",
              )}
              key={item.title}
            >
              <div className={cx(styles["radius-4"], "mb-8 h-12 w-12 bg-service-accent/10")} />
              <h3
                className={cx(
                  styles["fluid-heading-sm"],
                  styles["measure-heading-wide"],
                  styles["wrap-balance"],
                  "text-service-ink",
                )}
              >
                {item.title}
              </h3>
              <p
                className={cx(
                  styles["fluid-text-md"],
                  styles["measure-copy"],
                  styles["wrap-pretty"],
                  "mt-4 text-service-muted",
                )}
              >
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
