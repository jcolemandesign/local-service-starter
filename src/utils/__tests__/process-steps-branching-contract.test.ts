import { describe, expect, it } from "vitest";

import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

describe("Process Steps Branching copy contract", () => {
  it("declares exactly the fields consumed by the renderer", () => {
    const fields = getTemplateCopyFieldsForSection({
      component: "ProcessStepsBranchingSectionV3",
      mode: "Decision",
      name: "Process steps branching",
    });

    expect(fields.map((field) => field.name)).toEqual([
      "heading",
      "steps",
      "outcomes",
    ]);
    expect(fields.find((field) => field.name === "steps")?.itemCount).toBe(3);
    expect(fields.find((field) => field.name === "outcomes")?.itemCount).toBe(2);
  });
});
