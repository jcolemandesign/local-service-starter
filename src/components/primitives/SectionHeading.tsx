type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  level?: 1 | 2 | 3;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  level = 2,
  className = "",
}: SectionHeadingProps) {
  const HeadingTag = `h${level}` as const;
  const headingSpacing = eyebrow ? "mt-eyebrow-heading-lg" : "";

  return (
    <div
      className={`fluid-type-frame measure-lead ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <p className="type-label text-service-accent">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className={`type-heading-xl text-service-ink ${headingSpacing}`}>
        {title}
      </HeadingTag>
      {body ? (
        <p className="type-text-lg measure-copy wrap-pretty mt-heading-body-lg text-service-muted">
          {body}
        </p>
      ) : null}
    </div>
  );
}
