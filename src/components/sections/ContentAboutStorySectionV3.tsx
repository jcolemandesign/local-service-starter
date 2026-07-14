import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type AboutStoryNote = {
  label: string;
  body: string;
};

type ContentAboutStorySectionV3Props = {
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs: readonly string[];
  pullquote: string;
  notes: readonly AboutStoryNote[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentAboutStorySectionV3({
  eyebrow,
  title,
  intro,
  paragraphs,
  pullquote,
  notes,
}: ContentAboutStorySectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        className="section-min-medium items-start"
        gap="lrg"
        padding="lrg"
      >
        <SevenColumnGridItem
          className="col-span-2 max-lg:col-span-5 max-md:col-span-3"
          alignY="top"
        >
          <aside className="sticky top-[var(--site-grid-inset-block)] max-lg:static">
            <div className="fluid-type-frame border-t border-service-ink pt-5">
              <p className="type-label text-service-accent">{eyebrow}</p>
              <p className="type-display-lg mt-eyebrow-display text-service-ink">
                01
              </p>
              <p className="type-caption mt-heading-body-lg text-service-muted">
                Local perspective, practical recommendations, and a calmer path
                through expensive home service decisions.
              </p>
            </div>
          </aside>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-3 col-start-3 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3"
          alignY="top"
        >
          <article className="fluid-type-frame">
            <h2 className="type-heading-xl text-service-ink">{title}</h2>
            <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
              {intro}
            </p>

            <div className="mt-16 grid gap-9 max-md:mt-10">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={cx(
                    index === 0 ? "type-text-lg" : "type-text-md",
                    "measure-copy-wide wrap-pretty text-service-ink",
                  )}
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-2 col-start-6 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3"
          alignY="top"
        >
          <aside className="grid card-grid-gap-lrg">
            <blockquote className="fluid-type-frame border-y border-service-border py-7">
              <p className="type-heading-md wrap-pretty text-service-ink">
                {pullquote}
              </p>
            </blockquote>

            <div className="grid divide-y divide-service-border border-y border-service-border">
              {notes.map((note) => (
                <div className="fluid-type-frame py-6" key={note.label}>
                  <p className="type-label text-service-accent">
                    {note.label}
                  </p>
                  <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                    {note.body}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
