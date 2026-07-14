import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ImageStripItem = {
  alt: string;
  caption?: string;
  objectPosition?: string;
  src: string;
};

type ImageStripSectionV3Props = {
  images: readonly ImageStripItem[];
};

const imageLayoutClasses = [
  "col-span-3 col-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3",
  "col-span-2 col-start-4 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3",
  "col-span-2 col-start-6 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1",
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ImageStripSectionV3({ images }: ImageStripSectionV3Props) {
  const visibleImages = images.slice(0, 3);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        className="section-min-none items-stretch"
        gap="sml"
        padding="med"
      >
        {visibleImages.map((image, index) => (
          <SevenColumnGridItem
            alignX="stretch"
            className={imageLayoutClasses[index]}
            key={`${image.src}-${index}`}
          >
            <figure className="grid h-full min-h-[28rem] grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-white max-lg:min-h-[22rem] max-md:min-h-[18rem]">
              <div className="relative h-full min-h-0 bg-white">
                <Image
                  alt={image.alt}
                  className="object-cover"
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 44vw"
                      : "(max-width: 1024px) 50vw, 28vw"
                  }
                  src={image.src}
                  style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
                />
              </div>
              {image.caption ? (
                <figcaption
                  className={cx(
                    "type-caption border-t border-service-border bg-white px-4 py-3 text-service-muted",
                    index === 0 && "text-service-ink",
                  )}
                >
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </SevenColumnGridItem>
        ))}
      </SevenColumnGrid>
    </section>
  );
}
