import {
  semanticSectionLabels,
  type SemanticSectionLabel,
} from "@/content/semantic-section-options";
import { slugify } from "@/utils/strategy-site-map";

export type SemanticBlueprintSection = {
  body: string;
  id: string;
  mode: SemanticSectionLabel;
  sourceRole: string;
  summary: string;
  title: string;
};

export type SemanticPageBlueprint = {
  sections: SemanticBlueprintSection[];
};

const semanticLabelSet = new Set<string>(semanticSectionLabels);

export function buildSemanticPageBlueprint(pageCopy: string): SemanticPageBlueprint {
  const sections = parseNumberedSections(pageCopy);

  return {
    sections: sections.map((section, index) => {
      const sourceRole = getSemanticRole(section.body);
      const mode = normalizeSemanticLabel({
        index,
        sourceRole,
        title: section.title,
      });
      const id = `${String(index + 1).padStart(2, "0")}-${slugify(section.title)}`;

      return {
        body: section.body,
        id,
        mode,
        sourceRole,
        summary: summarizeSection(section.body),
        title: section.title,
      };
    }),
  };
}

function parseNumberedSections(pageCopy: string) {
  const matches = Array.from(
    pageCopy.matchAll(/^##\s+\d+\.\s+(.+?)\s*$/gm),
  );

  return matches
    .map((match, index) => {
      const start = match.index ?? 0;
      const bodyStart = start + match[0].length;
      const nextStart = matches[index + 1]?.index ?? pageCopy.length;
      const title = stripMarkdown(match[1]).replace(/\s+Copy Notes$/i, "");

      return {
        body: pageCopy.slice(bodyStart, nextStart).trim(),
        title,
      };
    })
    .filter((section) => {
      const normalizedTitle = section.title.toLowerCase();

      return (
        section.body.includes("Semantic role") &&
        !normalizedTitle.includes("seo basics") &&
        !normalizedTitle.includes("page goal")
      );
    });
}

function getSemanticRole(sectionBody: string) {
  const match = sectionBody.match(/\*\*Semantic role:\*\*\s*([^\n]+)/i);

  return stripMarkdown(match?.[1] ?? "").trim();
}

function normalizeSemanticLabel({
  index,
  sourceRole,
  title,
}: {
  index: number;
  sourceRole: string;
  title: string;
}): SemanticSectionLabel {
  const titleText = title.toLowerCase();
  const roleText = sourceRole.toLowerCase();
  const combined = `${titleText} ${roleText}`;

  if (hasAny(combined, ["navigation", "header", "nav"])) {
    return "Navigation";
  }

  if (hasAny(combined, ["offer", "promo", "special", "campaign", "coupon", "rebate", "savings"])) {
    return "Offer";
  }

  if (hasAny(combined, ["footer"])) {
    return "Footer";
  }

  if (hasAny(titleText, ["hero"]) || (index === 0 && roleText.includes("conversion"))) {
    return "Hero";
  }

  const explicitLabel = semanticSectionLabels.find((label) =>
    roleText
      .split("/")
      .map((part) => part.trim())
      .some((part) => part === label.toLowerCase()),
  );

  if (explicitLabel && semanticLabelSet.has(explicitLabel)) {
    return explicitLabel;
  }

  if (hasAny(combined, ["testimonial", "review", "credential", "trust", "proof", "why choose"])) {
    return "Proof";
  }

  if (hasAny(combined, ["faq", "question", "objection", "decision", "process", "how it works", "repair vs"])) {
    return "Decision";
  }

  if (hasAny(combined, ["service area", "contact", "form", "map", "hours", "thank you"])) {
    return "Utility";
  }

  if (hasAny(combined, ["services", "cards", "links", "list", "scan"])) {
    return "Scan";
  }

  if (roleText.includes("conversion") || hasAny(combined, ["cta", "callout", "call now", "request"])) {
    return "Action";
  }

  return "Narrative";
}

function summarizeSection(sectionBody: string) {
  const withoutRole = sectionBody
    .replace(/\*\*Semantic role:\*\*\s*([^\n]+)/i, "")
    .replace(/^---$/gm, "")
    .trim();
  const lines = withoutRole
    .split("\n")
    .map((line) => stripMarkdown(line).trim())
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().startsWith("image/content note"));

  return lines.slice(0, 4).join(" ").slice(0, 320);
}

function hasAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function stripMarkdown(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^\s*#+\s*/, "")
    .trim();
}
