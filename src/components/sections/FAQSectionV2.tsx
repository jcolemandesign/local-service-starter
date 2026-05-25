
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
      <div className="container-site">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 max-lg:grid-cols-1">
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
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "border border-service-border bg-white p-7 shadow-service",
                )}
                key={item.question}
              >
                <h3
                  className={cx(
                    "type-heading-sm",
                    "measure-heading-wide",
                    "wrap-balance",
                    "text-service-ink",
                  )}
                >
                  {item.question}
                </h3>
                <p
                  className={cx(
                    "type-text-md",
                    "measure-copy",
                    "wrap-pretty",
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
