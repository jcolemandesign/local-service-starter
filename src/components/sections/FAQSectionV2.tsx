import styles from "./section-v2-type.module.css";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: FAQItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FAQSectionV2({ eyebrow, title, body, items }: FAQSectionV2Props) {
  return (
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 max-lg:grid-cols-1">
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

          <div className="space-y-4">
            {items.map((item) => (
              <article
                className={cx(
                  styles["fluid-type-frame"],
                  styles["radius-medium"],
                  "border border-service-border bg-white p-7 shadow-service",
                )}
                key={item.question}
              >
                <h3
                  className={cx(
                    styles["fluid-heading-sm"],
                    styles["measure-heading-wide"],
                    styles["wrap-balance"],
                    "text-service-ink",
                  )}
                >
                  {item.question}
                </h3>
                <p
                  className={cx(
                    styles["fluid-text-md"],
                    styles["measure-copy"],
                    styles["wrap-pretty"],
                    "mt-3 text-service-muted",
                  )}
                >
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
