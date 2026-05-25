import type { Metadata } from "next";
import { Button, Card } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Style Guide",
  description: "Internal live reference for shared site design tokens.",
};

const typeTokens = [
  {
    name: "type-display-xl",
    role: "Largest display",
    className: "type-display-xl measure-display wrap-balance",
    spec: "3.5rem - 7rem / 0.92 / 680",
    sample: "Emergency repairs without the runaround",
  },
  {
    name: "type-display-lg",
    role: "Display heading",
    className: "type-display-lg measure-display-wide wrap-balance",
    spec: "2.75rem - 5.5rem / 0.95 / 670",
    sample: "Fast HVAC service when the house will not wait",
  },
  {
    name: "type-heading-xl",
    role: "Large section title",
    className: "type-heading-xl measure-heading-wide wrap-balance",
    spec: "2.25rem - 4rem / 1 / 660",
    sample: "Clear service from request to resolved",
  },
  {
    name: "type-heading-lg",
    role: "Editorial heading",
    className: "type-heading-lg measure-heading wrap-balance",
    spec: "1.75rem - 2.75rem / 1.05 / 650",
    sample: "Repairs explained before work begins",
  },
  {
    name: "type-heading-md",
    role: "Subsection heading",
    className: "type-heading-md measure-heading-wide wrap-balance",
    spec: "1.375rem - 2rem / 1.15 / 650",
    sample: "What happens after you request service",
  },
  {
    name: "type-heading-sm",
    role: "Card heading",
    className: "type-heading-sm measure-heading-wide wrap-balance",
    spec: "1.125rem - 1.375rem / 1.25 / 650",
    sample: "Same-day repair support",
  },
  {
    name: "type-text-xl",
    role: "Lead copy",
    className: "type-text-xl measure-lead wrap-pretty",
    spec: "1.1875rem - 1.5rem / 1.5 / 400",
    sample:
      "Lead copy gives important pages a little more voice while keeping the line length readable across screens.",
  },
  {
    name: "type-text-lg",
    role: "Intro copy",
    className: "type-text-lg measure-copy wrap-pretty",
    spec: "1.0625rem - 1.25rem / 1.6 / 400",
    sample:
      "Use this for short section introductions, service summaries, and supporting copy that needs more presence than body text.",
  },
  {
    name: "type-text-md",
    role: "Body copy",
    className: "type-text-md measure-copy wrap-pretty",
    spec: "1rem - 1.125rem / 1.65 / 400",
    sample:
      "Request service online, describe the issue, and get a fast response from a local technician. Every submission is organized so fewer leads slip through the cracks.",
  },
  {
    name: "type-text-sm",
    role: "Small body",
    className: "type-text-sm measure-copy-wide wrap-pretty",
    spec: "0.875rem - 0.95rem / 1.6 / 400",
    sample:
      "Useful for supporting details, captions inside cards, and compact text that still needs enough room to breathe.",
  },
  {
    name: "type-text-xs",
    role: "Microcopy",
    className: "type-text-xs measure-caption wrap-pretty",
    spec: "0.8125rem - 0.875rem / 1.55 / 400",
    sample:
      "Most appointment windows are confirmed by phone or email before the technician arrives.",
  },
  {
    name: "type-caption",
    role: "Caption",
    className: "type-caption measure-caption wrap-pretty",
    spec: "0.75rem - 0.8125rem / 1.5 / 400",
    sample: "Preview image, service area, or review attribution text.",
  },
  {
    name: "type-label / type-eyebrow",
    role: "Label",
    className: "type-label",
    spec: "0.8125rem - 0.875rem / 1.2 / 750 / 0.12em",
    sample: "Emergency HVAC Repair",
  },
];

const measureTokens = [
  ["measure-display-tight", "12ch"],
  ["measure-display", "15ch"],
  ["measure-display-wide", "18ch"],
  ["measure-heading-tight", "18ch"],
  ["measure-heading", "22ch"],
  ["measure-heading-wide", "28ch"],
  ["measure-lead", "52ch"],
  ["measure-copy", "60ch"],
  ["measure-copy-wide", "70ch"],
  ["measure-longform", "75ch"],
  ["measure-caption", "48ch"],
];

