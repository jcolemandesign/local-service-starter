import styles from "./section-v2-type.module.css";

type ServiceBentoItem = {
  title: string;
  body: string;
  imageLabel: string;
};

type ServicesBentoCardsSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceBentoItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ServiceImagePlaceholder() {
  return (
    <div className="relative aspect-square overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function ServicesBentoCardsSectionV2({
  eyebrow,
  title,
  body,
  items,
}: ServicesBentoCardsSectionV2Props) {
  return (
    <section id="services-bento" className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className={cx("mx-auto text-center", styles["fluid-type-frame"])}>
          <p className={cx(styles["fluid-label"], "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              styles["fluid-heading-xl"],
              styles["measure-heading-wide"],
              styles["wrap-balance"],
              "mx-auto mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              styles["fluid-text-lg"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "mx-auto mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-3 items-stretch gap-3 max-md:mt-12 max-md:grid-cols-1">
          {items.map((item) => (
            <article
              className={cx(
                styles["fluid-type-frame"],
                styles["radius-medium"],
                "group/service-card flex h-full cursor-pointer flex-col overflow-hidden border border-service-border bg-white shadow-service transition-transform duration-300 ease-out hover:scale-[1.015]",
              )}
              key={item.title}
            >
              <ServiceImagePlaceholder />
              <div
                className={cx(
                  styles["radius-medium"],
                  "absolute right-3 top-3 flex size-12 items-center justify-center border border-white/60 bg-white/90 text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white",
                )}
              >
                <span aria-hidden="true">-&gt;</span>
              </div>
              <div className="flex flex-1 flex-col justify-between px-7 pb-7 pt-7 max-lg:px-5 max-lg:pb-5 max-lg:pt-5">
                <div>
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
                    styles["fluid-text-sm"],
                    styles["measure-copy"],
                    styles["wrap-pretty"],
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
      </div>
    </section>
  );
}
