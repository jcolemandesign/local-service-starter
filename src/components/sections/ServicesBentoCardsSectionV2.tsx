import Image from "next/image";

import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ServiceBentoItem = {
  title: string;
  body: string;
  cardSize?: string;
  imageLabel: string;
  imageSrc?: string;
};

type ServicesBentoCardsSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceBentoItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ServiceImage({
  label,
  src,
}: {
  label: string;
  src?: string;
}) {
  if (src) {
    return (
      <div className="relative aspect-[5/4] overflow-hidden bg-service-border">
        <Image
          alt={label}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 34vw"
          src={src}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[5/4] overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

const bentoCardSpanPattern = [
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
];

export function ServicesBentoCardsSectionV2({
  eyebrow,
  title,
  body,
  items,
}: ServicesBentoCardsSectionV2Props) {
  return (
    <section id="services-bento" className="bg-bg-page">
      <SevenColumnGrid minHeight="none" padding="med">
        <SevenColumnGridItem
          alignX="center"
          className="col-span-5 col-start-2 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1"
        >
          <div className={cx("text-center", "fluid-type-frame")}>
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
            <h2
              className={cx(
                "type-heading-xl",
                "mx-auto mt-5 text-service-ink",
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                "type-text-lg",
                "measure-copy",
                "wrap-pretty",
                "mx-auto mt-6 text-service-muted",
              )}
            >
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="mt-16 grid grid-cols-7 items-start gap-3 max-md:mt-12 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-1">
            {items.map((item, index) => (
              <article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "group/service-card relative flex cursor-pointer flex-col overflow-hidden border border-service-border bg-service-surface shadow-service transition-transform duration-300 ease-out hover:scale-[1.015]",
                  bentoCardSpanPattern[index % bentoCardSpanPattern.length],
                )}
                key={item.title}
              >
                <ServiceImage label={item.imageLabel} src={item.imageSrc} />
                <div
                  className={cx(
                    "radius-medium",
                    "absolute right-3 top-3 flex size-12 items-center justify-center border border-service-border bg-bg-page/90 text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white",
                  )}
                >
                  <span aria-hidden="true">-&gt;</span>
                </div>
                <div className="flex flex-1 flex-col justify-between px-7 pb-7 pt-7 max-lg:px-5 max-lg:pb-5 max-lg:pt-5">
                  <div>
                    <h3
                      className={cx(
                        "type-heading-sm",
                        "text-service-ink",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cx(
                        "type-text-sm",
                        "measure-copy",
                        "wrap-pretty",
                        "mt-4 text-service-muted",
                      )}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