const containers = [
  ["container-site", "1600px max / responsive gutters"],
  ["container-content", "1200px max / responsive gutters"],
  ["container-narrow", "900px max / responsive gutters"],
  ["container-full", "100% width"],
];

const colors = [
  {
    name: "service-ink",
    value: "#17211d",
    surface: "bg-service-ink",
    text: "text-white",
    muted: "text-white/68",
    border: "border-white/18",
    accent: "bg-white text-service-ink",
    usage: "Dark sections, footer, high-contrast CTA bands",
  },
  {
    name: "service-muted",
    value: "#5f6f68",
    surface: "bg-service-muted",
    text: "text-white",
    muted: "text-white/76",
    border: "border-white/22",
    accent: "bg-white text-service-muted",
    usage: "Secondary text color and subdued support surfaces",
  },
  {
    name: "service-accent",
    value: "#1f7a5a",
    surface: "bg-service-accent",
    text: "text-white",
    muted: "text-white/78",
    border: "border-white/24",
    accent: "bg-white text-service-accent",
    usage: "Primary actions, eyebrow text, active states",
  },
  {
    name: "service-surface",
    value: "#f4f7f3",
    surface: "bg-service-surface",
    text: "text-service-ink",
    muted: "text-service-muted",
    border: "border-service-border",
    accent: "bg-service-accent text-white",
    usage: "Quiet section backgrounds and soft panels",
  },
  {
    name: "service-border",
    value: "#dfe7e1",
    surface: "bg-service-border",
    text: "text-service-ink",
    muted: "text-service-muted",
    border: "border-service-muted/25",
    accent: "bg-service-ink text-white",
    usage: "Dividers, card borders, placeholder fields",
  },
  {
    name: "bg-page",
    value: "#ffffff",
    surface: "bg-bg-page",
    text: "text-text-main",
    muted: "text-text-muted",
    border: "border-border-default",
    accent: "bg-accent text-white",
    usage: "Default page background",
  },
  {
    name: "bg-dark",
    value: "#17211d",
    surface: "bg-bg-dark",
    text: "text-text-inverse",
    muted: "text-white/68",
    border: "border-white/18",
    accent: "bg-white text-bg-dark",
    usage: "Semantic dark background alias",
  },
  {
    name: "accent",
    value: "#1f7a5a",
    surface: "bg-accent",
    text: "text-white",
    muted: "text-white/78",
    border: "border-white/24",
    accent: "bg-white text-accent",
    usage: "Semantic accent alias",
  },
];

const radii = [
  ["radius-none", "0"],
  ["radius-tiny", "2px"],
  ["radius-sm / radius-4", "4px"],
  ["radius-md / radius-medium", "8px"],
  ["radius-lg / radius-large", "24px"],
];

const spacing = [
  ["section-space-tight", "4rem desktop / 4rem mobile"],
  ["section-space", "6rem desktop / 4rem mobile"],
  ["section-space-loose", "8rem desktop / 4rem mobile"],
  ["stack-tight", "0.75rem between children"],
  ["stack-default", "1.5rem between children"],
  ["stack-loose", "2.5rem between children"],
];

const stackSpacing = spacing.filter(([name]) => name.startsWith("stack"));

