type GridTile = {
  body: string;
  className: string;
  label: string;
  tone?: "accent" | "dark" | "light" | "surface";
};

const naturalFlowTiles: GridTile[] = [
  {
    label: "A / span 3",
    body: "Short content in a wider item.",
    className: "col-span-3 max-lg:col-span-2 max-md:col-span-2 max-sm:col-span-1",
    tone: "dark",
  },
  {
    label: "B / span 2",
    body: "A compact block follows source order.",
    className: "col-span-2 max-md:col-span-1",
    tone: "surface",
  },
  {
    label: "C / span 2",
    body: "Same row when enough columns remain.",
    className: "col-span-2 max-md:col-span-1",
    tone: "accent",
  },
  {
    label: "D / span 4",
    body: "This item is deliberately wider. When the row cannot fit it, the browser starts a new row and leaves the natural gap behind.",
    className: "col-span-4 max-lg:col-span-4 max-md:col-span-2 max-sm:col-span-1",
    tone: "light",
  },
  {
    label: "E / span 1",
    body: "Narrow.",
    className: "col-span-1",
    tone: "surface",
  },
  {
    label: "F / span 2",
    body: "Medium item with a little more body copy to force row height.",
    className: "col-span-2 max-md:col-span-1",
    tone: "light",
  },
  {
    label: "G / span 3",
    body: "Another larger tile later in the source order.",
    className: "col-span-3 max-lg:col-span-2 max-md:col-span-2 max-sm:col-span-1",
    tone: "accent",
  },
];

const denseFlowTiles: GridTile[] = [
  {
    label: "A / 4 x 2",
    body: "Large feature card. Dense flow lets later small cards backfill earlier holes around it.",
    className:
      "col-span-4 row-span-2 min-h-72 max-lg:col-span-4 max-md:col-span-2 max-sm:col-span-1",
    tone: "dark",
  },
  {
    label: "B / span 2",
    body: "Medium.",
    className: "col-span-2 min-h-32 max-md:col-span-1",
    tone: "surface",
  },
  {
    label: "C / span 1",
    body: "Small.",
    className: "col-span-1 min-h-32",
    tone: "accent",
  },
  {
    label: "D / span 3",
    body: "This may wrap depending on available track space.",
    className: "col-span-3 min-h-40 max-lg:col-span-2 max-md:col-span-2 max-sm:col-span-1",
    tone: "light",
  },
  {
    label: "E / span 1",
    body: "Backfill candidate.",
    className: "col-span-1 min-h-32",
    tone: "surface",
  },
  {
    label: "F / span 2",
    body: "Another medium tile.",
    className: "col-span-2 min-h-40 max-md:col-span-1",
    tone: "light",
  },
  {
    label: "G / span 1",
    body: "Small.",
    className: "col-span-1 min-h-32",
    tone: "accent",
  },
  {
    label: "H / span 3",
    body: "A later wide item after several smaller ones.",
    className: "col-span-3 min-h-48 max-lg:col-span-2 max-md:col-span-2 max-sm:col-span-1",
    tone: "surface",
  },
];

const explicitRowTiles: GridTile[] = [
  {
    label: "Hero / col 1-5 / row 1-3",
    body: "Pinned to named grid coordinates with enough text to reveal how row height responds.",
    className:
      "col-start-1 col-end-5 row-start-1 row-end-3 min-h-72 max-lg:col-span-4 max-lg:col-start-auto max-lg:col-end-auto max-lg:row-auto max-md:col-span-2 max-sm:col-span-1",
    tone: "dark",
  },
  {
    label: "Aside / col 5-8",
    body: "Right rail occupies the remaining three columns.",
    className:
      "col-start-5 col-end-8 row-start-1 row-end-2 min-h-32 max-lg:col-span-2 max-lg:col-start-auto max-lg:col-end-auto max-lg:row-auto max-md:col-span-2 max-sm:col-span-1",
    tone: "accent",
  },
  {
    label: "Aside / second row",
    body: "Same rail, next explicit row.",
    className:
      "col-start-5 col-end-8 row-start-2 row-end-3 min-h-32 max-lg:col-span-2 max-lg:col-start-auto max-lg:col-end-auto max-lg:row-auto max-md:col-span-2 max-sm:col-span-1",
    tone: "surface",
  },
  {
    label: "Footer band / all 7",
    body: "Full-width band after the composed top area.",
    className:
      "col-span-7 row-start-3 min-h-36 max-lg:col-span-4 max-lg:row-auto max-md:col-span-2 max-sm:col-span-1",
    tone: "light",
  },
];

