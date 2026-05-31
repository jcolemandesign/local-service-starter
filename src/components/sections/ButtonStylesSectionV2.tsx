function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ExpandingArrowButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className={cx(
        "group/button relative isolate inline-flex min-h-14 items-center overflow-hidden rounded-full border border-service-ink bg-service-ink px-6 py-2 pr-16 text-sm font-semibold text-service-accent transition-colors duration-300 ease-out hover:text-service-ink",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
      )}
      href={href}
    >
      <span
        aria-hidden="true"
        className="absolute right-1.5 top-1/2 -z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-service-accent transition-all duration-300 ease-out group-hover/button:right-0 group-hover/button:h-full group-hover/button:w-full"
      />
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="absolute right-5 top-1/2 -translate-y-1/2 text-service-ink transition-transform duration-300 ease-out group-hover/button:-translate-x-1"
      >
        -&gt;
      </span>
    </a>
  );
}

export function ButtonStylesSectionV2() {
  return (
    <section className="section-space-med bg-white">
      <div className="container-site">
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-5 max-lg:grid-cols-1">
          <div
            className={cx(
              "fluid-type-frame",
              "radius-medium border border-service-border bg-service-surface p-8 shadow-service max-md:p-6",
            )}
          >
            <p className="type-label text-service-accent">Button style 01</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
              Expanding arrow CTA
            </h2>
            <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
              A pill button for primary calls to action with a directional
              arrow chip that becomes the hover surface.
            </p>
          </div>

          <div
            className={cx(
              "radius-medium",
              "flex min-h-72 items-center justify-center border border-service-border bg-white p-8 shadow-service max-md:min-h-56 max-md:p-6",
            )}
          >
            <ExpandingArrowButton href="#">
              Schedule service
            </ExpandingArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
