
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type AboutImage = {
  label: string;
};

type ContentAboutCompanySectionV2Props = {
  eyebrow: string;
  statement: string;
  summary: string;
  action: string;
  images: AboutImage[];
  sectionSpace?: "vsml" | "sml" | "med" | "lrg";
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
  sectionSpace = "med",
}: ContentAboutCompanySectionV2Props) {
  const sectionSpaceClass = {
    vsml: "section-space-vsml",
    sml: "section-space-sml",
    med: "section-space-med",
    lrg: "section-space-lrg",
  }[sectionSpace];

  return (
    <section id="about" className="bg-bg-page">
      <SevenColumnGrid className={cx("section-min-none", sectionSpaceClass)}>
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3">
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-5 col-start-3 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3">
          <div className="fluid-type-frame">
            <h2
              className={cx(
                "type-heading-xl",
                "measure-copy-wide",
                "text-service-ink",
              )}
            >
              {statement}
            </h2>
          </div>
        </SevenColumnGridItem>

        {images.slice(0, 2).map((image, index) => (
          <SevenColumnGridItem
            className={cx(
              index === 0 ? "col-span-2" : "col-span-2 col-start-3",
              "max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3",
            )}
            key={image.label}
          >
            <BentoImage label={image.label} />
          </SevenColumnGridItem>
        ))}

        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 col-start-5 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3"
        >
          <div
            className={cx(
              "fluid-type-frame",
              "radius-medium",
              "flex h-full min-w-0 flex-col justify-between bg-service-surface p-7 max-md:p-6",
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