const collapseTiles: GridTile[] = [
  {
    label: "Lead / 3",
    body: "Three columns on desktop, two on tablet, full on mobile.",
    className: "col-span-3 max-lg:col-span-2 max-sm:col-span-1",
    tone: "dark",
  },
  {
    label: "Pair / 2",
    body: "Keeps a paired width until the grid collapses.",
    className: "col-span-2 max-lg:col-span-2 max-md:col-span-1",
    tone: "surface",
  },
  {
    label: "Pair / 2",
    body: "Pairs with the previous item on the 7-column row.",
    className: "col-span-2 max-lg:col-span-2 max-md:col-span-1",
    tone: "accent",
  },
  {
    label: "Wide note / 5",
    body: "A five-column block becomes a full four-column row at tablet width, then a full two-column row before stacking.",
    className: "col-span-5 max-lg:col-span-4 max-md:col-span-2 max-sm:col-span-1",
    tone: "light",
  },
  {
    label: "Small / 1",
    body: "Small object.",
    className: "col-span-1",
    tone: "surface",
  },
  {
    label: "Small / 1",
    body: "Small object.",
    className: "col-span-1",
    tone: "accent",
  },
];

const toneClasses = {
  accent: "border-service-accent bg-service-accent text-white",
  dark: "border-service-ink bg-service-ink text-white",
  light: "border-service-border bg-white text-service-ink",
  surface: "border-service-border bg-service-surface text-service-ink",
};

function GridLabTile({ body, className, label, tone = "light" }: GridTile) {
  const isDark = tone === "accent" || tone === "dark";

  return (
    <article
      className={`${className} radius-medium grid content-between gap-8 border p-5 shadow-service ${toneClasses[tone]}`}
    >
      <div>
        <p
          className={`type-caption font-semibold ${
            isDark ? "text-white/62" : "text-service-muted"
          }`}
        >
          {label}
        </p>
        <div
          aria-hidden="true"
          className={`mt-4 h-16 radius-4 border ${
            isDark
              ? "border-white/18 bg-white/10"
              : "border-service-border bg-white/70"
          }`}
        />
      </div>
      <p
        className={`type-text-sm wrap-pretty ${
          isDark ? "text-white/74" : "text-service-muted"
        }`}
      >
        {body}
      </p>
    </article>
  );
}

function GridExperiment({
  body,
  children,
  title,
}: {
  body: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="section-space-sml border-t border-service-border bg-white">
      <div className="container-site">
        <div className="fluid-type-frame mb-8 grid grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)] gap-6 max-lg:grid-cols-1">
          <h2 className="type-heading-lg text-service-ink">{title}</h2>
          <p className="type-text-sm measure-copy-wide wrap-pretty text-service-muted">
            {body}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function GridLabSection() {
  return (
    <>
      <section className="section-space-med bg-service-ink text-white">
        <div className="container-site fluid-type-frame">
          <p className="type-label text-white/62">Internal layout lab</p>
          <h1 className="type-display-lg mt-eyebrow-display">
            Seven-column grid flow tests
          </h1>
          <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-white/72">
            Scratch layouts for watching different object sizes, row behavior,
            placement rules, and responsive column collapse inside one section
            system.
          </p>
        </div>
      </section>

      <GridExperiment
        title="Natural auto-placement"
        body="A seven-column grid using source order and variable column spans. Items wrap when their span cannot fit the remaining tracks."
      >
        <div className="grid grid-cols-7 gap-4 max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {naturalFlowTiles.map((tile) => (
            <GridLabTile key={tile.label} {...tile} />
          ))}
        </div>
      </GridExperiment>

      <GridExperiment
        title="Dense packing"
        body="The same seven-column idea with grid-flow-dense. Later small items can fill holes left by larger spans."
      >
        <div className="grid grid-flow-dense grid-cols-7 auto-rows-[minmax(8rem,auto)] gap-4 max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {denseFlowTiles.map((tile) => (
            <GridLabTile key={tile.label} {...tile} />
          ))}
        </div>
      </GridExperiment>

      <GridExperiment
        title="Explicit rows and coordinates"
        body="Tracks are defined up front, then large blocks are pinned by row and column. Below tablet, placement falls back to normal flow."
      >
        <div className="grid grid-cols-7 grid-rows-[minmax(8rem,auto)_minmax(8rem,auto)_minmax(9rem,auto)] gap-4 max-lg:grid-cols-4 max-lg:grid-rows-none max-md:grid-cols-2 max-sm:grid-cols-1">
          {explicitRowTiles.map((tile) => (
            <GridLabTile key={tile.label} {...tile} />
          ))}
        </div>
      </GridExperiment>

      <GridExperiment
        title="Column collapse"
        body="Desktop begins at seven columns, then compresses to four, two, and one. Different span rules determine whether content pairs, fills, or stacks."
      >
        <div className="grid grid-cols-7 gap-4 max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
          {collapseTiles.map((tile) => (
            <GridLabTile key={tile.label} {...tile} />
          ))}
        </div>
      </GridExperiment>
    </>
  );
}
