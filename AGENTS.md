# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project Rules

This project is a reusable local service business starter built with Next.js, React, Tailwind, and Supabase.

The goal is to create a modular, reusable, visually polished system for local service business websites while keeping architecture, spacing, typography, motion, and responsiveness consistent across projects.

---

## Architecture

Every major page section is a standalone component in `src/components/sections/`.

Page files should compose imported section components. Do not leave large raw section markup directly inside `app/**/page.tsx`.

Sections should use shared primitives for heading, subheading, body copy, containers, cards, buttons, and layout structure.

Use existing shared primitives, design tokens, and layout patterns before creating new ones.

Do not invent local type styles, spacing systems, component patterns, or one-off layout logic inside sections unless specifically requested or clearly required by the prompt.

If a new reusable primitive, token, or pattern appears necessary, propose it first and explain why it belongs in the system before creating it.

Spacing inside sections should follow the shared `Section` primitive and spacing conventions — not arbitrary padding values.

Business-specific content should live in `src/content/` so component shells stay clean, reusable, and portable.

### File structure

```txt
src/components/sections/    # Major page sections: HeroSection, FAQSection, ServicesSection, etc.
src/components/primitives/  # Shared building blocks: Section, Container, SectionHeading, Button, Card
src/content/                # Business-specific data: site.ts, services.ts, faqs.ts, testimonials.ts
```

---

## Design System

Before building a new section, read existing sections, shared primitives, and `tailwind.config.ts`. Match the existing system. Flag anything new rather than inventing it.

After any session where new reusable visual values are settled on — colors, type sizes, spacing, shadows, radii — update the shared design tokens or `tailwind.config.ts` with semantic names before the next session. The shared tokens/config are the living style guide.

Use existing design tokens before creating new ones.

Tokens should be design-facing and easy to reference while building.

Prefer token names like:

```txt
type-hero
type-section-title
type-body
type-pullquote
bg-1
bg-2
bg-3
bg-dark
text-main
text-muted
text-accent
```

Avoid vague, overly abstract, or overly section-specific token names unless they are already part of the system.

If a new reusable token appears necessary, propose the name and purpose before adding it.

Avoid arbitrary one-off values like:

```txt
py-[73px]
mt-[91px]
text-[43px]
```

unless matching a specific approved design detail.

Typography should scale smoothly where appropriate using responsive values or `clamp()`, rather than abrupt jumps between many fixed sizes.

---

## Agent Skill Docs

For task-specific workflows, reference files in `.agents/skills/`.

- Intake analysis → `.agents/skills/intake-to-website-content-map.md`
---

## Motion / Animation Rules

Use CSS/Tailwind transitions for simple hover, color, opacity, and transform effects.

Use Motion for React only when component state, mount/unmount transitions, carousel movement, modal/menu transitions, or coordinated animations require it.

Keep animations subtle, fast, and functional. Avoid decorative over-animation.

Prefer opacity, transform, and clip-path style animations. Avoid layout-thrashing animations.

Respect reduced motion preferences where practical.

Do not make an entire page a client component just for animation. Keep `"use client"` boundaries as small as possible.

If Motion for React is not already installed, explain why it is needed and wait for approval before adding it.

---

## Layout Width Philosophy

The default max content width is `1440px`.

Most sections should use the shared `Container` primitive to align primary content to the 1440px layout system.

Sections may become full-screen or full-bleed only when specifically described that way in the task or section brief.

Full-bleed sections require intentional layout handling:

- backgrounds, images, color fields, and decorative elements may extend edge-to-edge
- readable text should still maintain comfortable line lengths
- inner content should still align to the overall site grid unless intentionally breaking it
- avoid stretching forms, cards, buttons, or body copy endlessly across the viewport
- use responsive/fluid spacing so full-bleed layouts still work cleanly on tablet and mobile

Do not place every section inside a narrow centered content box by default. Use constrained inner containers only where readability or composition requires it.

---

## Responsive Approach

This project is desktop-first.

Write unprefixed Tailwind classes as the desktop baseline.

Use:

```txt
max-lg:
max-md:
max-sm:
```

to adapt downward for tablet and mobile while preserving hierarchy, spacing rhythm, and readability.

Do not use the standard mobile-first pattern of unprefixed base classes scaled upward with `md:` / `lg:` unless specifically requested.

Use responsive simplification rather than redesign:

- desktop establishes the full composition
- tablet reduces density
- mobile stacks and simplifies layouts while preserving hierarchy

Avoid brittle fixed heights. Prefer `min-height` for hero sections and allow content to define section height unless a specific fixed-height design is requested.

---

## Breakpoints

Use only Tailwind’s default breakpoint system.

| Prefix     | Viewport      |
| ---------- | ------------- |
| `max-sm:`  | below 640px   |
| `max-md:`  | below 768px   |
| `max-lg:`  | below 1024px  |
| `max-xl:`  | below 1280px  |
| `max-2xl:` | below 1536px  |

Do not add custom breakpoints to `tailwind.config.ts`.

Do not use arbitrary viewport values like:

```txt
min-[1117px]:
max-[983px]:
```

unless specifically requested.

---

## Semantic HTML

- Keep one `<main>` in the page file.
- Major page sections should usually render a `<section>`.
- Use only one `<h1>` per page.
- Preserve heading hierarchy — do not choose heading levels based only on visual size.
- Keep `<nav>`, `<footer>`, `<form>`, `<ul>`, and `<ol>` where semantically appropriate.
- Do not replace semantic elements with generic `<div>` unless the div is layout-only.

---

## Constraints

Do not redesign, rewrite copy, change Supabase logic, change form logic, or add new dependencies unless specifically requested.

If a requested feature genuinely requires a new dependency:

- explain why the dependency is needed
- provide the package name
- wait for approval before installing it