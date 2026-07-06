import type {
  StagedPage,
  StagedPageField,
  StagedPageTemplateSection,
} from "@/utils/staged-pages";

type StagedPageCanvasProps = {
  page: StagedPage;
};

type RenderSection = {
  fields: StagedPageField[];
  id: string;
  instruction: string;
  mode: string;
  name: string;
};

export function StagedPageCanvas({ page }: StagedPageCanvasProps) {
  const sections = getRenderSections(page);

  return (
    <div className="overflow-hidden rounded-sm border border-service-border bg-white shadow-service">
      <div className="border-b border-service-border bg-service-surface px-4 py-3">
        <p className="type-label text-service-accent">Visual Staged Preview</p>
        <p className="type-caption mt-1 text-service-muted">
          {page.template?.name ?? page.sourceStage} / {page.pageLabel}
        </p>
      </div>
      <div className="bg-white">
        {sections.map((section) => (
          <PreviewSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function PreviewSection({ section }: { section: RenderSection }) {
  const mode = section.mode.toLowerCase();
  const lookup = `${mode} ${section.name}`.toLowerCase();

  if (lookup.includes("navigation") || lookup.includes("nav")) {
    return <NavigationPreview section={section} />;
  }

  if (lookup.includes("hero")) {
    return <HeroPreview section={section} />;
  }

  if (mode === "scan" || lookup.includes("service")) {
    return <ServicesPreview section={section} />;
  }

  if (mode === "proof" || lookup.includes("trust") || lookup.includes("testimonial")) {
    return <ProofPreview section={section} />;
  }

  if (mode === "action" || lookup.includes("cta")) {
    return <ActionPreview section={section} />;
  }

  if (lookup.includes("footer")) {
    return <FooterPreview section={section} />;
  }

  return <GenericPreview section={section} />;
}

function NavigationPreview({ section }: { section: RenderSection }) {
  const links = splitItems(getValue(section, "navLinks", "Services, About, Reviews, Contact"));

  return (
    <section className="border-b border-service-border bg-white px-8 py-5 max-md:px-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 max-md:flex-col max-md:items-start">
        <div className="rounded-sm border border-service-border bg-service-surface px-4 py-2 text-sm font-bold uppercase tracking-normal text-service-ink">
          {getValue(section, "logoLabel", "Logo")}
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-service-ink">
          {links.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-sm border border-service-border px-4 py-2 text-sm font-semibold text-service-ink">
            {getValue(section, "phone", "Phone")}
          </span>
          <span className="rounded-sm bg-service-accent px-4 py-2 text-sm font-semibold text-white">
            {getValue(section, "primaryAction", "Request service")}
          </span>
        </div>
      </div>
    </section>
  );
}

function HeroPreview({ section }: { section: RenderSection }) {
  return (
    <section className="grid min-h-[520px] grid-cols-2 bg-white max-lg:grid-cols-1">
      <div className="flex items-center px-12 py-16 max-md:px-6">
        <div className="max-w-2xl">
          <p className="type-label text-service-accent">
            {getValue(section, "eyebrow", "Local service")}
          </p>
          <h2 className="mt-4 text-5xl font-semibold leading-[1.02] text-service-ink max-md:text-4xl">
            {getValue(section, "h1", getValue(section, "heading", "Page headline goes here"))}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-service-muted">
            {getValue(section, "intro", getValue(section, "body", "Reviewed page copy will appear here after you save it in Content Editor."))}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-sm bg-service-accent px-5 py-3 text-sm font-semibold text-white">
              {getValue(section, "primaryAction", "Request service")}
            </span>
            <span className="rounded-sm border border-service-border px-5 py-3 text-sm font-semibold text-service-ink">
              {getValue(section, "secondaryAction", "View services")}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {splitItems(getValue(section, "proofPoints", "Clear estimates, Local service, Helpful guidance")).map((item) => (
              <span
                className="rounded-sm border border-service-border bg-service-surface px-3 py-2 type-caption text-service-muted"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="min-h-[420px] bg-[linear-gradient(135deg,#f4eee8_0%,#fff_45%,#e9f3ef_100%)] max-lg:min-h-[280px]" />
    </section>
  );
}

function ServicesPreview({ section }: { section: RenderSection }) {
  const items = splitItems(getValue(section, "serviceItems", getValue(section, "items", "Service one\nService two\nService three")));

  return (
    <section className="bg-service-surface px-12 py-16 max-md:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="type-label text-service-accent">
          {getValue(section, "eyebrow", section.mode)}
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold text-service-ink">
          {getValue(section, "heading", section.name)}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-service-muted">
          {getValue(section, "intro", section.instruction)}
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          {items.slice(0, 6).map((item, index) => (
            <div className="rounded-sm border border-service-border bg-white p-5" key={`${item}-${index}`}>
              <p className="text-lg font-semibold text-service-ink">{item}</p>
              <p className="mt-3 type-text-sm text-service-muted">
                Add reviewed supporting copy in Content Editor.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofPreview({ section }: { section: RenderSection }) {
  const items = splitItems(getValue(section, "proofItems", getValue(section, "testimonials", "Trusted local service\nClear communication\nRespectful work")));

  return (
    <section className="bg-white px-12 py-12 max-md:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-service-ink">
          {getValue(section, "heading", section.name)}
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {items.slice(0, 6).map((item, index) => (
            <div className="rounded-sm border border-service-border bg-service-surface p-4" key={`${item}-${index}`}>
              <p className="type-text-sm font-semibold text-service-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionPreview({ section }: { section: RenderSection }) {
  return (
    <section className="bg-service-ink px-12 py-16 text-white max-md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 max-lg:flex-col max-lg:items-start">
        <div>
          <h2 className="max-w-3xl text-4xl font-semibold">
            {getValue(section, "heading", section.name)}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            {getValue(section, "body", section.instruction)}
          </p>
        </div>
        <span className="rounded-sm bg-service-accent px-5 py-3 text-sm font-semibold text-white">
          {getValue(section, "primaryAction", "Request service")}
        </span>
      </div>
    </section>
  );
}

function FooterPreview({ section }: { section: RenderSection }) {
  return (
    <footer className="bg-service-ink px-12 py-10 text-white max-md:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] gap-8 max-md:grid-cols-1">
        <div>
          <p className="text-lg font-semibold">{getValue(section, "businessSummary", "Business footer summary")}</p>
          <p className="mt-3 max-w-2xl type-text-sm text-white/70">
            {getValue(section, "contactDetails", "Contact details")}
          </p>
        </div>
        <p className="type-caption text-white/60">
          {getValue(section, "legalLine", "Copyright")}
        </p>
      </div>
    </footer>
  );
}

function GenericPreview({ section }: { section: RenderSection }) {
  const body = getValue(section, "body", getValue(section, "intro", section.instruction));

  return (
    <section className="border-t border-service-border bg-white px-12 py-14 max-md:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="type-label text-service-accent">{section.mode}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-service-ink">
          {getValue(section, "heading", section.name)}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-service-muted">
          {body}
        </p>
      </div>
    </section>
  );
}

function getRenderSections(page: StagedPage): RenderSection[] {
  const fieldsBySection = page.fields
    .filter((field) => !field.path.startsWith("strategy."))
    .reduce<Record<string, StagedPageField[]>>((sections, field) => {
      const sectionId = field.path.split(".")[0] || "section";

      return {
        ...sections,
        [sectionId]: [...(sections[sectionId] ?? []), field],
      };
    }, {});
  const templateSections = page.template?.sections ?? [];

  if (templateSections.length > 0) {
    return templateSections.map((section, index) => {
      const sectionId = getSectionId(section, index);

      return {
        fields: fieldsBySection[sectionId] ?? [],
        id: sectionId,
        instruction: section.instruction,
        mode: section.mode,
        name: section.name,
      };
    });
  }

  return Object.entries(fieldsBySection).map(([sectionId, fields]) => ({
    fields,
    id: sectionId,
    instruction:
      fields.find((field) => field.path.endsWith(".contentDirection"))?.value ?? "",
    mode: "Section",
    name: humanize(sectionId),
  }));
}

function getSectionId(section: StagedPageTemplateSection, index: number) {
  return `${String(index + 1).padStart(2, "0")}-${slugify(
    section.name || section.component,
  )}`;
}

function getValue(section: RenderSection, fieldName: string, fallback: string) {
  return (
    section.fields.find((field) => field.path.endsWith(`.${fieldName}`))?.value.trim() ||
    fallback
  );
}

function splitItems(value: string) {
  return value
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
