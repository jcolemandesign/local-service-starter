import { describe, expect, it } from "vitest";

import {
  calloutRevealGridVariantOptions,
  calloutSplitPanelVariantOptions,
} from "@/content/section-style-options";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

/**
 * Both callout sections gained a card-arrangement variant after pages were
 * already saved against them, and their copy specs now branch on it. That
 * creates one invariant nothing else enforces:
 *
 * A saved section stores no variant at all. If the unset value produced even a
 * slightly different spec than the default option, every approved page using
 * the section would report stale copy the moment it was read - not because the
 * copy changed, but because the contract fingerprint moved underneath it. The
 * fingerprint is a hash of these field objects, so "identical" has to mean
 * byte-identical, not merely equivalent.
 *
 * The reverse matters too: if the non-default arrangement produced the same
 * spec, the page agent would be told to write four short teasers for a layout
 * that wants six long ones, and nothing would flag it.
 */

const calloutSections = [
  {
    component: "ServiceCalloutRevealGridSectionV3",
    defaultVariant: calloutRevealGridVariantOptions[0].value,
    mode: "Decision",
    name: "Callout cards with reveal panel",
    otherVariant: calloutRevealGridVariantOptions[1].value,
  },
  {
    component: "ServiceCalloutSplitPanelSectionV3",
    defaultVariant: calloutSplitPanelVariantOptions[0].value,
    mode: "Decision",
    name: "Callout cards with side panel",
    otherVariant: calloutSplitPanelVariantOptions[1].value,
  },
];

describe("callout card arrangement variants", () => {
  it("treats an unset variant exactly like the default option", () => {
    for (const section of calloutSections) {
      const base = {
        component: section.component,
        mode: section.mode,
        name: section.name,
      };

      const unset = getTemplateCopyFieldsForSection(base);
      const explicit = getTemplateCopyFieldsForSection({
        ...base,
        variant: section.defaultVariant,
      });

      expect(
        JSON.stringify(unset),
        `${section.component}: saved pages store no variant, so an unset variant must produce the same copy spec as "${section.defaultVariant}" or every approved page goes stale`,
      ).toBe(JSON.stringify(explicit));
    }
  });

  it("changes the copy spec for the non-default arrangement", () => {
    for (const section of calloutSections) {
      const base = {
        component: section.component,
        mode: section.mode,
        name: section.name,
      };

      const defaultSpec = getTemplateCopyFieldsForSection({
        ...base,
        variant: section.defaultVariant,
      });
      const otherSpec = getTemplateCopyFieldsForSection({
        ...base,
        variant: section.otherVariant,
      });

      expect(
        JSON.stringify(defaultSpec) === JSON.stringify(otherSpec),
        `${section.component}: "${section.otherVariant}" holds a different number of cards than "${section.defaultVariant}", but asks copy for exactly the same thing`,
      ).toBe(false);
    }
  });

  it("keeps every arrangement's card fields in step with each other", () => {
    for (const section of calloutSections) {
      for (const variant of [section.defaultVariant, section.otherVariant]) {
        const fields = getTemplateCopyFieldsForSection({
          component: section.component,
          mode: section.mode,
          name: section.name,
          variant,
        });

        // The three lists are zipped by index at render time - card N takes
        // panel N and action N - so a spec that asks for different counts
        // produces cards with someone else's panel behind them.
        const counts = ["calloutItems", "calloutPanels", "calloutActions"].map(
          (name) => fields.find((field) => field.name === name)?.itemCount,
        );

        expect(
          new Set(counts).size,
          `${section.component} (${variant}): calloutItems/Panels/Actions ask for ${counts.join("/")} items, but they are zipped by index`,
        ).toBe(1);
      }
    }
  });
});
