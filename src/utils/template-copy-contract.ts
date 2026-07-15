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
  example?: string | string[];
  format?: string;
  itemCount?: number;
  name: string;
  purpose: string;
  target: string;
};

const fallbackFields: TemplateCopyFieldSpec[] = [
  {
    example: "Local service starter",
    name: "eyebrow",
    purpose: "Short context label if the section design uses one.",
    target: "12-36 characters.",
  },
  {
    example: "Clear service from request to resolved",
    name: "heading",
    purpose: "Primary section headline.",
    target: "35-70 characters.",
  },
  {
    example:
      "Use this field for one focused paragraph that explains the section without overfilling the layout.",
    name: "body",
    purpose: "Supporting explanation for this section.",
    target: "120-220 characters unless the section is explicitly long-form.",
  },
  {
    example: [
      "System Replacement - Compare repair and replacement options with clear recommendations.",
      "Maintenance - Keep heating and cooling systems checked before peak-season demand.",
    ],
    format: "One item per line. Use Title - Description when an item has both.",
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
    "# Page Template Copy Spec",
    "",
    "Use this spec with the project-level page-copy agent instructions. Write copy for this exact staged page instance and preserve the section IDs, field names, section order, repeatable item counts, and copy-fit limits.",
    "",
    "Former name: Template Copy Contract.",
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
    "- This Page Template Copy Spec",
    "",
    "## Output Rules",
    "- Default output is a human-review outline.",
    "- Do not output bulk/batch paste format unless the user explicitly asks for bulk paste, batch paste, import format, or paste-ready fields.",
    "- Do not add new sections.",
    "- Do not skip sections. If a section requires unverified proof, fill unsafe fields with NEEDS REVIEW rather than fabricating.",
    "- Write for the exact Page Target above, not for a broader page type.",
    "- Keep copy sized to the listed field targets and examples.",
    "- Use cautious wording for unsupported claims.",
    "- For gridded card sections with mixed card sizes, mark larger cards in repeatable card fields with [large] or [featured] before the title. Example: [large] System Replacement — Compare repair and replacement options.",
    "- If a field cannot be written from the provided source material, write NEEDS REVIEW with the missing detail.",
    "- Return structured text by section ID, not prose paragraphs about the page.",
    "- If the user asks for outline mode, use bullets and notes for review.",
    "- If the user asks for bulk paste mode, use exact field labels with no bullets before field names.",
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
      lines.push(`- ${field.name}`);
      lines.push(`  Purpose: ${field.purpose}`);
      lines.push(`  Target: ${field.target}`);

      if (field.itemCount) {
        lines.push(`  Item count: ${field.itemCount}`);
      }

      if (field.format) {
        lines.push(`  Format: ${field.format}`);
      }

      if (field.example) {
        const examples = Array.isArray(field.example)
          ? field.example
          : [field.example];

        lines.push("  Example:");

        examples.forEach((example) => {
          lines.push(
            `    - ${example} (${countCharacters(example)} characters)`,
          );
        });
      }
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
        example: "North Star HVAC",
        name: "logoLabel",
        purpose: "Business name or compact logo text.",
        target: "8-28 characters. Use the exact sourced business name.",
      },
      {
        example: [
          "Services -> /services",
          "Service Area -> /service-area",
          "About -> /about",
          "Contact -> /contact",
        ],
        format: "One item per line as Label -> path.",
        itemCount: 4,
        name: "navLinks",
        purpose: "Primary navigation labels and destination intent.",
        target: "4-7 concise labels, 6-18 characters each.",
      },
      {
        example: "704-555-0184",
        name: "phone",
        purpose: "Primary call path if available.",
        target: "Use exact sourced number or NEEDS REVIEW.",
      },
      {
        example: "Request a Quote",
        name: "primaryAction",
        purpose: "Main header CTA.",
        target: "10-22 characters.",
      },
    ];
  }

  if (lookupValue.includes("footer")) {
    return [
      {
        example:
          "North Star HVAC helps Lake Norman homeowners plan repairs, replacements, and maintenance with clear next steps.",
        name: "businessSummary",
        purpose: "Short footer positioning or service summary.",
        target: "100-190 characters.",
      },
      {
        example: [
          "Air Conditioning -> /services/ac-repair",
          "Heating Repair -> /services/heating-repair",
          "Emergency HVAC -> /services/emergency-hvac",
          "Huntersville -> /service-area/huntersville",
        ],
        format: "One item per line as Label -> path.",
        itemCount: 6,
        name: "footerLinks",
        purpose: "Useful footer navigation groups or labels.",
        target: "Match site pages and key service paths. Labels should be 8-28 characters.",
      },
      {
        example:
          "Phone: 704-555-0184. Service area: Huntersville, Cornelius, Davidson, and nearby Lake Norman communities.",
        name: "contactDetails",
        purpose: "Phone, email, address, hours, or service area details.",
        target: "Use sourced facts only. 80-180 characters.",
      },
      {
        example: "© 2026 North Star HVAC. All rights reserved. Privacy policy.",
        name: "legalLine",
        purpose: "Copyright or small footer note.",
        target: "45-90 characters.",
      },
    ];
  }

  if (lookupValue.includes("hero")) {
    return [
      {
        example: "Serving Lake Norman homes",
        name: "eyebrow",
        purpose: "Immediate local/service context above the H1.",
        target: "18-44 characters.",
      },
      {
        example: "Clear HVAC Help for Lake Norman Homeowners",
        name: "h1",
        purpose: "Main page headline.",
        target: "42-74 characters. One H1 only.",
      },
      {
        example:
          "Plan HVAC service with a local team that explains the issue, outlines practical options, and helps you choose the next step without pressure.",
        name: "intro",
        purpose: "Above-the-fold value proposition.",
        target: "130-240 characters.",
      },
      {
        example: "Request Service",
        name: "primaryAction",
        purpose: "Main conversion CTA.",
        target: "10-22 characters.",
      },
      {
        example: "View Services",
        name: "secondaryAction",
        purpose: "Secondary path for visitors who need context.",
        target: "10-22 characters.",
      },
      {
        example: [
          "Repair, replacement, and maintenance",
          "Serving Huntersville and nearby towns",
          "Clear options before work begins",
        ],
        format: "One short proof point per line. Use sourced facts only.",
        itemCount: 3,
        name: "proofPoints",
        purpose: "Stats, trust points, or short supporting claims if the layout uses them.",
        target: "2-4 items, 28-70 characters each. Use sourced facts only.",
      },
    ];
  }

  if ((lookupValue.includes("service") && mode !== "utility") || mode === "scan") {
    return [
      {
        example: "HVAC services",
        name: "eyebrow",
        purpose: "Short category label.",
        target: "12-32 characters.",
      },
      {
        example: "Service options for every season",
        name: "heading",
        purpose: "Services section headline.",
        target: "32-68 characters.",
      },
      {
        example:
          "Choose the path that matches the problem, from urgent repairs to planned system upgrades and seasonal maintenance.",
        name: "intro",
        purpose: "Brief explanation of the service set.",
        target: "100-190 characters.",
      },
      {
        example: [
          "AC Repair - Diagnose cooling issues, explain the repair, and restore comfort when the system falls behind.",
          "Heating Repair - Resolve furnace and heat pump problems with clear options before work begins.",
          "[large] System Replacement - Compare repair and replacement paths when an older system is no longer dependable.",
        ],
        format:
          "One item per line as Title - Description. Prefix a larger card with [large] or [featured] when the visual layout has one.",
        itemCount: sectionName.includes("service card grid") ? 3 : undefined,
        name: "serviceItems",
        purpose: "Repeated service cards or bullets.",
        target:
          sectionName.includes("service card grid")
            ? "Exactly 3 items. Titles 12-34 characters. Descriptions 90-170 characters."
            : "Match dummy item count. Titles 12-38 characters. Descriptions 90-180 characters.",
      },
      {
        example: "View All Services",
        name: "sectionAction",
        purpose: "CTA for the service group if the layout uses one.",
        target: "12-24 characters.",
      },
    ];
  }

  if (lookupValue.includes("testimonials") || lookupValue.includes("review")) {
    return [
      {
        example: "What local HVAC customers notice",
        name: "heading",
        purpose: "Proof section headline.",
        target: "32-68 characters.",
      },
      {
        example:
          "Use this section only when approved review or testimonial text is available from the source material.",
        name: "intro",
        purpose: "Short setup for customer proof.",
        target: "90-170 characters.",
      },
      {
        example:
          "NEEDS REVIEW: Approved testimonial excerpt and attribution missing.",
        format:
          "One testimonial per line as Quote - Attribution. Use NEEDS REVIEW when source proof is missing.",
        name: "testimonials",
        purpose: "Visible testimonials or review-style entries.",
        target: "Use only testimonials visible in approved sources. Do not invent reviews.",
      },
    ];
  }

  if (mode === "proof" || lookupValue.includes("trust")) {
    return [
      {
        example: "Practical service, clear expectations",
        name: "heading",
        purpose: "Trust or credibility headline if the layout has one.",
        target: "32-70 characters.",
      },
      {
        example: [
          "Options explained before work begins",
          "Repair and replacement guidance",
          "Local service-area familiarity",
        ],
        format: "One sourced proof point per line.",
        itemCount: 3,
        name: "proofItems",
        purpose: "Short trust claims, stats, badges, or credibility points.",
        target: "3-6 short items, 28-72 characters each. Use sourced facts only.",
      },
    ];
  }

  if (component.includes("contentfixedcoverfade")) {
    return [
      {
        example: "Let the final message hold before the request path rises",
        name: "backgroundTitle",
        purpose:
          "The large, immersive closing statement shown before the request form enters.",
        target: "42-92 characters. Required; do not reuse the form-side headline.",
      },
      {
        example:
          "A steady closing promise gives way to a request form when the visitor is ready to act.",
        name: "backgroundBody",
        purpose:
          "Supporting copy for the full-screen closing statement behind the request path.",
        target: "80-170 characters. Required; do not leave blank.",
      },
      {
        example: "Contact",
        name: "foregroundEyebrow",
        purpose: "Optional short label above the form-side request headline.",
        target: "8-24 characters, or [omit] when the label is not needed.",
      },
      {
        example: "Plan the right next step for your system",
        name: "foregroundTitle",
        purpose: "Request-side headline beside the form.",
        target: "36-72 characters. Keep distinct from backgroundTitle.",
      },
      {
        example:
          "Tell us what is happening, and the team will follow up to discuss the request and the most appropriate service path.",
        name: "foregroundBody",
        purpose: "Supporting copy beside the form that explains the next step.",
        target: "90-180 characters.",
      },
      {
        example: [
          "704-555-0184",
          "hello@example.com",
          "Mon-Fri, 8am-6pm",
        ],
        format: "One sourced contact detail per line.",
        itemCount: 3,
        name: "contactDetails",
        purpose: "Short contact or availability details listed below the request copy.",
        target: "2-4 concise sourced entries. Use NEEDS REVIEW for missing facts.",
      },
    ];
  }

  if (mode === "action" || lookupValue.includes("cta")) {
    return [
      {
        example: "Ready to plan your next HVAC service?",
        name: "heading",
        purpose: "Conversion-focused CTA headline.",
        target: "36-72 characters.",
      },
      {
        example:
          "Tell us what is happening with your system and we will help you choose the right next step.",
        name: "body",
        purpose: "Short support copy for the action.",
        target: "90-180 characters.",
      },
      {
        example: "Schedule Service",
        name: "primaryAction",
        purpose: "Primary CTA label.",
        target: "12-24 characters.",
      },
      {
        example: "Call Now",
        name: "secondaryAction",
        purpose: "Optional secondary CTA label.",
        target: "8-22 characters if needed.",
      },
    ];
  }

  if (lookupValue.includes("faq")) {
    return [
      {
        example: "Common HVAC questions answered",
        name: "heading",
        purpose: "FAQ section headline.",
        target: "24-60 characters.",
      },
      {
        example: [
          "Do you service my area? - We serve the locations listed in the approved service-area source. If your town is not listed, contact the team to confirm availability.",
          "Should I repair or replace my system? - The right answer depends on the system age, repair history, comfort problems, and cost of the current issue.",
        ],
        format: "One item per line as Question - Answer.",
        itemCount: 5,
        name: "faqs",
        purpose: "Questions and direct answers.",
        target: "4-8 FAQs. Questions 35-90 characters. Answers 120-260 characters.",
      },
    ];
  }

  if (lookupValue.includes("process") || mode === "decision") {
    return [
      {
        example: "How the service decision gets clearer",
        name: "heading",
        purpose: "Decision/process headline.",
        target: "36-74 characters.",
      },
      {
        example:
          "Use this section to show how visitors move from a symptom or question to a practical next step.",
        name: "intro",
        purpose: "Short explanation of how to decide or what happens next.",
        target: "90-180 characters.",
      },
      {
        example: [
          "Describe the issue - Share what changed, when it started, and whether the system is still running.",
          "Review the options - Compare repair, maintenance, or replacement paths using the facts available.",
          "Choose the next step - Move forward with the option that fits urgency, comfort, and budget.",
        ],
        format: "One item per line as Title - Description.",
        itemCount: 3,
        name: "steps",
        purpose: "Ordered steps, criteria, or comparison points.",
        target: "3-5 items. Titles 16-38 characters. Descriptions 90-180 characters.",
      },
    ];
  }

  if (mode === "utility" || lookupValue.includes("contact")) {
    return [
      {
        example: "Check service availability",
        name: "heading",
        purpose: "Utility section headline.",
        target: "28-64 characters.",
      },
      {
        example:
          "Enter your ZIP code or contact the team to confirm service details for your home.",
        name: "intro",
        purpose: "Short instruction or context for the utility.",
        target: "80-160 characters.",
      },
      {
        example:
          "Huntersville, Cornelius, Davidson, Mooresville, and nearby Lake Norman communities.",
        format:
          "Use sourced facts only. For lookup sections, list the supported entries exactly as provided.",
        name: "details",
        purpose: "Contact, service-area, form, map, or lookup details.",
        target: "Use sourced facts only. 60-180 characters unless the UI expects a list.",
      },
      {
        example: "Not sure if you are covered? Send the address and ask.",
        name: "helperText",
        purpose: "Small clarifying text near the form or utility.",
        target: "45-100 characters if needed.",
      },
    ];
  }

  if (mode === "narrative") {
    return [
      {
        example: "Local service context",
        name: "eyebrow",
        purpose: "Short context label.",
        target: "16-40 characters.",
      },
      {
        example: "Built around real service decisions",
        name: "heading",
        purpose: "Narrative section headline.",
        target: "36-76 characters.",
      },
      {
        example:
          "This section should explain the situation the visitor is trying to solve, then connect the service offer to a practical next step.",
        name: "body",
        purpose: "Main explanatory copy.",
        target: "140-320 characters.",
      },
      {
        example: [
          "Clear scope - Explain what is included before the visitor commits.",
          "Local fit - Tie the copy to the approved towns, climate, or home-service context.",
        ],
        format: "One item per line as Title - Description.",
        itemCount: 3,
        name: "supportingItems",
        purpose: "Cards, bullets, or feature points.",
        target: "2-4 items if the dummy layout uses them. Descriptions 80-160 characters.",
      },
    ];
  }

  return fallbackFields;
}

function countCharacters(value: string) {
  return value.length;
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
