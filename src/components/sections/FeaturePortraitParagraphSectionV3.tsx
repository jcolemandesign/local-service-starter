import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ContentAlignX = "left" | "center" | "right" | "stretch";
type ContentAlignY = "top" | "middle" | "bottom" | "stretch";

type FeaturePortraitParagraphSectionV3Props = {
  body: string;
  contentAlignX?: ContentAlignX;
  contentAlignY?: ContentAlignY;
  imageLabel: string;
};

export function FeaturePortraitParagraphSectionV3({
  body,
  contentAlignX = "left",
  contentAlignY = "middle",
  imageLabel,
}: FeaturePortraitParagraphSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid>
        <SevenColumnGridItem
          className="col-span-3 max-md:col-span-7"
          alignY="stretch"
        >
          <div
            aria-label={`${imageLabel} portrait image placeholder`}
            className="relative aspect-[2/3] w-full min-w-0 overflow-hidden bg-service-border"
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.04)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
            <div className="absolute inset-0 bg-service-accent/10" />
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-md:col-span-7 max-md:col-start-1"
          alignX={contentAlignX}
          alignY={contentAlignY}
          measure="lead"
        >
          <p className="type-text-lg wrap-pretty text-service-ink">{body}</p>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
