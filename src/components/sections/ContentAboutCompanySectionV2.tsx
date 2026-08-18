
import type { CSSProperties } from "react";

import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type AboutImage = {
  /**
   * Screen-reader label for the FPO placeholder. Not client copy - it describes
   * the slot, so it defaults per position rather than living in the section
   * library where it read as demo content bound for a client page.
   */
  label?: string;
};

const defaultImageLabels = ["Team", "Service"];

type ContentAboutCompanySectionV2Props = {
  /** This card ships unoutlined, so the border is opt-in here - see
   *  `cardBorderOptInComponents`. */
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
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

function BentoImage({
  label,
  revealIndex,
}: AboutImage & { revealIndex: number }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className={cx(
        // Marks this tile as a revealable unit. Inert unless the section's
        // animation toggle is on - see `section-reveal` in globals.css.
        "reveal-on-scroll reveal-role-media",
        "radius-medium",
        "relative aspect-[5/4] min-w-0 overflow-hidden bg-service-border shadow-service",
      )}
      style={{ "--reveal-index": revealIndex } as CSSProperties}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.24),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function ContentAboutCompanySectionV2({
  cardBorder = "off",
  cardFill = "solid",
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
          {/* Eyebrow and statement share index 0. They are one header split
              across two grid cells, so they have to arrive together - a
              stagger between them would read as the label being a separate
              thought from the sentence it introduces. */}
          <p
            className={cx(
              "reveal-on-scroll reveal-role-heading",
              "content-about-company-eyebrow",
              "type-label",
              "text-service-accent",
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            {eyebrow}
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-5 col-start-3 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3">
          <div
            className="reveal-on-scroll reveal-role-heading fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
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
            key={image.label ?? index}
          >
            <BentoImage
              label={image.label ?? defaultImageLabels[index]}
              revealIndex={index + 1}
            />
          </SevenColumnGridItem>
        ))}

        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 col-start-5 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3"
        >
          <div
            className={cx(
              "reveal-on-scroll reveal-role-card",
              "fluid-type-frame",
              "radius-medium",
              "flex h-full min-w-0 flex-col justify-between bg-service-surface p-7 shadow-service max-md:p-6",
              // The shadow goes with the fill. It is cast BY the card surface,
              // so a transparent card keeping one would be a shadow under
              // nothing - the same pairing every other card section makes.
              cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
              // Added rather than removed: this card has no border of its own,
              // so "on" is what draws one.
              cardBorder === "on" ? "border border-service-border" : undefined,
            )}
            style={{ "--reveal-index": 3 } as CSSProperties}
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
            <Button className="mt-10 w-fit" href="#about">
              {action}
            </Button>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
