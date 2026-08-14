import Image from "next/image";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroContentTopImageBottomSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  /** Public path to the band image. Empty renders the drawn placeholder. */
  imageAlt?: string;
  imageSrc?: string;
  primaryAction: string;
  secondaryAction: string;
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BottomImage({ alt, src }: { alt?: string; src?: string }) {
  if (src) {
    return (
      <div className="relative h-full min-h-0 overflow-hidden bg-bg-muted">
        <Image
          alt={alt ?? ""}
          className="object-cover object-center"
          fill
          // Eager, like every other hero image in the library: default lazy
          // loading never fires inside the builder canvas and the staged
          // preview, whose scroll container the observer does not see, and the
          // element renders with nothing in it.
          priority
          sizes="100vw"
          src={src}
        />
      </div>
    );
  }

  return (
    <div
      aria-label="Sample service image placeholder"
      className="relative h-full min-h-0 overflow-hidden bg-zinc-300"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.24),transparent_42%),linear-gradient(45deg,rgb(255_255_255_/_0.18)_0_1px,transparent_1px_22px)]" />
    </div>
  );
}

export function HeroContentTopImageBottomSectionV2({
  eyebrow,
  title,
  body,
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  headingLevel = 1,
}: HeroContentTopImageBottomSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-bg-page text-service-ink">
      <SevenColumnGrid className="section-min-sliver grid-rows-[auto_minmax(var(--media-min-medium),1fr)] max-lg:grid-rows-none">
        {/* Eyebrow and headline are one stacked block across columns 1-5. They
            used to sit side by side in columns 1-2 and 3-5, which read as two
            separate items and left the headline the narrowest slot on the row
            even though it is the section's whole message. */}
        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className="col-span-5 col-start-1 max-lg:col-span-7"
        >
          <div className="fluid-type-frame measure-copy-wide">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-heading-xl mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div
            className={cx(
              "fluid-type-frame",
              "measure-copy flex flex-col items-start",
            )}
          >
            <p className="type-text-md wrap-pretty text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-sm flex flex-wrap gap-3">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-7 row-start-2 -mb-[var(--site-grid-inset-block)] max-lg:row-auto"
        >
          <BottomImage alt={imageAlt} src={imageSrc} />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
