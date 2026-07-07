import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev Admin",
  description: "Internal links for previewing local starter pages.",
};

const linkGroups = [
  {
    title: "Pages",
    links: [
      { label: "Home", href: "/" },
    ],
  },
  {
    title: "Dev",
    links: [
      { label: "Section Library", href: "/sections" },
      { label: "Style Guide", href: "/dev/style-guide" },
      { label: "Pagebuilder", href: "/dev/pagebuilder" },
      { label: "Template Library", href: "/dev/templates" },
      { label: "Prompt Library", href: "/dev/prompt-library" },
      { label: "Client Strategy", href: "/strategy" },
      { label: "Workspace Archive", href: "/dev/projects" },
    ],
  },
  {
    title: "Admin",
    links: [
      { label: "My Dashboard", href: "/dev/dashboard" },
      { label: "Client Intake", href: "/client-intake" },
    ],
  },
  {
    title: "App",
    links: [
      { label: "Login", href: "/login" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Thank You", href: "/thank-you" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function DevAdminPage() {
  return (
    <main className="min-h-svh bg-service-surface text-service-ink">
      <section className="section-space-med">
        <div className="container-site">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Dev admin</p>
            <h1 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              Local preview links
            </h1>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              Open common project routes in a separate tab while working through
              layouts, style tests, and page previews.
            </p>
          </div>

          <div className="mt-body-actions-lg grid grid-cols-4 card-grid-gap-med max-lg:grid-cols-2 max-md:grid-cols-1">
            {linkGroups.map((group) => (
              <section
                className="radius-medium border border-service-border bg-white p-5 shadow-service"
                key={group.title}
              >
                <h2 className="type-heading-sm text-service-ink">
                  {group.title}
                </h2>
                <ul className="mt-5 grid gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        className="radius-4 flex min-h-12 items-center justify-between gap-4 border border-service-border px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                        href={link.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span>{link.label}</span>
                        <span aria-hidden="true">-&gt;</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
