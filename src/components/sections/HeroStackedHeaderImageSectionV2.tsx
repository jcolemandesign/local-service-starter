import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";
import { HeroStackedHeaderImageVisual } from "./HeroStackedHeaderImageVisual";

type HeroStackedHeaderImageSectionV2Props = {
  eyebrow: string;
  title: string;
  headingLevel?: 1 | 2;
};

export function HeroStackedHeaderImageSectionV2({
  eyebrow,
  title,
  headingLevel = 1,
}: HeroStackedHeaderImageSectionV2Props) {
  return (
    /* The ground follows the recipe. A literal white here held the section
       light while `text-service-ink` moved with the recipe, so on every dark
       recipe the whole section rendered white text on a white field. */
    <section className="overflow-hidden bg-bg-page text-service-ink">
      <SevenColumnGrid className="section-min-sliver">
        <SevenColumnGridItem className="col-span-7">
          <HeroStackedHeaderImageVisual
            eyebrow={eyebrow}
            headingLevel={headingLevel}
            title={title}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
