import { sectionToggleFieldNames } from "@/content/section-style-options";

export type SharedTemplateNavigationSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent: string;
  originalIndex: number;
  reduceBottomPadding?: boolean;
  reduceTopPadding?: boolean;
  slotId?: string;
  [key: string]: unknown;
};

export type TemplateWithNavigation<
  Section extends SharedTemplateNavigationSection = SharedTemplateNavigationSection,
> = {
  pageType: string;
  sections: Section[];
  sourceRecipeId?: string;
};

export function getTemplateNavigationSection<
  Section extends SharedTemplateNavigationSection,
>(template: TemplateWithNavigation<Section>) {
  return template.sections.find((section) => section.mode === "Navigation");
}
function isHomeTemplate(template: TemplateWithNavigation) {
  return (
    template.sourceRecipeId === "classic-service" ||
    template.pageType.trim().toLowerCase() === "home"
  );
}

/**
 * The homepage owns the site's navigation choice. Existing templates are kept
 * newest-first, so a non-home promotion inherits from the most recently
 * promoted homepage while a homepage promotion becomes the new source.
 */
export function getCanonicalTemplateNavigation<
  Section extends SharedTemplateNavigationSection,
  Template extends TemplateWithNavigation<Section>,
>(promotedTemplate: Template, existingTemplates: Template[]) {
  if (isHomeTemplate(promotedTemplate)) {
    return getTemplateNavigationSection(promotedTemplate);
  }

  const homeTemplate = existingTemplates.find(isHomeTemplate);

  return homeTemplate
    ? getTemplateNavigationSection(homeTemplate)
    : getTemplateNavigationSection(promotedTemplate);
}

/**
 * Copies the shared nav's component, metadata and complete toggle state while
 * preserving the target template's slot identity. The slot must stay local to
 * the target so a later restage can remap its existing fields by `slotId`.
 */
export function applySharedNavigationToTemplate<
  Section extends SharedTemplateNavigationSection,
  Template extends TemplateWithNavigation<Section>,
>(template: Template, sharedNavigation: Section): Template {
  return {
    ...template,
    sections: template.sections.map((section) => {
      if (section.mode !== "Navigation") {
        return section;
      }

      const next = {
        ...section,
        component: sharedNavigation.component,
        instruction: sharedNavigation.instruction,
        mode: sharedNavigation.mode,
        name: sharedNavigation.name,
        reduceBottomPadding: sharedNavigation.reduceBottomPadding,
        reduceTopPadding: sharedNavigation.reduceTopPadding,
      } as Record<string, unknown>;

      // Clear the target nav first. An unset value on the homepage is part of
      // the shared answer and must remove an older target-only setting.
      for (const name of sectionToggleFieldNames) {
        delete next[name];

        if (sharedNavigation[name] !== undefined) {
          next[name] = sharedNavigation[name];
        }
      }

      return next as Section;
    }),
  };
}
