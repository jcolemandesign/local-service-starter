import { describe, expect, it } from "vitest";

import { sortByPromptLibraryPageOrder } from "@/utils/prompt-library-page-order";

describe("Prompt Library page order", () => {
  it("orders Strategy Workspace tiles in the Prompt Library queue sequence", () => {
    const pages = [
      { id: "thank-you", label: "Thank You", pageType: "Thank You" },
      { id: "contact", label: "Contact", pageType: "Contact" },
      {
        id: "furnace-repair",
        label: "Furnace Repair",
        pageType: "Individual Service",
      },
      { id: "blog", label: "Blog Index", pageType: "Blog Index" },
      {
        id: "services",
        label: "Services Overview",
        pageType: "Services Overview",
      },
      { id: "about", label: "About", pageType: "About" },
      {
        id: "ac-repair",
        label: "AC Repair",
        pageType: "Individual Service",
      },
      { id: "financing", label: "Financing", pageType: "Financing" },
      { id: "service-area", label: "Service Area", pageType: "Service Area" },
      { id: "home", label: "Home", pageType: "Home" },
    ];

    expect(sortByPromptLibraryPageOrder(pages).map((page) => page.id)).toEqual([
      "home",
      "about",
      "services",
      "contact",
      "ac-repair",
      "furnace-repair",
      "service-area",
      "blog",
      "financing",
      "thank-you",
    ]);
  });
});
