
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
      <div className="container-site">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 max-lg:grid-cols-1 max-lg:gap-10">
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

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item) => (
              <article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "border border-service-border bg-service-surface p-8 shadow-service",
                )}
                key={item.author}
              >
                <blockquote
                  className={cx(
                    "type-text-xl",
                    "measure-copy",
                    "wrap-pretty",
                    "font-medium text-service-ink",
                  )}
                >
                  &quot;{item.quote}&quot;
                </blockquote>
                <p
                  className={cx(
                    "type-heading-sm",
                    "wrap-balance",
                    "mt-8 text-service-ink",
                  )}
                >
                  {item.author}
                </p>
                <p
                  className={cx(
                    "type-text-sm",
                    "measure-caption",
                    "wrap-pretty",
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
