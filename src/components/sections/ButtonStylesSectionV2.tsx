import { Button } from "@/components/primitives";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The three assigned button styles, side by side.
 *
 * NOT A REGISTERED SECTION. It is exported from the section index and appears
 * in no library, no pagebuilder list and no preview route - it has been a
 * standalone showcase throughout. It is kept, and repointed at the live
 * assignment, because the thing it showcased no longer exists: it used to render
 * three hard-coded treatment components, and a button's style is a Style Guide
 * assignment now rather than a component you can import.
 *
 * So it shows what the site is currently set to rather than what it could be.
 * The library itself is browsable in the Style Guide, which is where the
 * assignment is made.
 */
export function ButtonStylesSectionV2() {
  return (
    <section className="section-space-med bg-white">
      <div className="container-site">
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-5 max-lg:grid-cols-1">
          <div
            className={cx(
              "fluid-type-frame",
              "radius-medium border border-service-border bg-service-surface p-8 shadow-service max-md:p-6",
            )}
          >
            <p className="type-label text-service-accent">Button styles</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
              The assigned CTA styles
            </h2>
            <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
              The primary, the secondary and the special, exactly as the Style
              Guide currently assigns them. A section reaches the special one by
              switching Special CTA on, never by choosing a style of its own.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              { className: "", label: "Request service", name: "Primary" },
              {
                className: "",
                label: "View services",
                name: "Secondary",
                variant: "secondary" as const,
              },
              {
                /* The one place this class is written by hand. Everywhere else
                   the special arrives through the section frame's attribute. */
                className: "button-cta-special",
                label: "Schedule service",
                name: "Special",
              },
            ].map((specimen) => (
              <div
                className={cx(
                  "radius-medium",
                  "flex min-h-56 flex-col items-center justify-center gap-4 border border-service-border bg-white p-8 shadow-service max-md:min-h-48 max-md:p-6",
                )}
                key={specimen.name}
              >
                <p className="type-label text-service-muted">{specimen.name}</p>
                <Button
                  className={specimen.className}
                  href="#"
                  variant={specimen.variant ?? "primary"}
                >
                  {specimen.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
