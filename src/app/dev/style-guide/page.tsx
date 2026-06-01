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
    typeClass: "type-display-xl",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "3.5rem - 7rem / 0.92 / 680 / balanced",
    sample: "Emergency repairs without the runaround",
  },
  {
    name: "type-display-lg",
    role: "Display heading",
    typeClass: "type-display-lg",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "2.75rem - 5.5rem / 0.95 / 670 / balanced",
    sample: "Fast HVAC service when the house will not wait",
  },
  {
    name: "type-heading-xl",
    role: "Large section title",
    typeClass: "type-heading-xl",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "2.25rem - 4rem / 1 / 660 / balanced",
    sample: "Clear service from request to resolved",
  },
  {
    name: "type-heading-lg",
    role: "Editorial heading",
    typeClass: "type-heading-lg",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "1.75rem - 2.75rem / 1.05 / 650 / balanced",
    sample: "Repairs explained before work begins",
  },
  {
    name: "type-heading-md",
    role: "Subsection heading",
    typeClass: "type-heading-md",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "1.375rem - 2rem / 1.15 / 650 / balanced",
    sample: "What happens after you request service",
  },
  {
    name: "type-heading-sm",
    role: "Card heading",
    typeClass: "type-heading-sm",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "1.125rem - 1.375rem / 1.25 / 650 / balanced",
    sample: "Same-day repair support",
  },
  {
    name: "type-text-xl",
    role: "Lead copy",
    typeClass: "type-text-xl",
    measureClass: "measure-lead",
    wrapClass: "wrap-pretty",
    spec: "1.1875rem - 1.5rem / 1.5 / 400",
    sample:
      "Lead copy gives important pages a little more voice while keeping the line length readable across screens.",
  },
  {
    name: "type-text-lg",
    role: "Intro copy",
    typeClass: "type-text-lg",
    measureClass: "measure-copy",
    wrapClass: "wrap-pretty",
    spec: "1.0625rem - 1.25rem / 1.6 / 400",
    sample:
      "Use this for short section introductions, service summaries, and supporting copy that needs more presence than body text.",
  },
  {
    name: "type-text-md",
    role: "Body copy",
    typeClass: "type-text-md",
    measureClass: "measure-copy",
    wrapClass: "wrap-pretty",
    spec: "1rem - 1.125rem / 1.65 / 400",
    sample:
      "Request service online, describe the issue, and get a fast response from a local technician. Every submission is organized so fewer leads slip through the cracks.",
  },
  {
    name: "type-text-sm",
    role: "Small body",
    typeClass: "type-text-sm",
    measureClass: "measure-copy-wide",
    wrapClass: "wrap-pretty",
    spec: "0.875rem - 0.95rem / 1.6 / 400",
    sample:
      "Useful for supporting details, captions inside cards, and compact text that still needs enough room to breathe.",
  },
  {
    name: "type-text-xs",
    role: "Microcopy",
    typeClass: "type-text-xs",
    measureClass: "measure-caption",
    wrapClass: "wrap-pretty",
    spec: "0.8125rem - 0.875rem / 1.55 / 400",
    sample:
      "Most appointment windows are confirmed by phone or email before the technician arrives.",
  },
  {
    name: "type-caption",
    role: "Caption",
    typeClass: "type-caption",
    measureClass: "measure-caption",
    wrapClass: "wrap-pretty",
    spec: "0.75rem - 0.8125rem / 1.5 / 400",
    sample: "Preview image, service area, or review attribution text.",
  },
  {
    name: "type-label / type-eyebrow",
    role: "Label",
    typeClass: "type-label",
    measureClass: undefined,
    wrapClass: undefined,
    spec: "0.8125rem - 0.875rem / 1.2 / 750 / 0.12em",
    sample: "Emergency HVAC Repair",
  },
];

