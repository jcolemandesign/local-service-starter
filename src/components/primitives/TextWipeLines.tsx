"use client";

/**
 * TYPES ONLY, AND IT IS NOT AN ACCIDENTAL CORE IMPORT. SplitText's own
 * declarations lean on the `gsap` namespace for `DOMTarget`, so TypeScript
 * needs the entry point in the program even though nothing here needs it at
 * runtime. `import type` is erased entirely - the bundle sees the dynamic
 * `gsap/SplitText` import below and nothing else.
 */
import type {} from "gsap";
import { useEffect } from "react";

/**
 * Finds the visual lines Text wipe crosses, and re-finds them when they move.
 *
 * WHAT THIS IS TO ITS SUITE, `SectionEntrance` is to the axis: one client
 * component that renders nothing, mounted once, doing the one job CSS cannot do
 * for itself. Every other suite needs no JavaScript at all, because every other
 * suite animates elements the section already wrote. This one animates the
 * lines a paragraph WRAPS INTO, and there is no selector for those - no
 * `::nth-line`, no way to ask the cascade where the second line starts.
 *
 * THE ALTERNATIVE WAS WORSE, and it shipped for one commit before being pulled.
 * If the lines have to be real elements, the section has to write them, which
 * means the copy's line breaks stop belonging to the measure and start
 * belonging to the content. On a statement authored as four fragments that
 * produced five ragged display lines, with `text-wrap: balance` splitting the
 * long one down the middle. Typography stays flowing text; the lines are found
 * after layout, which is the only moment they exist.
 *
 * THE SPLIT IS NOT THE ANIMATION. This creates elements and numbers them; the
 * stylesheet still owns what they do, out of the same wipe tokens the Style
 * Guide authors. Nothing here reads a duration or an easing, and that is the
 * line between a suite needing help and a suite owning its motion.
 */

/** The frames this suite is on, and the block inside one that holds the copy. */
const frameSelector = '[data-pagebuilder-animation="text-wipe"]';
const blockSelector = ".reveal-role-lines";

/**
 * The class each generated line carries, and the stylesheet's hook.
 *
 * Named here rather than taken from SplitText's default so the CSS and the
 * splitter cannot drift: `animation-css-agreement` reads the stylesheet, and a
 * renamed default would leave a rule matching nothing with nothing to say so.
 */
const lineClass = "reveal-line";

/**
 * Splitting is a visual effect, so a reader who asked for less motion gets the
 * paragraph as written - one element, no wrappers, no aria shuffling. The
 * stylesheet's own reduced-motion rules then leave it alone.
 */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TextWipeLines() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    /**
     * SPLITTEXT ALONE - NO GSAP CORE, and that is a deliberate reading of the
     * plugin rather than a guess. Every reference to `gsap` inside SplitText is
     * guarded: registering the core swaps in `gsap.utils.toArray` and
     * `gsap.core.context`, and the file ships a complete fallback for the first
     * and a default for the second. Unregistered it self-registers against
     * `window.gsap`, finds nothing, and carries on. Nothing else in the file
     * dereferences it.
     *
     * The core would be dead weight because NOTHING HERE IS A GSAP ANIMATION.
     * The plugin splits the block and numbers the lines; every frame after that
     * is the stylesheet, off the wipe tokens the Style Guide authors. `onSplit`
     * returns nothing, so no timeline is ever created - which is also the only
     * reason the core is optional at all. Give this suite a GSAP tween and the
     * core comes back, and the axis loses its "no animation exists that the
     * Style Guide cannot author" guarantee with it.
     *
     * Loaded on demand for the same reason it is scoped: only the pages
     * carrying this one suite have any use for it, and hoisting the import
     * would ship the splitter to every page that never calls it.
     */
    let cancelled = false;
    const splits = new Map<Element, { revert: () => void }>();

    async function run() {
      const blocks = [
        ...document.querySelectorAll<HTMLElement>(
          `${frameSelector} ${blockSelector}`,
        ),
      ].filter((block) => !splits.has(block));

      if (blocks.length === 0) {
        return;
      }

      const { SplitText } = await import("gsap/SplitText");

      if (cancelled) {
        return;
      }

      for (const block of blocks) {
        if (splits.has(block)) {
          continue;
        }

        const split = SplitText.create(block, {
          type: "lines",
          /**
           * A clip box per line. The wipe insets its own clip path past the em
           * box so descenders survive, and `overflow: clip` on a mask would cut
           * exactly that allowance back off - `overflow-clip-margin` on the
           * mask class gives it back. See the note in `globals.css`.
           */
          mask: "lines",
          linesClass: lineClass,
          /** Re-splits on width and font-load changes, which is the whole
           *  reason to reach for this rather than hand-rolled Range walking. */
          autoSplit: true,
          /** Puts the original text on the block as an aria-label and hides the
           *  generated wrappers, so the statement is still one sentence to a
           *  screen reader. */
          aria: "auto",
          /**
           * Fires on every split INCLUDING the re-splits `autoSplit` triggers,
           * which is what makes the index survive a resize. A line's index is
           * its position after the current layout, not after the first one.
           */
          onSplit: (instance) => {
            instance.lines.forEach((line, index) => {
              (line as HTMLElement).style.setProperty(
                "--reveal-index",
                String(index),
              );
            });

            return undefined;
          },
        });

        splits.set(block, split);
      }
    }

    void run();

    /**
     * Blocks arrive after mount in the builder, and a section can be switched
     * ONTO this suite without its markup changing at all - which is why the
     * attribute is watched as well as the tree. Without the attribute half, a
     * section that was Rise when the page loaded would render unsplit lines the
     * moment someone chose Text wipe, and the control would appear to do
     * nothing.
     */
    const mutations = new MutationObserver(() => {
      void run();
    });

    mutations.observe(document.body, {
      attributeFilter: ["data-pagebuilder-animation"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      cancelled = true;
      mutations.disconnect();

      for (const split of splits.values()) {
        split.revert();
      }

      splits.clear();
    };
  }, []);

  return null;
}
