import {
  getPathFromSlugForPageType,
  getPageTypeRelationshipLabel,
  isRepeatablePageType,
} from "@/utils/strategy-site-map";

export type TemplateCopyContractSection = {
  component: string;
  instruction?: string;
  mode: string;
  name: string;
  variant?: string;
};

export type TemplateCopyContractTemplate = {
  id: string;
  name: string;
  pageType: string;
  sectionCount: number;
  sections: TemplateCopyContractSection[];
};

export type TemplateCopyContractStrategySnapshot = {
  clientSlug: string;
  id: string;
  pageCount: number;
  version: number;
};

type BuildTemplateCopyContractInput = {
  pageLabel: string;
  pageSlug: string;
  strategySnapshot?: TemplateCopyContractStrategySnapshot;
  template: TemplateCopyContractTemplate;
};

export type TemplateCopyFieldSpec = {
  name: string;
  purpose: string;
  target: string;
};

const fallbackFields: TemplateCopyFieldSpec[] = [
  {
    name: "eyebrow",
    purpose: "Short context label if the section design uses one.",
    target: "2-7 words.",
  },
  {
    name: "heading",
    purpose: "Primary section headline.",
    target: "5-12 words.",
  },
  {
    name: "body",
    purpose: "Supporting explanation for this section.",
    target: "1 short paragraph.",
  },
  {
    name: "items",
    purpose: "Cards, bullets, steps, or repeated entries required by the section.",
    target: "Match the visible dummy content count when possible.",
  },
];

export function buildTemplateCopyContract({
  pageLabel,
  pageSlug,
  strategySnapshot,
  template,
}: BuildTemplateCopyContractInput) {
  const publicPath = getPathFromSlugForPageType(pageSlug, template.pageType);
  const isRepeatable = isRepeatablePageType(template.pageType);
  const relationshipLabel = getPageTypeRelationshipLabel(template.pageType);
  const lines = [
    "# Template Copy Contract",
    "",
    "Use this contract with the template-fitted page copy prompt. Write copy for this exact staged page instance and preserve the section IDs, field names, and order.",
    "",
    "## Page Target",
    `Page label: ${pageLabel}`,
    `Route slug: ${pageSlug || "(not set)"}`,
    `Public path: ${publicPath}`,
    `Selected template: ${template.name}`,
    `Template ID: ${template.id}`,
    `Page type: ${template.pageType}`,
    `Page relationship: ${relationshipLabel}`,
  ];

  if (isRepeatable) {
    lines.push(
      "",
      "Repeatable page instruction:",
      "- This contract is for one specific staged child page instance.",
      "- Write copy only for the page label and public path above.",
      "- Do not write a generic overview page unless the public path is the overview route.",
    );

    if (normalizePageType(template.pageType) === "individualservice") {
      lines.push(
        "- Treat this as one specific service page. Do not write copy for all services.",
      );
    }

    if (normalizePageType(template.pageType) === "servicearea") {
      lines.push(
        "- Treat this as one specific location/service-area page. Do not write copy for every location unless this is the /service-area overview.",
      );
    }
  }

  if (strategySnapshot) {
    lines.push(
      `Strategy snapshot: ${strategySnapshot.id}`,
      `Client slug: ${strategySnapshot.clientSlug}`,
      `Snapshot version: ${strategySnapshot.version}`,
      `Detected pages: ${strategySnapshot.pageCount}`,
    );
  }

  lines.push(
    "",
    "## Prompt Inputs To Pair With This",
    "- Strategy Digest",
    "- Page-specific plan from the sitemap/page plan prompt",
    "- Global Claim Guardrails",
    "- Manual editor notes, if any",
    "- This Template Copy Contract",
    "",
    "## Output Rules",
    "- Do not add new sections.",
    "- Do not skip sections unless the section is clearly decorative or global chrome.",
    "- Write for the exact Page Target above, not for a broader page type.",
    "- Keep copy sized to the listed field targets.",
    "- Use cautious wording for unsupported claims.",
    "- For gridded card sections with mixed card sizes, mark larger cards in repeatable card fields with [large] or [featured] before the title. Example: [large] System Replacement — Compare repair and replacement options.",
    "- If a field cannot be written from the provided source material, write NEEDS REVIEW with the missing detail.",
    "- Return structured text by section ID, not prose paragraphs about the page.",
    "",
    "## Sections",
  );

  template.sections.forEach((section, index) => {
    const sectionId = `${String(index + 1).padStart(2, "0")}-${slugify(section.name || section.mode || section.component)}`;
    const fields = getTemplateCopyFieldsForSection(section);

    lines.push(
      "",
      `### ${sectionId}`,
      `Section name: ${section.name}`,
      `Semantic role: ${section.mode}`,
      `Component: ${section.component}`,
    );

    if (section.variant) {
      lines.push(`Variant: ${section.variant}`);
    }

    if (section.instruction) {
      lines.push(`Template intent: ${section.instruction}`);
    }

    lines.push("", "Fields:");

    fields.forEach((field) => {
      lines.push(
        `- ${field.name}`,
        `  Purpose: ${field.purpose}`,
        `  Target: ${field.target}`,
      );
    });
  });

  return lines.join("\n");
}

