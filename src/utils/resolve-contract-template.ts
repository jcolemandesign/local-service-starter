import type { TemplateCopyContractTemplate } from "@/utils/template-copy-contract";

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
