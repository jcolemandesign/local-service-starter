type ContentFixedCoverFadeSectionV2Props = {
  backgroundEyebrow: string;
  backgroundTitle: string;
  backgroundBody: string;
  backgroundLabel: string;
  foregroundEyebrow: string;
  foregroundTitle: string;
  foregroundBody: string;
  items: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BackgroundTexture({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} background placeholder`}
      className="absolute inset-0 overflow-hidden bg-service-ink"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.35),rgb(23_33_29_/_0.02)),linear-gradient(45deg,rgb(255_255_255_/_0.14)_0_1px,transparent_1px_22px)]" />
      <div className="absolute inset-0 bg-service-accent/15" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-service-ink via-service-ink/65 to-transparent" />
      <span className="type-label absolute bottom-8 left-[max(var(--container-gutter),calc((100vw-var(--container-site))/2+var(--container-gutter)))] text-white/55 max-lg:left-8 max-md:left-6">
        {label}
      </span>
    </div>
  );
}

export function ContentFixedCoverFadeSectionV2({
  backgroundEyebrow,
  backgroundTitle,
  backgroundBody,
  backgroundLabel,
  foregroundEyebrow,
  foregroundTitle,
  foregroundBody,
  items,
}: ContentFixedCoverFadeSectionV2Props) {
  return (
    <section className="relative min-h-[200svh] bg-white">
      <div className="sticky top-0 flex min-h-svh overflow-hidden text-white">
        <BackgroundTexture label={backgroundLabel} />
        <div className="container-site relative z-10 flex min-h-svh items-center">
          <div className="fluid-type-frame w-full max-w-none">
            <p className="type-label text-white/60">{backgroundEyebrow}</p>
            <h2 className="type-display-lg mt-eyebrow-display text-white">
              {backgroundTitle}
            </h2>
            <p className="type-text-xl measure-longform wrap-pretty mt-display-body text-white/72">
              {backgroundBody}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-[112svh] bg-white text-service-ink shadow-[0_-32px_90px_rgb(23_33_29_/_0.18)]">
        <div className="container-site grid min-h-[112svh] grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center layout-gap-xlrg py-24 max-lg:grid-cols-1 max-md:py-16">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">
              {foregroundEyebrow}
            </p>
            <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {foregroundTitle}
            </h3>
          </div>

          <div className="fluid-type-frame">
            <p className="type-text-xl measure-lead wrap-pretty text-service-muted">
              {foregroundBody}
            </p>
            <ul className="mt-body-actions-lg grid card-grid-gap-med">
              {items.map((item) => (
                <li
                  className={cx(
                    "radius-medium",
                    "border border-service-border bg-service-surface p-5",
                    "type-text-md font-medium text-service-ink",
                  )}
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
