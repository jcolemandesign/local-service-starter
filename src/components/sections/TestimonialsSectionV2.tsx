import styles from "./section-v2-type.module.css";

type Testimonial = {
  quote: string;
  author: string;
  detail: string;
};

type TestimonialsSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: Testimonial[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TestimonialsSectionV2({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsSectionV2Props) {
  return (
    <section className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 max-lg:grid-cols-1 max-lg:gap-10">
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
          </div>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item) => (
              <article
                className={cx(
                  styles["fluid-type-frame"],
                  styles["radius-medium"],
                  "border border-service-border bg-service-surface p-8 shadow-service",
                )}
                key={item.author}
              >
                <blockquote
                  className={cx(
                    styles["fluid-text-xl"],
                    styles["measure-copy"],
                    styles["wrap-pretty"],
                    "font-medium text-service-ink",
                  )}
                >
                  &quot;{item.quote}&quot;
                </blockquote>
                <p
                  className={cx(
                    styles["fluid-heading-sm"],
                    styles["wrap-balance"],
                    "mt-8 text-service-ink",
                  )}
                >
                  {item.author}
                </p>
                <p
                  className={cx(
                    styles["fluid-text-sm"],
                    styles["measure-caption"],
                    styles["wrap-pretty"],
                    "mt-2 text-service-muted",
                  )}
                >
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
