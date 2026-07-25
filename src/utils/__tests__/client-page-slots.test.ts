import { describe, expect, it } from "vitest";

import {
  readClientPageSlots,
  readStrategyPageSlots,
} from "@/utils/client-page-slots";
import {
  baseStrategyPageSlots,
  getPathFromSlugForPageType,
  withClientPageSlots,
  type StrategyPageDefinition,
} from "@/utils/strategy-site-map";

/**
 * `strategyPageSlots` used to be one hardcoded list built around North Star
 * HVAC, so every client of every trade was offered "Heat Pump Service" as a
 * page slot. The skeleton is now trade-neutral and a client's own service pages
 * live in `src/content/projects/<clientSlug>/page-slots.json`.
 */

function serviceSlot(id: string, label: string): StrategyPageDefinition {
  return {
    aliases: [label.toLowerCase()],
    copyField: "servicesCopy",
    id,
    label,
    parentId: "services",
    pageType: "Individual Service",
    path: `/services/${id}`,
  };
}

describe("baseStrategyPageSlots", () => {
  it("carries no trade-specific service pages", () => {
    const ids = baseStrategyPageSlots.map((slot) => slot.id);

    expect(ids).not.toContain("heat-pump-service");
    expect(ids).not.toContain("ac-repair");
    expect(ids).not.toContain("emergency-hvac");
  });

  it("keeps the generic repeatable service slot, so a new client can still stage one", () => {
    const genericSlot = baseStrategyPageSlots.find(
      (slot) => slot.id === "individual-service",
    );

    expect(genericSlot?.repeatable).toBe(true);
    expect(genericSlot?.parentId).toBe("services");
  });
});

describe("withClientPageSlots", () => {
  it("returns the skeleton unchanged for a client with no configured pages", () => {
    expect(withClientPageSlots([]).map((slot) => slot.id)).toEqual(
      baseStrategyPageSlots.map((slot) => slot.id),
    );
  });

  it("inserts service pages directly after the generic slot", () => {
    const ids = withClientPageSlots([
      serviceSlot("drain-cleaning", "Drain Cleaning"),
      serviceSlot("water-heaters", "Water Heaters"),
    ]).map((slot) => slot.id);

    expect(ids.slice(ids.indexOf("individual-service"), ids.indexOf("individual-service") + 3)).toEqual([
      "individual-service",
      "drain-cleaning",
      "water-heaters",
    ]);
  });

  it("lets a client override a base slot in place rather than duplicating it", () => {
    const slots = withClientPageSlots([
      { ...baseStrategyPageSlots[0], label: "Front Page" },
    ]);

    expect(slots.filter((slot) => slot.id === "home")).toHaveLength(1);
    expect(slots.find((slot) => slot.id === "home")?.label).toBe("Front Page");
    expect(slots).toHaveLength(baseStrategyPageSlots.length);
  });

  it("appends non-service pages after the skeleton instead of inside Services", () => {
    const ids = withClientPageSlots([
      {
        aliases: ["careers"],
        copyField: "generalNotes",
        id: "careers",
        label: "Careers",
        pageType: "About",
        path: "/careers",
      },
    ]).map((slot) => slot.id);

    expect(ids.at(-1)).toBe("careers");
  });
});

describe("readStrategyPageSlots", () => {
  /**
   * The regression guard for the extraction: North Star's sitemap must come out
   * of base + config in exactly the order the hardcoded list had, or existing
   * staged pages stop matching their slots and copy resolution silently falls
   * back to contentPlan/strategyBrief.
   */
  it("reproduces North Star's original slot order from base + config", async () => {
    const slots = await readStrategyPageSlots("north-star-hvac");

    expect(slots.map((slot) => slot.id)).toEqual([
      "home",
      "services",
      "individual-service",
      "system-replacement",
      "heat-pump-service",
      "maintenance",
      "ac-repair",
      "heating-repair",
      "emergency-hvac",
      "service-area",
      "service-plan",
      "specials",
      "financing",
      "about",
      "contact",
      "blog",
      "blog-post",
      "products",
      "thank-you",
    ]);
  });

  it("gives an unconfigured client the skeleton only", async () => {
    const slots = await readStrategyPageSlots("client-that-does-not-exist");

    expect(slots.map((slot) => slot.id)).toEqual(
      baseStrategyPageSlots.map((slot) => slot.id),
    );
  });
});

describe("readClientPageSlots", () => {
  it("returns nothing for a client with no config file", async () => {
    expect(await readClientPageSlots("client-that-does-not-exist")).toEqual([]);
  });

  it("reads North Star's service pages", async () => {
    const slots = await readClientPageSlots("north-star-hvac");

    expect(slots).toHaveLength(6);
    expect(slots.every((slot) => slot.parentId === "services")).toBe(true);
  });
});

describe("slot paths agree with the shared path rules", () => {
  /**
   * A slot declares its `path`, and `getPathFromSlugForPageType` computes one
   * from the page type. Two sources of truth for the same URL, and they had
   * silently drifted: North Star's maintenance page was typed "Individual
   * Service" but pathed "/maintenance", so a hardcoded special case for that
   * one slug lived in the shared rules and applied to every client.
   *
   * The page was a service, not an offer-level plan page - that is what
   * `service-plan` is for - so the type was right and the path was wrong.
   *
   * Template paths are skipped: `/services/[service]` describes a shape, not a
   * page.
   */
  it("computes each concrete slot's declared path from its page type", async () => {
    const slots = await readStrategyPageSlots("north-star-hvac");
    const concreteSlots = slots.filter((slot) => !slot.path.includes("["));

    expect(concreteSlots.length).toBeGreaterThan(10);

    const mismatches = concreteSlots
      .filter(
        (slot) =>
          getPathFromSlugForPageType(slot.id, slot.pageType) !== slot.path,
      )
      .map(
        (slot) =>
          `${slot.id}: declared ${slot.path}, computed ${getPathFromSlugForPageType(slot.id, slot.pageType)}`,
      );

    expect(mismatches).toEqual([]);
  });

  it("puts a service page under /services", async () => {
    const slots = await readStrategyPageSlots("north-star-hvac");

    expect(slots.find((slot) => slot.id === "maintenance")?.path).toBe(
      "/services/maintenance",
    );
  });
});
