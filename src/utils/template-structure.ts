type TemplateStructureSection = {
  component: string;
  mode: string;
};

export function validateTemplateStructure(
  sections: TemplateStructureSection[],
) {
  const navigationIndexes = sections
    .map((section, index) => (section.mode === "Navigation" ? index : -1))
    .filter((index) => index >= 0);
  const footerIndexes = sections
    .map((section, index) =>
      section.component.startsWith("Footer") ? index : -1,
    )
    .filter((index) => index >= 0);
  const heroCount = sections.filter((section) => section.mode === "Hero").length;

  if (navigationIndexes.length !== 1) {
    throw new Error("Templates need exactly one navigation section.");
  }

  if (navigationIndexes[0] !== 0) {
    throw new Error("The navigation section must be first.");
  }

  if (footerIndexes.length !== 1) {
    throw new Error("Templates need exactly one footer section.");
  }

  if (footerIndexes[0] !== sections.length - 1) {
    throw new Error("The footer section must be last.");
  }

  if (heroCount > 1) {
    throw new Error("Templates can include at most one hero section.");
  }
}
