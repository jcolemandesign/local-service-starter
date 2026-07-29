import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProcessStepsBranchingSectionV3 } from "@/components/sections/ProcessStepsBranchingSectionV3";

const content = {
  outcomes: [
    { body: "Address the current problem.", title: "Repair" },
    {
      body: "Discuss ongoing care or replacement.",
      title: "Larger decision",
    },
  ],
  steps: [
    { body: "Step one body.", title: "Step one" },
    { body: "Step two body.", title: "Step two" },
    { body: "Step three body.", title: "Step three" },
  ],
  title: "A clear next step",
} as const;

describe("ProcessStepsBranchingSectionV3", () => {
  it("renders the smaller left header beside the flow", () => {
    const html = renderToStaticMarkup(
      <ProcessStepsBranchingSectionV3 {...content} align="left" />,
    );

    expect(html).toContain("type-heading-lg");
    expect(html).toContain(content.title);
    expect(html).toContain("col-span-4");
    expect(html).toContain("col-span-10 col-start-5");
  });

  it("removes the header from the centered flow", () => {
    const html = renderToStaticMarkup(
      <ProcessStepsBranchingSectionV3 {...content} align="center" />,
    );

    expect(html).not.toContain(content.title);
    expect(html).not.toContain("type-heading-lg");
    expect(html).toContain("col-span-10 col-start-3");
  });

  it("keeps connector strokes when card fill and border are disabled", () => {
    const html = renderToStaticMarkup(
      <ProcessStepsBranchingSectionV3
        {...content}
        cardBorder="off"
        cardFill="none"
      />,
    );

    expect(html).toContain("!bg-transparent !shadow-none");
    expect(html).toContain("!border-transparent");
    expect(html).toContain("border-l border-service-border");
  });

  it("uses the service surface token for filled cards", () => {
    const html = renderToStaticMarkup(
      <ProcessStepsBranchingSectionV3 {...content} cardFill="solid" />,
    );

    expect(html).toContain("bg-service-surface");
  });
});
