
type AboutImage = {
  label: string;
};

type ContentAboutCompanySectionV2Props = {
  eyebrow: string;
  statement: string;
  summary: string;
  action: string;
  images: AboutImage[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BentoImage({ label }: AboutImage) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className={cx(
        "radius-medium",
        "relative aspect-[5/4] min-w-0 overflow-hidden bg-service-border",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.24),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function ContentAboutCompanySectionV2({
  eyebrow,
  statement,
  summary,
  action,
  images,
}: ContentAboutCompanySectionV2Props) {
  return (
    <section id="about" className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site grid gap-6">
        <div className="grid grid-cols-[minmax(10rem,1fr)_minmax(0,3fr)] gap-6 max-lg:grid-cols-1">
          <div className="flex min-w-0 items-start">
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
          </div>
          <div className="fluid-type-frame">
            <h2
              className={cx(
                "type-heading-xl",
                "measure-copy-wide",
                "wrap-balance",
                "text-service-ink",
              )}
            >
              {statement}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(14rem,1fr)] gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {images.slice(0, 2).map((image) => (
            <BentoImage key={image.label} label={image.label} />
          ))}

          <div
            className={cx(
              "fluid-type-frame",
              "radius-medium",
              "flex min-w-0 flex-col justify-between bg-service-surface p-7 max-lg:col-span-2 max-md:col-span-1 max-md:p-6",
            )}
          >
            <p
              className={cx(
                "type-heading-sm",
                "measure-copy",
                "wrap-pretty",
                "text-service-ink",
              )}
            >
              {summary}
            </p>
            <a
              className={cx(
                "radius-medium",
                "mt-10 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center whitespace-nowrap bg-service-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-service-accent",
              )}
              href="#about"
            >
              {action}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
