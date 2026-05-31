type ContentStickyImagePanelSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  imageLabel: string;
  points: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FullHeightImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className="absolute inset-0 overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(23_33_29_/_0.18),rgb(31_122_90_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_20px)]" />
      <div className="absolute inset-0 bg-service-accent/15" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-service-ink/30 to-transparent" />
      <span className="type-label absolute bottom-8 left-[max(var(--container-gutter),calc((100vw-var(--container-site))/2+var(--container-gutter)))] text-white/70 max-lg:left-8 max-md:left-6">
        {label}
      </span>
    </div>
  );
}

export function ContentStickyImagePanelSectionV2({
  eyebrow,
  title,
  body,
  imageLabel,
  points,
}: ContentStickyImagePanelSectionV2Props) {
  return (
    <section className="relative min-h-svh bg-service-ink text-service-ink max-md:min-h-0">
      <FullHeightImage label={imageLabel} />

      <div className="container-site relative min-h-svh max-md:min-h-0 max-md:py-24">
        <div className="sticky top-10 flex justify-end pt-0 max-md:static max-md:justify-start">
          <article
            className={cx(
              "fluid-type-frame",
              "radius-medium",
              "flex aspect-square w-[min(38vw,34rem)] translate-x-6 flex-col justify-between border border-white/45 bg-white p-8 shadow-service max-lg:w-[min(48vw,30rem)] max-lg:translate-x-0 max-md:aspect-auto max-md:min-h-[26rem] max-md:w-full max-md:p-6",
            )}
          >
            <div>
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
                {title}
              </h2>
              <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
                {body}
              </p>
            </div>

            <ul className="grid card-grid-gap-sml">
              {points.map((point) => (
                <li
                  className="type-caption flex items-center justify-between gap-4 border-t border-service-border pt-3 text-service-muted"
                  key={point}
                >
                  <span>{point}</span>
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-service-accent"
                  />
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
