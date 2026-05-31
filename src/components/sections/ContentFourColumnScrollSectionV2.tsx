type FourColumnItem = {
  symbol: string;
  title: string;
  body: string;
};

type ContentFourColumnScrollSectionV2Props = {
  items: FourColumnItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentFourColumnScrollSectionV2({
  items,
}: ContentFourColumnScrollSectionV2Props) {
  return (
    <section className="section-space-lrg bg-white">
      <div className="container-site">
        <div
          className={cx(
            "radius-large",
            "flex min-h-[72svh] items-center border border-service-border bg-service-surface p-6 shadow-service max-md:min-h-0 max-md:p-4",
          )}
        >
          <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)] gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {items.map((item) => (
              <article
                className={cx(
                  "radius-medium",
                  "flex min-h-80 flex-col justify-between border border-service-border bg-white p-6 max-md:min-h-64",
                )}
                key={item.title}
              >
                <span className="type-heading-sm text-service-accent" aria-hidden="true">
                  {item.symbol}
                </span>
                <div>
                  <h3 className="type-heading-sm text-service-ink">
                    {item.title}
                  </h3>
                  <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