export function getTemplateCopyFieldsForSection(
  section: TemplateCopyContractSection,
) {
  const component = section.component.toLowerCase();
  const mode = section.mode.toLowerCase();
  const sectionName = section.name.toLowerCase();
  const lookupValue = `${component} ${mode} ${sectionName}`;

  if (lookupValue.includes("nav")) {
    return [
      {
        name: "logoLabel",
        purpose: "Business name or compact logo text.",
        target: "1 business name.",
      },
      {
        name: "navLinks",
        purpose: "Primary navigation labels and destination intent.",
        target: "4-7 concise labels.",
      },
      {
        name: "phone",
        purpose: "Primary call path if available.",
        target: "Use exact sourced number or NEEDS REVIEW.",
      },
      {
        name: "primaryAction",
        purpose: "Main header CTA.",
        target: "2-4 words.",
      },
    ];
  }

  if (lookupValue.includes("footer")) {
    return [
      {
        name: "businessSummary",
        purpose: "Short footer positioning or service summary.",
        target: "1 sentence.",
      },
      {
        name: "footerLinks",
        purpose: "Useful footer navigation groups or labels.",
        target: "Match site pages and key service paths.",
      },
      {
        name: "contactDetails",
        purpose: "Phone, email, address, hours, or service area details.",
        target: "Use sourced facts only.",
      },
      {
        name: "legalLine",
        purpose: "Copyright or small footer note.",
        target: "1 short line.",
      },
    ];
  }

  if (lookupValue.includes("hero")) {
    return [
      {
        name: "eyebrow",
        purpose: "Immediate local/service context above the H1.",
        target: "4-10 words.",
      },
      {
        name: "h1",
        purpose: "Main page headline.",
        target: "7-14 words. One H1 only.",
      },
      {
        name: "intro",
        purpose: "Above-the-fold value proposition.",
        target: "1 tight paragraph, 35-70 words.",
      },
      {
        name: "primaryAction",
        purpose: "Main conversion CTA.",
        target: "2-5 words.",
      },
      {
        name: "secondaryAction",
        purpose: "Secondary path for visitors who need context.",
        target: "2-5 words.",
      },
      {
        name: "proofPoints",
        purpose: "Stats, trust points, or short supporting claims if the layout uses them.",
        target: "2-4 items. Use sourced facts only.",
      },
    ];
  }

  if (lookupValue.includes("service") || mode === "scan") {
    return [
      {
        name: "eyebrow",
        purpose: "Short category label.",
        target: "2-6 words.",
      },
      {
        name: "heading",
        purpose: "Services section headline.",
        target: "5-11 words.",
      },
      {
        name: "intro",
        purpose: "Brief explanation of the service set.",
        target: "20-45 words.",
      },
      {
        name: "serviceItems",
        purpose: "Repeated service cards or bullets.",
        target:
          sectionName.includes("service card grid")
            ? "Match dummy item count. Use Title — Description. Prefix the larger card with [large] or [featured]; the marker controls layout and should not be visible copy."
            : "Match dummy item count. Each item needs title plus 1-2 sentence description.",
      },
      {
        name: "sectionAction",
        purpose: "CTA for the service group if the layout uses one.",
        target: "2-5 words.",
      },
    ];
  }

  if (lookupValue.includes("testimonials") || lookupValue.includes("review")) {
    return [
      {
        name: "heading",
        purpose: "Proof section headline.",
        target: "5-10 words.",
      },
      {
        name: "intro",
        purpose: "Short setup for customer proof.",
        target: "15-35 words.",
      },
      {
        name: "testimonials",
        purpose: "Visible testimonials or review-style entries.",
        target: "Use only testimonials visible in approved sources. Do not invent reviews.",
      },
    ];
  }

  if (mode === "proof" || lookupValue.includes("trust")) {
    return [
      {
        name: "heading",
        purpose: "Trust or credibility headline if the layout has one.",
        target: "4-10 words.",
      },
      {
        name: "proofItems",
        purpose: "Short trust claims, stats, badges, or credibility points.",
        target: "3-6 short items. Use sourced facts only.",
      },
    ];
  }

  if (mode === "action" || lookupValue.includes("cta")) {
    return [
      {
        name: "heading",
        purpose: "Conversion-focused CTA headline.",
        target: "5-10 words.",
      },
      {
        name: "body",
        purpose: "Short support copy for the action.",
        target: "20-45 words.",
      },
      {
        name: "primaryAction",
        purpose: "Primary CTA label.",
        target: "2-5 words.",
      },
      {
        name: "secondaryAction",
        purpose: "Optional secondary CTA label.",
        target: "2-5 words if needed.",
      },
    ];
  }

  if (lookupValue.includes("faq")) {
    return [
      {
        name: "heading",
        purpose: "FAQ section headline.",
        target: "4-9 words.",
      },
      {
        name: "faqs",
        purpose: "Questions and direct answers.",
        target: "4-8 FAQs. Answers should be 25-60 words.",
      },
    ];
  }

  if (lookupValue.includes("process") || mode === "decision") {
    return [
      {
        name: "heading",
        purpose: "Decision/process headline.",
        target: "5-11 words.",
      },
      {
        name: "intro",
        purpose: "Short explanation of how to decide or what happens next.",
        target: "20-45 words.",
      },
      {
        name: "steps",
        purpose: "Ordered steps, criteria, or comparison points.",
        target: "3-5 items. Each item needs title plus 1-2 sentences.",
      },
    ];
  }

  if (mode === "utility" || lookupValue.includes("contact")) {
    return [
      {
        name: "heading",
        purpose: "Utility section headline.",
        target: "4-10 words.",
      },
      {
        name: "intro",
        purpose: "Short instruction or context for the utility.",
        target: "15-35 words.",
      },
      {
        name: "details",
        purpose: "Contact, service-area, form, map, or lookup details.",
        target: "Use sourced facts only.",
      },
      {
        name: "helperText",
        purpose: "Small clarifying text near the form or utility.",
        target: "1 short sentence if needed.",
      },
    ];
  }

  if (mode === "narrative") {
    return [
      {
        name: "eyebrow",
        purpose: "Short context label.",
        target: "2-6 words.",
      },
      {
        name: "heading",
        purpose: "Narrative section headline.",
        target: "6-12 words.",
      },
      {
        name: "body",
        purpose: "Main explanatory copy.",
        target: "1-2 short paragraphs, 45-110 words total.",
      },
      {
        name: "supportingItems",
        purpose: "Cards, bullets, or feature points.",
        target: "2-4 items if the dummy layout uses them.",
      },
    ];
  }

  return fallbackFields;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
