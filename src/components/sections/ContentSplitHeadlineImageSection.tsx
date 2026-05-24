import { Container, Section } from "@/components/primitives";

type ContentSplitHeadlineImageSectionProps = {
  headlineTop: string;
  headlineBottom: string;
  imageLabel: string;
  body: string;
};

function TexturedImage({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-[clamp(13rem,24vw,22rem)] overflow-hidden rounded-lg border border-service-border bg-service-surface shadow-service max-md:w-full max-md:max-w-80"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.52),transparent_28%),radial-gradient(circle_at_76%_32%,rgba(31,122,90,0.12),transparent_24%),radial-gradient(circle_at_48%_82%,rgba(23,33,29,0.12),transparent_30%),linear-gradient(135deg,#edf3eb,#dfe7e1_45%,#f4f7f3)]" />
      <div className="absolute inset-0 opacity-45 bg-[linear-gradient(90deg,rgba(23,33,29,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(23,33,29,0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute inset-6 rounded-md border border-white/55" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/60 bg-white/35 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function ContentSplitHeadlineImageSection({
  headlineTop,
  headlineBottom,
  imageLabel,
  body,
}: ContentSplitHeadlineImageSectionProps) {
  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="grid gap-10 rounded-lg bg-white p-12 max-lg:p-8 max-md:p-6">
          <h2 className="grid justify-items-center gap-7 text-center text-fluid-hero font-medium leading-none text-service-ink max-md:gap-5">
            <span>{headlineTop}</span>
            <TexturedImage label={imageLabel} />
            <span>{headlineBottom}</span>
          </h2>

          <p className="mx-auto max-w-3xl text-center text-2xl font-medium leading-tight text-service-muted max-md:text-xl">
            {body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
