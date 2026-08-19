import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

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
      {/* A SCRIM IS A SHADE, NOT AN INK. Built from `service-ink` this
          tracked the recipe's headline colour, which is a near-white on every
          chromatic and dark recipe - so the gradient inverted under the
          hardcoded white type above it. `bg-dark` is an absolute, which is what
          a shade over a photograph has to be. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-dark/30 to-transparent" />
      <span className="type-label absolute bottom-[var(--site-grid-inset-block)] left-[var(--site-grid-inset-inline)] text-white/70">
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
    <section className="relative section-min-story bg-service-ink text-service-ink max-md:section-min-screen">
      <FullHeightImage label={imageLabel} />

      <SevenColumnGrid className="relative min-h-[inherit] items-start">
        <SevenColumnGridItem
          alignX="stretch"
          alignY="top"
          className="col-span-3 col-start-5 max-lg:col-span-4 max-lg:col-start-4 max-md:col-span-7 max-md:col-start-1"
        >
          <div className="sticky top-[var(--site-grid-inset-block)] max-md:static">
            <article
              className={cx(
                "fluid-type-frame",
                "radius-medium",
                "card-min-medium flex max-h-[calc(100svh-(var(--site-grid-inset-block)*2))] w-full flex-col justify-between overflow-auto border border-white/45 bg-white p-7 shadow-service max-md:card-min-tall max-md:p-6",
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

              <ul className="mt-8 grid card-grid-gap-sml">
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
