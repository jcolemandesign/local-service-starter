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

  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? (
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-service-accent">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className="text-fluid-heading font-semibold leading-heading text-service-ink">
        {title}
      </HeadingTag>
      {body ? (
        <p className="mt-5 text-lg leading-8 text-service-muted max-md:text-base max-md:leading-7">
          {body}
        </p>
      ) : null}
    </div>
  );
}
