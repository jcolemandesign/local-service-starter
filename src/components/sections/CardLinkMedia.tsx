import Image from "next/image";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type CardLinkMediaAsset = {
  iconSrc?: string;
  imageAlt?: string;
  imageLabel?: string;
  imageSrc?: string;
  title: string;
};

export function CardLinkPhoto({
  asset,
  hasCardSurface,
  sizes,
}: {
  asset: CardLinkMediaAsset;
  hasCardSurface: boolean;
  sizes: string;
}) {
  return (
    <div
      className={cx(
        "relative aspect-[4/3] overflow-hidden bg-bg-muted",
        hasCardSurface
          ? "border-b border-service-border"
          : "rounded-[var(--radius-surface-token)]",
      )}
    >
      {asset.imageSrc ? (
        <Image
          alt={asset.imageAlt ?? asset.title}
          className="object-cover transition duration-300 ease-out group-hover/card:scale-[1.025]"
          fill
          sizes={sizes}
          src={asset.imageSrc}
        />
      ) : (
        <span className="type-label grid h-full place-items-center px-4 text-center text-service-muted">
          {asset.imageLabel ?? asset.title}
        </span>
      )}
    </div>
  );
}

export function CardLinkIcon({
  asset,
  hasCardSurface,
}: {
  asset: CardLinkMediaAsset;
  hasCardSurface: boolean;
}) {
  const iconSrc =
    asset.imageSrc === "/images/fpo-image.svg"
      ? (asset.iconSrc ?? asset.imageSrc)
      : asset.imageSrc;

  return iconSrc ? (
    <Image
      alt={asset.imageAlt ?? asset.title}
      className={cx(
        "mb-5 size-[4.6rem] object-contain transition duration-300 ease-out group-hover/card:scale-[1.04] max-sm:size-16",
        hasCardSurface && "mx-auto",
      )}
      height={74}
      src={iconSrc}
      width={74}
    />
  ) : (
    <span
      className={cx(
        "type-caption mb-5 grid size-[4.6rem] place-items-center rounded-[var(--radius-surface-token)] bg-bg-muted px-2 text-center text-service-muted max-sm:size-16",
        hasCardSurface && "mx-auto",
      )}
    >
      {asset.imageLabel ?? asset.title}
    </span>
  );
}
