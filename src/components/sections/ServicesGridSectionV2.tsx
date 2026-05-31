
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
      <div className="container-site">
        <div className="grid grid-cols-3 items-end gap-6 max-lg:grid-cols-1 max-lg:gap-8">
          <div className={cx("col-span-2 max-lg:col-span-1", "fluid-type-frame")}>
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
            <h2
              className={cx(
                "type-heading-xl",
                "mt-5 text-service-ink",
              )}
            >
              {title}
            </h2>
          </div>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
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
                "fluid-type-frame",
                "radius-medium",
                "border border-service-border bg-white p-7 shadow-service",
              )}
              key={item.title}
            >
              <div className={cx("radius-4", "mb-8 h-12 w-12 bg-service-accent/10")} />
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
                  "type-text-md",
                  "measure-copy",
                  "wrap-pretty",
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
