import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

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

function hasVisibleCopy(value: string) {
  return value.trim().toLowerCase() !== "[omit]";
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
      <span className="type-label absolute bottom-[var(--site-grid-inset-block)] left-[var(--site-grid-inset-inline)] text-white/55">
        {label}
      </span>
    </div>
  );
}

export function ContentFixedCoverFadeSectionV2({
  backgroundTitle,
  backgroundBody,
  backgroundLabel,
  foregroundEyebrow,
  foregroundTitle,
  foregroundBody,
  items,
}: ContentFixedCoverFadeSectionV2Props) {
  return (
    <section className="relative min-h-[200svh] bg-bg-page">
      <div className="sticky top-0 section-min-screen overflow-hidden text-white">
        <BackgroundTexture label={backgroundLabel} />
        <SevenColumnGrid className="relative z-10">
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-6 max-lg:col-span-7"
          >
            <div className="fluid-type-frame w-full">
              <h2 className="type-display-lg text-white">
                {backgroundTitle}
              </h2>
              <p className="type-text-xl measure-longform wrap-pretty mt-display-body text-white/72">
                {backgroundBody}
              </p>
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </div>

      <div className="relative z-10 bg-bg-page text-service-ink shadow-[0_-32px_90px_rgb(23_33_29_/_0.18)]">
        <SevenColumnGrid className="section-min-screen">
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 max-lg:col-span-7"
          >
            <div className="fluid-type-frame">
              {hasVisibleCopy(foregroundEyebrow) ? (
                <p className="type-label text-service-accent">
                  {foregroundEyebrow}
                </p>
              ) : null}
              <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {foregroundTitle}
              </h3>
              <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-service-muted">
                {foregroundBody}
              </p>
              <ul className="mt-body-actions-md grid card-grid-gap-sml">
                {items.map((item) => (
                  <li
                    className="type-text-sm border-l border-service-border pl-4 font-semibold text-service-ink"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SevenColumnGridItem>

          <SevenColumnGridItem
            alignY="middle"
            className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          >
            <form className="fluid-type-frame radius-medium ml-auto grid w-full max-w-4xl card-grid-gap-med border border-service-border bg-service-surface p-8 shadow-service max-lg:ml-0 max-md:p-6">
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Name
                <input
                  className={cx(
                    "radius-4",
                    "min-h-12 w-full border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Jane Smith"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Service needed
                <input
                  className={cx(
                    "radius-4",
                    "min-h-12 w-full border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Repair, installation, maintenance"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Message
                <textarea
                  className={cx(
                    "radius-4",
                    "min-h-36 w-full border border-service-border bg-bg-page px-4 py-3 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Briefly describe the issue"
                />
              </label>
              <button
                className={cx(
                  "radius-button",
                  "type-label",
                  "min-h-12 cursor-pointer bg-service-accent px-6 text-white transition-colors hover:bg-service-ink",
                )}
                type="button"
              >
                Request service
              </button>
            </form>
          </SevenColumnGridItem>
        </SevenColumnGrid>

      </div>
    </section>
  );
}
