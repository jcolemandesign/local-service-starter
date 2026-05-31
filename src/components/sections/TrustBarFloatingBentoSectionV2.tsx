type TrustBarFloatingBentoSectionV2Props = {
  label: string;
  items: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TrustBarFloatingBentoSectionV2({
  label,
  items,
}: TrustBarFloatingBentoSectionV2Props) {
  return (
    <section className="section-space-sml bg-service-surface">
      <div className="container-site">
        <div
          className={cx(
            "fluid-type-frame",
            "radius-medium",
            "grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] items-stretch layout-gap-med border border-service-border bg-white p-4 shadow-service max-lg:grid-cols-1",
          )}
        >
          <div className="radius-medium flex min-h-44 items-end bg-service-ink p-7 text-white max-md:min-h-0 max-md:p-6">
            <p className="type-heading-sm">
              {label}
            </p>
          </div>

          <ul className="grid grid-cols-4 card-grid-gap-sml max-lg:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item, index) => (
              <li
                className={cx(
                  "radius-medium",
                  "flex min-h-32 flex-col justify-between border border-service-border bg-service-surface p-5 max-md:min-h-0",
                )}
                key={item}
              >
                <span className="type-caption text-service-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="type-text-sm wrap-pretty font-semibold text-service-ink">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
