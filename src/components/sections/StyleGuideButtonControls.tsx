"use client";

import { Button, Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";
import {
  type ButtonStyleSlot,
  buttonStyleById,
  buttonStylesForSlot,
} from "@/content/button-styles";

/**
 * The button half of the Style Guide.
 *
 * WHAT CHANGED. This panel used to be a read-only showcase: four hard-coded
 * treatments, a picker that changed which one the preview pane rendered, and no
 * way for any of it to reach a page. Choosing "Text lift" here told you what
 * text lift looked like and nothing else - the site's buttons were whatever each
 * section had imported.
 *
 * It authors the real assignment now. Three slots, one style each, written into
 * the same draft colour, type, radii, spacing and motion write, promoted by the
 * same button into the same block in `globals.css`. The specimens below are
 * ordinary `<Button>`s reading the draft through inheritance, so what you are
 * looking at is the component every section renders rather than a mock of it.
 *
 * DERIVED FROM THE REGISTRY. Each slot's options are `buttonStylesForSlot`, so a
 * style added to `src/content/button-styles.ts` appears here with no edit to
 * this file - and a style can only be offered for a slot it declares.
 */

type SlotPanel = {
  slot: ButtonStyleSlot;
  label: string;
  description: string;
  /** The demo label, chosen to read as the kind of action the slot is for. */
  specimen: string;
};

const slotPanels: SlotPanel[] = [
  {
    slot: "primary",
    label: "Primary",
    description:
      "Every primary call to action on the site. This is the one that has to work on all eight colour recipes and at every size, so it is the slot to keep quiet.",
    specimen: "Request service",
  },
  {
    slot: "secondary",
    label: "Secondary",
    description:
      "The companion action beside a primary. Its job is to be available without competing, which is why the library offers no filled option here.",
    specimen: "View services",
  },
  {
    slot: "special",
    label: "Special CTA",
    description:
      "The one a section can ask for by switching Special CTA on in the builder. Nothing uses it until a section does, so this slot can afford more gesture than the other two.",
    specimen: "Schedule service",
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SlotControls({ panel }: { panel: SlotPanel }) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const activeId = draft.buttonStyleSelection[panel.slot];
  const options = buttonStylesForSlot(panel.slot);
  const activeStyle = buttonStyleById(activeId) ?? options[0];

  function selectStyle(id: string) {
    updateDraft("buttonStyleSelection", {
      ...draft.buttonStyleSelection,
      [panel.slot]: id,
    });
  }

  return (
    <Card className="style-guide-control-panel p-6 shadow-none">
      <div className="fluid-type-frame">
        <p className="type-label text-service-accent">Buttons</p>
        <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
          {panel.label}
        </h3>
        <p className="type-text-sm mt-heading-body-sm text-service-muted">
          {panel.description}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 max-lg:grid-cols-1">
        <div className="grid content-start gap-2">
          {options.map((style) => {
            const isActive = style.id === activeStyle?.id;

            return (
              <button
                aria-pressed={isActive}
                className={cx(
                  "radius-button min-h-11 border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                  isActive
                    ? "border-service-accent bg-service-accent text-white"
                    : "border-service-border bg-surface-raised text-service-ink hover:border-service-accent hover:text-service-accent",
                )}
                key={style.id}
                onClick={() => selectStyle(style.id)}
                type="button"
              >
                {style.label}
              </button>
            );
          })}
        </div>

        <div className="grid content-start gap-3">
          {/* The specimen sits on the raised surface rather than the panel's own
              ground so an outline style has something to be an outline against.
              It is a real Button: the slot's tokens reach it by inheritance from
              the live surface, exactly as they reach a section. */}
          <div className="radius-medium flex min-h-32 items-center justify-center border border-service-border bg-surface-raised p-6">
            <Button
              className={
                panel.slot === "special" ? "button-cta-special" : undefined
              }
              href="#"
              variant={panel.slot === "secondary" ? "secondary" : "primary"}
            >
              {panel.specimen}
            </Button>
          </div>

          <p className="type-text-sm text-service-muted">
            {activeStyle?.description}
          </p>
          <code className="radius-button inline-flex bg-service-surface px-3 py-2 text-xs font-semibold text-service-muted">
            {activeStyle?.id}
          </code>
        </div>
      </div>
    </Card>
  );
}

export function StyleGuideButtonControls({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="grid gap-5">
      {slotPanels.map((panel) => (
        <SlotControls key={panel.slot} panel={panel} />
      ))}

      {/* The three together, which is the only view that answers the question
          the slots cannot answer separately: whether the primary and the
          secondary read as a pair, and whether the special is distinguishable
          from the primary without shouting over it. */}
      <Card className={cx("p-6 shadow-none", compact && "hidden")}>
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Together</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            The assignment, side by side
          </h3>
        </div>
        <div className="radius-medium mt-6 flex flex-wrap items-center justify-center gap-3 border border-service-border bg-service-surface p-6">
          <Button href="#">Request service</Button>
          <Button href="#" variant="secondary">
            View services
          </Button>
          <Button className="button-cta-special" href="#">
            Schedule service
          </Button>
        </div>
      </Card>
    </div>
  );
}
