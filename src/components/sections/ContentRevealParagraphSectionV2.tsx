import type { CSSProperties } from "react";

import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

/**
 * One statement, set large, arriving as a single unit.
 *
 * IT USED TO OWN ITS MOTION AND NO LONGER DOES, which is the whole of this
 * file's history. It ran a clip reveal through motion/react off its own
 * IntersectionObserver, plus a MutationObserver on the enclosing `<details>` so
 * the gesture replayed when the /sections accordion opened - about eighty lines
 * of machinery, a `"use client"` boundary and the Motion runtime, to animate one
 * paragraph. That put it in `animationExcludedComponents` under "owns its own
 * motion", which meant the one section in the library whose entire purpose is an
 * entrance was the one section an editor could not choose an entrance for.
 *
 * It is an ordinary marked unit now. The suite decides what the arrival looks
 * like, the frame decides whether there is one at all, and this file decides
 * neither - the same split every other section already lived under.
 *
 * WHAT WAS LOST, SAID PLAINLY: the old gesture was a clip rising from the
 * baseline, and no suite reproduces it exactly. Wipe is the closest - an edge
 * crossing the type - and it crosses horizontally rather than rising. That is
 * the trade the axis asks of every section: a shared vocabulary of arrivals
 * instead of one bespoke gesture per component.
 *
 * `lines` IS JOINED, AND THE COPY FLOWS. The prop's strings are authoring
 * convenience, not display lines - they are trimmed, joined with spaces and
 * left to wrap wherever the measure falls, exactly as before. This was briefly
 * built the other way, rendering each string as its own block, and the result
 * was five ragged display lines out of four authored strings with
 * `text-wrap: balance` splitting the long one down the middle. Typography stays
 * normal responsive flowing text; the breaks belong to the measure.
 *
 * WHICH LEAVES A REAL PROBLEM FOR TEXT WIPE, because CSS has no way to address
 * the lines a paragraph wraps into - there is no `::nth-line`. The lines it
 * crosses are found at RUNTIME and re-found when the width or the font changes.
 * That machinery belongs to the suite rather than to this file: see
 * `TextWipeLines`, which is to Text wipe what `SectionEntrance` is to the axis as
 * a whole. This section marks `reveal-role-lines` and owns no motion, same as
 * every other section.
 */

type ContentRevealParagraphSectionV2Props = {
  lines: string[];
  sectionSpace?: "vsml" | "sml" | "med" | "lrg";
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentRevealParagraphSectionV2({
  lines,
  sectionSpace = "med",
}: ContentRevealParagraphSectionV2Props) {
  const sectionSpaceClass = {
    vsml: "section-space-vsml",
    sml: "section-space-sml",
    med: "section-space-med",
    lrg: "section-space-lrg",
  }[sectionSpace];
  const revealText = lines.map((line) => line.trim()).filter(Boolean).join(" ");

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className={cx("section-min-none", sectionSpaceClass)}>
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-6 max-lg:col-span-7"
        >
          <div className="fluid-type-frame">
            {/* TWO ROLES ON ONE UNIT, which is legal and deliberate.

                `heading` rather than `content`, and the tag stays a `<p>`.
                The role is animation vocabulary, not semantics: this is the
                section's whole header block, set at heading scale, and Wipe and
                Focus are both gated on a section marking one. Marked `content`
                the stylesheet would still wipe it - both text roles wipe - but
                the two suites would never be OFFERED here, which is the failure
                this project names everywhere: markup that works and a control
                that cannot reach it.

                No wrapper and no `overflow-hidden`. The old clip needed a window
                to rise out of; `section-wipe` insets its own clip path past the
                em box on all four sides so descenders survive, and a window
                around it would crop what those negative insets exist to spare.

                `lines` says something different about the same element: that this
                block is worth splitting into its visual lines. It is what gates
                Text wipe, and it is on the BLOCK rather than on each line
                because a role has to sit on the element carrying the marker -
                and because the lines do not exist until the browser has laid
                the text out. */}
            <p
              className={cx(
                "reveal-on-scroll reveal-role-heading reveal-role-lines",
                "type-heading-xl",
                "measure-copy-wide",
                "text-service-ink",
              )}
              style={{ "--reveal-index": 0 } as CSSProperties}
            >
              {revealText}
            </p>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
