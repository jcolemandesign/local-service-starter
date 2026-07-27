import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

export type CTAImageAlign = "left" | "right";

export type CTAImageSectionV3Props = {
  action: string;
  /** Which side the copy sits on; the image always takes the opposite side. */
  align?: CTAImageAlign;
  body: string;
  eyebrow: string;
  imageAlt?: string;
  imageSrc?: string;
  title: string;
};

const columnClasses: Record<
  CTAImageAlign,
  { content: string; image: string }
> = {
  left: {
    content: "col-span-6 col-start-1",
    image: "col-span-7 col-start-8",
  },
  right: {
    content: "col-span-6 col-start-9",
    image: "col-span-7 col-start-1",
  },
};

const stackedClasses =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CTAImageSectionV3({
  action,
  align = "left",
  body,
  eyebrow,
  imageAlt,
  imageSrc,
  title,
}: CTAImageSectionV3Props) {
  const columns = columnClasses[align];

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="med"
      >
        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.content, stackedClasses)}
        >
          {/* The action is pinned to the bottom of the copy column rather than
              following the body, so it lines up with the base of the image
              whatever length the copy runs to. */}
          <div className="flex h-full flex-col">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
                {title}
              </h2>
              <p className="type-text-lg measure-copy-wide wrap-pretty mt-heading-body-lg text-service-muted">
                {body}
              </p>
            </div>

            <div className="mt-auto pt-body-actions-md">
              <RequestServiceButton className="w-auto shrink-0 max-md:w-full">
                {action}
              </RequestServiceButton>
            </div>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className={cx(columns.image, stackedClasses)}
        >
          <div className="media-min-medium relative h-full overflow-hidden rounded-[var(--radius-surface-token)] bg-bg-muted">
            {imageSrc ? (
              <Image
                alt={imageAlt ?? ""}
                className="object-cover object-center"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                src={imageSrc}
              />
            ) : null}
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