const sectionSpacing = spacing.filter(([name]) => name.startsWith("section"));

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function GuideSection({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-space border-t border-service-border">
      <div className="container-site">
        <div className="fluid-type-frame mb-12">
          <p className="type-label text-service-accent">{eyebrow}</p>
          <h2 className="type-heading-xl measure-heading-wide wrap-balance mt-4 text-service-ink">
            {title}
          </h2>
          {body ? (
            <p className="type-text-lg measure-copy wrap-pretty mt-5 text-service-muted">
              {body}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function TokenMeta({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <code className="rounded bg-service-surface px-2 py-1 text-xs font-semibold text-service-ink">
        {name}
      </code>
      <span className="type-caption text-service-muted">{value}</span>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="bg-white text-service-ink">
      <section className="section-space bg-service-ink text-white">
        <div className="container-site fluid-type-frame">
          <p className="type-label text-white/65">Internal style guide</p>
          <h1 className="type-display-lg measure-heading-wide wrap-balance mt-5">
            Live token reference for the local service starter
          </h1>
          <p className="type-text-xl measure-copy wrap-pretty mt-7 text-white/75">
            This page consumes the same global utilities as the V2 section
            library. Update the shared tokens, and this reference updates with
            the components.
          </p>
        </div>
      </section>

      <GuideSection
        eyebrow="Type"
        title="Typography Roles"
        body="Each sample combines a type role, a recommended measure, and a wrap utility so the preview reflects real composition."
      >
        <div className="grid gap-4">
          {typeTokens.map((token) => (
            <Card className="fluid-type-frame p-6 shadow-none" key={token.name}>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <TokenMeta name={token.name} value={token.spec} />
                  <p className="type-caption mt-2 text-service-muted">{token.role}</p>
                </div>
                <code className="rounded bg-service-surface px-2 py-1 text-xs text-service-muted">
                  {token.className}
                </code>
              </div>
              <p className={cx(token.className, "text-service-ink")}>
                {token.sample}
              </p>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Measure"
        title="Text Measures"
        body="Measure tokens control line length only. They should be composed with type and wrap utilities rather than baked into type classes."
      >
        <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          {measureTokens.map(([name, value]) => (
            <Card className="p-6 shadow-none" key={name}>
              <TokenMeta name={name} value={`max-width: ${value}`} />
              <div className="mt-5 border-l-2 border-dashed border-service-accent/35 pl-4">
                <p className={cx(name, "type-text-md wrap-pretty text-service-muted")}>
                  Healthy service pages keep copy narrow enough to scan while
                  leaving larger containers free to support grids, media, and
                  stronger composition.
                </p>
              </div>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Layout"
        title="Containers And Widths"
        body="Container utilities set page alignment and gutters. Text still gets its own measure token inside the container."
      >
        <div className="grid gap-5">
          {containers.map(([name, value]) => (
            <div className="rounded border border-service-border bg-service-surface py-4" key={name}>
              <div className={cx(name, "fluid-type-frame")}>
                <div className="rounded border border-service-accent/25 bg-white p-5">
                  <TokenMeta name={name} value={value} />
                  <p className="type-text-md measure-copy wrap-pretty mt-4 text-service-muted">
                    The visible white area is using the named container utility.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GuideSection>

      <GuideSection eyebrow="Color" title="Palette Tokens">
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
          {colors.map((color) => (
            <Card className="overflow-hidden shadow-none" key={color.name}>
              <div
                className={cx(
                  color.surface,
                  color.text,
                  "fluid-type-frame min-h-72 p-5",
                )}
              >
                <div className="flex h-full flex-col justify-between gap-8">
                  <div>
                    <div
                      className={cx(
                        color.border,
                        "mb-5 h-16 rounded border bg-white/8",
                      )}
                    />
                    <p className="type-label opacity-75">{color.name}</p>
                    <h3 className="type-heading-sm wrap-balance mt-4">
                      {color.usage}
                    </h3>
                    <p className={cx(color.muted, "type-text-sm wrap-pretty mt-4")}>
                      This card uses the token as the actual surface so contrast,
                      borders, and readable text are visible together.
                    </p>
                  </div>
                  <div>
                    <span
                      className={cx(
                        color.accent,
                        "inline-flex min-h-10 items-center rounded px-4 text-sm font-semibold",
                      )}
                    >
                      Action state
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <TokenMeta name={color.name} value={color.value} />
                <p className="type-caption mt-3 text-service-muted">
                  {color.surface} / {color.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection eyebrow="Shape" title="Radius, Borders, And Shadows">
        <div className="grid grid-cols-5 gap-5 max-lg:grid-cols-3 max-md:grid-cols-1">
          {radii.map(([name, value]) => (
            <Card className="p-5 shadow-none" key={name}>
              <div
                className={cx(
                  name.split(" / ")[0],
                  "border border-service-border bg-service-surface p-4 shadow-service",
                )}
              >
                <div
                  className={cx(
                    name.split(" / ")[0],
                    "aspect-[4/3] border border-service-accent/25 bg-white",
                  )}
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="type-heading-sm text-service-ink">Card shell</p>
                    <p className="type-caption mt-1 text-service-muted">
                      Radius applied to outer and inner boxes.
                    </p>
                  </div>
                  <span
                    className={cx(
                      name.split(" / ")[0],
                      "size-10 shrink-0 border border-service-border bg-white",
                    )}
                  />
                </div>
              </div>
              <div className="mt-4">
                <TokenMeta name={name} value={value} />
              </div>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection eyebrow="Spacing" title="Section And Stack Spacing">
        <div className="grid gap-8">
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {sectionSpacing.map(([name, value]) => (
              <Card className="overflow-hidden shadow-none" key={name}>
                <div className={cx(name, "bg-service-surface px-6")}>
                  <div className="fluid-type-frame rounded border border-service-border bg-white p-6">
                    <p className="type-label text-service-accent">Section sample</p>
                    <h3 className="type-heading-sm measure-heading-wide wrap-balance mt-4 text-service-ink">
                      Padding around a real content group
                    </h3>
                    <p className="type-text-sm measure-copy-wide wrap-pretty mt-3 text-service-muted">
                      The empty area above and below this white box is the section
                      spacing token in action.
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <TokenMeta name={name} value={value} />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {stackSpacing.map(([name, value]) => (
            <Card className="p-6 shadow-none" key={name}>
              <TokenMeta name={name} value={value} />
              <div className={cx(name, "fluid-type-frame mt-6")}>
                <p className="type-label text-service-accent">Emergency Repair</p>
                <h3 className="type-heading-md measure-heading-wide wrap-balance text-service-ink">
                  Same-day help when the system quits
                </h3>
                <p className="type-text-md measure-copy wrap-pretty text-service-muted">
                  This stack uses actual eyebrow, heading, body copy, and actions
                  so the spacing relationship can be judged in context.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="#">Schedule Now</Button>
                  <Button href="#" variant="secondary">
                    Call Today
                  </Button>
                </div>
              </div>
            </Card>
            ))}
          </div>
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Composition"
        title="Shared Styles In Context"
        body="These previews use the same global tokens a production section would compose."
      >
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-6 max-lg:grid-cols-1">
          <Card className="fluid-type-frame p-8 shadow-none max-md:p-6">
            <p className="type-label text-service-accent">Emergency HVAC Repair</p>
            <h3 className="type-heading-xl measure-heading-wide wrap-balance mt-5 text-service-ink">
              Same-day repairs when your system quits
            </h3>
            <p className="type-text-lg measure-copy wrap-pretty mt-6 text-service-muted">
              Get fast help from licensed technicians serving Huntersville,
              Cornelius, Davidson, and North Charlotte.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#">Schedule Now</Button>
              <Button href="#" variant="secondary">
                Call Today
              </Button>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card className="fluid-type-frame p-7 shadow-none">
              <h3 className="type-heading-sm measure-heading-wide wrap-balance text-service-ink">
                Preventive maintenance
              </h3>
              <p className="type-text-sm measure-copy-wide wrap-pretty mt-4 text-service-muted">
                Seasonal tune-ups help catch small issues before they become
                expensive repairs.
              </p>
              <a className="type-label mt-6 inline-block text-service-accent" href="#">
                View service
              </a>
            </Card>

            <Card className="fluid-type-frame p-7 shadow-none">
              <h3 className="type-heading-sm measure-heading-wide wrap-balance text-service-ink">
                Do you provide estimates before work begins?
              </h3>
              <p className="type-text-md measure-copy wrap-pretty mt-4 text-service-muted">
                Yes. Customers receive a clear scope and approval point before
                paid work starts.
              </p>
            </Card>
          </div>
        </div>
      </GuideSection>
    </main>
  );
}
