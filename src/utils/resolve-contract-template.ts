import type { TemplateCopyContractTemplate } from "@/utils/template-copy-contract";

type TemplateIdentity = {
  id: string;
  name: string;
};

/**
 * A staged page's own template snapshot takes precedence over a live template
 * lookup, so contract generation/status reflects what was actually staged
 * rather than a template that may have been edited since staging.
 */
export function resolveContractTemplate(
  stagedTemplate: TemplateCopyContractTemplate | undefined,
  liveTemplates: TemplateCopyContractTemplate[],
  templateId: string,
): TemplateCopyContractTemplate | undefined {
  return (
    stagedTemplate ?? liveTemplates.find((item) => item.id === templateId)
  );
}

/**
 * Template structure stays pinned to the staged snapshot, but its display name
 * is editable library metadata. Resolve that one field from the live template
 * with the same stable id so rename-only edits reach downstream tools without
 * silently swapping the staged section contract to a newer template revision.
 */
export function resolveCurrentTemplateName(
  stagedTemplate: TemplateIdentity | undefined,
  liveTemplates: readonly TemplateIdentity[],
  templateId: string,
) {
  const liveName = liveTemplates
    .find((template) => template.id === templateId)
    ?.name.trim();

  return liveName || stagedTemplate?.name.trim() || "";
}