const measureTokens = [
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
    usage: "Brand dark ink with a green undertone",
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
    usage: "Core service brand accent and primary action color",
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
    value: "#10141b",
    surface: "bg-bg-dark",
    text: "text-text-inverse",
    muted: "text-white/68",
    border: "border-white/18",
    accent: "bg-white text-bg-dark",
    usage: "Neutral dark background for non-brand dark sections",
  },
  {
    name: "accent",
    value: "#c45a2c",
    surface: "bg-accent",
    text: "text-white",
    muted: "text-white/78",
    border: "border-white/24",
    accent: "bg-white text-accent",
    usage: "Warm highlight accent for contrast moments",
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
  ["section-space-vsml", "2rem desktop / 2rem mobile"],
  ["section-space-sml", "4rem desktop / 4rem mobile"],
  ["section-space-med", "6rem desktop / 4rem mobile"],
  ["section-space-lrg", "8rem desktop / 4rem mobile"],
];

const sectionSpacing = spacing.filter(([name]) => name.startsWith("section"));

const relationshipSpacing = [
  {
    title: "Compact Card Header",
    description: "label -> heading-sm -> text-sm -> text link",
    tokens: [
      ["mt-eyebrow-heading-sm", "0.5rem"],
      ["mt-heading-body-sm", "0.75rem"],
      ["mt-body-actions-sm", "1.25rem"],
    ],
    kind: "compact",
  },
  {
    title: "Default Section Header",
    description: "label -> heading-xl -> text-lg -> button row",
    tokens: [
      ["mt-eyebrow-heading-lg", "1.25rem"],
      ["mt-heading-body-lg", "1.5rem"],
      ["mt-body-actions-md", "2rem"],
    ],
    kind: "default",
  },
  {
    title: "Hero / Display Header",
    description: "label -> display-lg -> text-xl -> primary actions",
    tokens: [
      ["mt-eyebrow-display", "1.5rem"],
      ["mt-display-body", "1.75rem"],
      ["mt-body-actions-lg", "2.5rem"],
    ],
    kind: "hero",
  },
  {
    title: "Editorial Flow",
    description: "paragraph -> paragraph -> subheading -> paragraph",
    tokens: [
      ["mt-paragraph-paragraph", "1rem"],
      ["mt-paragraph-heading-md", "2.25rem"],
      ["mt-heading-body-md", "1rem"],
    ],
    kind: "editorial",
  },
];

const gapTokens = [
  {
    group: "Inline gaps",
    description: "Small flex groups: buttons, nav items, badges, controls.",
    items: [
      ["inline-gap-sml", "0.5rem"],
      ["inline-gap-med", "1rem"],
      ["inline-gap-lrg", "1.75rem"],
      ["inline-gap-xlrg", "2.25rem"],
    ],
    kind: "inline",
  },
  {
    group: "Card grid gaps",
    description: "Spacing between repeated card items in a grid.",
    items: [
      ["card-grid-gap-sml", "0.5rem"],
      ["card-grid-gap-med", "1rem"],
      ["card-grid-gap-lrg", "1.75rem"],
      ["card-grid-gap-xlrg", "2.25rem"],
    ],
    kind: "card",
  },
  {
    group: "Layout gaps",
    description: "Major columns and internal section layouts.",
    items: [
      ["layout-gap-sml", "0.5rem"],
      ["layout-gap-med", "1rem"],
      ["layout-gap-lrg", "1.75rem"],
      ["layout-gap-xlrg", "2.25rem"],
    ],
    kind: "layout",
  },
];

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
    <section className="section-space-med border-t border-service-border">
      <div className="container-site">
        <div className="fluid-type-frame mb-12">
          <p className="type-label text-service-accent">{eyebrow}</p>
          <h2 className="type-heading-xl mt-4 text-service-ink">
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

function ExpandingArrowButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className="group relative inline-flex min-h-14 items-center overflow-hidden rounded-full border border-service-ink bg-service-ink px-6 py-2 pr-16 text-sm font-semibold text-service-accent transition-colors duration-300 ease-out hover:text-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
      href={href}
    >
      <span
        aria-hidden="true"
        className="absolute right-1.5 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-service-accent transition-all duration-300 ease-out group-hover:right-0 group-hover:h-full group-hover:w-full"
      />
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-service-ink transition-transform duration-300 ease-out group-hover:-translate-x-1"
      >
        -&gt;
      </span>
    </a>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="bg-white text-service-ink">
      <section className="section-space-med bg-service-ink text-white">
        <div className="container-site fluid-type-frame">
          <p className="type-label text-white/65">Internal style guide</p>
          <h1 className="type-display-lg mt-5">
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
        body="Heading roles include balanced wrapping by default. Copy roles pair with measure and wrap utilities so the preview reflects real composition."
      >
        <div className="grid gap-4">
          {typeTokens.map((token) => (
            <Card className="fluid-type-frame p-6 shadow-none" key={token.name}>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <TokenMeta name={token.name} value={token.spec} />
                  <p className="type-caption mt-2 text-service-muted">{token.role}</p>
                </div>
                <div className="grid min-w-44 gap-1 rounded border border-service-border bg-service-surface p-2">
                  <code className="rounded bg-white px-2 py-1 text-xs font-semibold text-service-ink">
                    {token.typeClass}
                  </code>
                  {token.measureClass ? (
                    <code className="rounded bg-white px-2 py-1 text-xs text-service-muted">
                      {token.measureClass}
                    </code>
                  ) : null}
                  {token.wrapClass ? (
                    <code className="rounded bg-white px-2 py-1 text-xs text-service-muted">
                      {token.wrapClass}
                    </code>
                  ) : null}
                </div>
              </div>
              <p
                className={cx(
                  token.typeClass,
                  token.measureClass,
                  token.wrapClass,
                  "text-service-ink",
                )}
              >
                {token.sample}
              </p>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Measure"
        title="Text Measures"
        body="Measure tokens control readable copy width. Heading roles rely on balanced wrapping by default, with manual line breaks reserved for art-directed headlines."
      >
        <div className="grid gap-5">
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
                    <h3 className="type-heading-sm mt-4">
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

      <GuideSection
        eyebrow="Spacing"
        title="Semantic Spacing Relationships"
        body="These tokens describe why space exists: eyebrow to heading, heading to body, body to actions, and editorial text rhythm."
      >
        <div className="grid gap-8">
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {sectionSpacing.map(([name, value]) => (
              <Card className="overflow-hidden shadow-none" key={name}>
                <div className={cx(name, "bg-service-surface px-6")}>
                  <div className="fluid-type-frame rounded border border-service-border bg-white p-6">
                    <p className="type-label text-service-accent">Section sample</p>
                    <h3 className="type-heading-sm mt-4 text-service-ink">
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

          <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
            {relationshipSpacing.map((example) => (
              <Card className="p-6 shadow-none" key={example.title}>
                <div className="mb-6">
                  <h3 className="type-heading-sm text-service-ink">
                    {example.title}
                  </h3>
                  <p className="type-caption mt-2 text-service-muted">
                    {example.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {example.tokens.map(([name, value]) => (
                      <TokenMeta key={name} name={name} value={value} />
                    ))}
                  </div>
                </div>

                {example.kind === "compact" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-label text-service-accent">Maintenance</p>
                    <h4 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                      Seasonal tune-ups before the busy months
                    </h4>
                    <p className="type-text-sm measure-copy-wide wrap-pretty mt-heading-body-sm text-service-muted">
                      A compact service card should feel tight and scannable
                      without collapsing the relationship between title and copy.
                    </p>
                    <a
                      className="type-label mt-body-actions-sm inline-block text-service-accent"
                      href="#"
                    >
                      View service
                    </a>
                  </div>
                ) : null}

                {example.kind === "default" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-label text-service-accent">
                      Emergency HVAC Repair
                    </p>
                    <h4 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                      Same-day repairs when your system quits
                    </h4>
                    <p className="type-text-lg measure-copy wrap-pretty mt-heading-body-lg text-service-muted">
                      Get fast help from licensed technicians serving
                      Huntersville, Cornelius, Davidson, and North Charlotte.
                    </p>
                    <div className="mt-body-actions-md flex flex-wrap gap-3">
                      <Button href="#">Schedule Now</Button>
                      <Button href="#" variant="secondary">
                        Call Today
                      </Button>
                    </div>
                  </div>
                ) : null}

                {example.kind === "hero" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-ink p-6 text-white">
                    <p className="type-label text-white/70">Ready when you are</p>
                    <h4 className="type-display-lg mt-eyebrow-display">
                      Turn the next visit into a booked service call
                    </h4>
                    <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-white/75">
                      A display group needs more breathing room because the
                      headline scale creates a stronger visual event.
                    </p>
                    <div className="mt-body-actions-lg flex flex-wrap gap-3">
                      <Button
                        className="border-white bg-white text-service-ink hover:bg-service-surface"
                        href="#"
                        variant="secondary"
                      >
                        Start a request
                      </Button>
                    </div>
                  </div>
                ) : null}

                {example.kind === "editorial" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-text-md measure-longform wrap-pretty text-service-muted">
                      When a heating system quits on a cold morning, the customer
                      is not looking for a brand manifesto. They are trying to
                      understand whether someone can come soon.
                    </p>
                    <p className="type-text-md measure-longform wrap-pretty mt-paragraph-paragraph text-service-muted">
                      The page should answer that quickly, then make the next
                      step feel obvious without flattening the tone.
                    </p>
                    <h4 className="type-heading-lg mt-paragraph-heading-md text-service-ink">
                      Clear next steps matter more than decoration
                    </h4>
                    <p className="type-text-md measure-longform wrap-pretty mt-heading-body-md text-service-muted">
                      Editorial spacing should make the copy feel intentional
                      while still supporting a service page rhythm.
                    </p>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Gaps"
        title="Inline, Card, And Layout Gaps"
        body="Gap tokens describe the kind of layout relationship: small inline clusters, repeated cards, or major section columns."
      >
        <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
          {gapTokens.map((group) => (
            <Card className="p-6 shadow-none" key={group.group}>
              <h3 className="type-heading-sm text-service-ink">{group.group}</h3>
              <p className="type-caption mt-2 text-service-muted">
                {group.description}
              </p>

              <div className="mt-6 grid gap-5">
                {group.items.map(([name, value]) => (
                  <div key={name}>
                    <TokenMeta name={name} value={value} />

                    {group.kind === "inline" ? (
                      <div className={cx(name, "mt-4 flex flex-wrap")}>
                        <span className="radius-4 bg-service-accent px-3 py-2 text-sm font-semibold text-white">
                          Primary
                        </span>
                        <span className="radius-4 border border-service-border px-3 py-2 text-sm font-semibold text-service-ink">
                          Secondary
                        </span>
                        <span className="radius-4 border border-service-border px-3 py-2 text-sm font-semibold text-service-muted">
                          Tertiary
                        </span>
                      </div>
                    ) : null}

                    {group.kind === "card" ? (
                      <div className={cx(name, "mt-4 grid grid-cols-3")}>
                        <div className="radius-4 h-16 bg-service-surface" />
                        <div className="radius-4 h-16 bg-service-border" />
                        <div className="radius-4 h-16 bg-service-accent/20" />
                      </div>
                    ) : null}

                    {group.kind === "layout" ? (
                      <div className={cx(name, "mt-4 grid grid-cols-[1.2fr_0.8fr]")}>
                        <div className="radius-4 min-h-20 bg-service-surface p-4">
                          <p className="type-caption text-service-muted">
                            Content column
                          </p>
                        </div>
                        <div className="radius-4 min-h-20 bg-service-border p-4">
                          <p className="type-caption text-service-muted">
                            Media column
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        eyebrow="Buttons"
        title="Custom Button Styles"
        body="Reusable button treatments for stronger calls to action and brand moments."
      >
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-5 max-lg:grid-cols-1">
          <Card className="p-6 shadow-none">
            <TokenMeta
              name="expanding-arrow-cta"
              value="ink surface / accent fill / rounded pill"
            />
            <div className="mt-8">
              <ExpandingArrowButton href="#">
                Schedule service
              </ExpandingArrowButton>
            </div>
          </Card>

          <Card className="fluid-type-frame p-6 shadow-none">
            <p className="type-label text-service-accent">Interaction</p>
            <h3 className="type-heading-sm mt-4 text-service-ink">
              Accent circle expands across the ink button on hover.
            </h3>
            <p className="type-text-sm measure-copy-wide wrap-pretty mt-4 text-service-muted">
              The label starts in accent color, then reverses to ink as the
              accent fill grows. The arrow stays on the right and drifts inward
              during the hover state.
            </p>
          </Card>
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
            <h3 className="type-heading-xl mt-5 text-service-ink">
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
              <h3 className="type-heading-sm text-service-ink">
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
              <h3 className="type-heading-sm text-service-ink">
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
