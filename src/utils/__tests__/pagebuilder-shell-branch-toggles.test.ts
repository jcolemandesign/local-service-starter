import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  cardLinkComponents,
  cardLinkGridAlignComponents,
  cardStyleComponents,
  headingSizeComponents,
  headlineWrapComponents,
  iconComponents,
  sectionMirrorAlignComponents,
  tableCompareAlignComponents,
} from "@/content/section-style-options";

/**
 * A hand-written branch in the builder canvas must forward every axis its
 * section is offered.
 *
 * `section-toggle-props.test.ts` covers the OTHER path. Most sections fall
 * through to `renderLibrarySection`, which wraps the element in
 * `withSectionToggles`, so their toggles arrive from the membership sets with
 * nobody having to remember anything. Forty-odd sections instead have an
 * explicit branch in the render chain in `PagebuilderShell.tsx`, and those
 * branches never go through `withSectionToggles` - every prop is passed by
 * hand, so every branch is an independent chance to drop one.
 *
 * That is not hypothetical. Adding the mirror-alignment and card-links axes to
 * the services hero wired up the control, the resolver, the membership set, the
 * staged preview and the export, and the builder canvas ignored both, because
 * its branch still listed only the two axes the section had before. The control
 * moved, the saved value was correct, and the canvas rendered the old layout
 * with the hover affordance still on - which reads as "alignment is broken"
 * rather than as a dropped prop. The same sweep found `cardLinks` missing from
 * the three-column branch, dropped the same way at some earlier point.
 *
 * The membership sets are the source of truth for what a section is offered, so
 * this compares the branch against them rather than against a hand-kept list.
 */

const shellSource = readFileSync(
  path.join(
    process.cwd(),
    "src",
    "components",
    "sections",
    "PagebuilderShell.tsx",
  ),
  "utf8",
);

const registryComponents = new Set<string>(
  sectionLibraryV3Registry.map((entry) => entry.component),
);

/** Membership set -> the props a member's branch has to pass. */
const requiredProps: Array<{ members: Set<string>; props: string[] }> = [
  { members: cardStyleComponents, props: ["cardFill", "cardBorder"] },
  { members: cardLinkComponents, props: ["cardLinks"] },
  { members: cardLinkGridAlignComponents, props: ["align"] },
  { members: tableCompareAlignComponents, props: ["align"] },
  { members: sectionMirrorAlignComponents, props: ["align"] },
  { members: iconComponents, props: ["icons"] },
  { members: headlineWrapComponents, props: ["headlineWrap"] },
  { members: headingSizeComponents, props: ["headingSize"] },
];

/**
 * The props each registered section's branch passes.
 *
 * Self-closing JSX elements only, which is what every branch in the chain is.
 * A component rendered more than once has its branches unioned: passing an axis
 * in one place and not another is a different bug, and one this test would
 * rather not report as a false negative on the branch that does it right.
 */
function branchProps() {
  const branches = new Map<string, Set<string>>();

  for (const [, component, body] of shellSource.matchAll(
    /<([A-Z][A-Za-z0-9]*)\b([^>]*?)\/>/g,
  )) {
    if (!registryComponents.has(component)) continue;

    const props = [...body.matchAll(/(?:^|\s)([a-zA-Z][a-zA-Z0-9]*)=/g)].map(
      (match) => match[1],
    );
    const existing = branches.get(component);

    if (existing) for (const prop of props) existing.add(prop);
    else branches.set(component, new Set(props));
  }

  return branches;
}

describe("pagebuilder shell branches forward their toggles", () => {
  const branches = branchProps();

  it("finds the branches it is meant to be checking", () => {
    // A regex that stopped matching would make every assertion below vacuous.
    expect(branches.size).toBeGreaterThan(30);
  });

  it("passes every axis each branched section is offered", () => {
    const gaps: string[] = [];

    for (const [component, props] of branches) {
      for (const { members, props: names } of requiredProps) {
        if (!members.has(component)) continue;

        const missing = names.filter((name) => !props.has(name));

        if (missing.length > 0) {
          gaps.push(`${component}: branch never passes ${missing.join(", ")}`);
        }
      }
    }

    expect(
      gaps.sort(),
      "the builder offers these axes and the canvas branch drops them, so the control renders and the canvas does not move",
    ).toEqual([]);
  });
});
