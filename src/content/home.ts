export const homeIndexContent = {
  eyebrow: "Local service starter",
  title: "Project index",
  body: "Quick links for reviewing the reusable starter, section library, and development workspaces while the dev server is running.",
  groups: [
    {
      title: "Preview pages",
      links: [
        {
          label: "Sample local service",
          href: "/sample",
          description: "A complete starter page assembled from reusable sections.",
        },
        {
          label: "Sample plumbing",
          href: "/sample-plumbing",
          description: "Business-specific sample content applied to the system.",
        },
        {
          label: "Section library",
          href: "/sections",
          description: "Browse the current reusable section collection.",
        },
        {
          label: "Section library v3",
          href: "/sections-v3",
          description: "Redirects to the current section library.",
        },
      ],
    },
    {
      title: "Design tools",
      links: [
        {
          label: "Design lab",
          href: "/dev/design-lab",
          description: "Compose, swap, and review section recipes.",
        },
        {
          label: "Style guide",
          href: "/dev/style-guide",
          description: "Review shared visual tokens and section defaults.",
        },
        {
          label: "Font lab",
          href: "/dev/font-lab",
          description: "Inspect type options and hierarchy tests.",
        },
        {
          label: "Grid lab",
          href: "/dev/grid-lab",
          description: "Check layout grid behavior across viewports.",
        },
        {
          label: "Type hierarchy",
          href: "/dev/type-hierarchy-test",
          description: "Stress-test heading and body type relationships.",
        },
        {
          label: "Type test",
          href: "/dev/type-test",
          description: "Legacy typography test surface.",
        },
      ],
    },
    {
      title: "App flows",
      links: [
        {
          label: "Dashboard",
          href: "/dashboard",
          description: "Lead dashboard route for authenticated workflows.",
        },
        {
          label: "Admin",
          href: "/dev/admin",
          description: "Development admin surface.",
        },
        {
          label: "Login",
          href: "/login",
          description: "Authentication entry point.",
        },
        {
          label: "Thank you",
          href: "/thank-you",
          description: "Post-submission confirmation page.",
        },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          label: "Privacy policy",
          href: "/privacy-policy",
          description: "Reusable privacy page shell.",
        },
        {
          label: "Terms",
          href: "/terms",
          description: "Reusable terms page shell.",
        },
      ],
    },
  ],
} as const;
