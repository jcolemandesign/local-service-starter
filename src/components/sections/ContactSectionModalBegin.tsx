"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import {
  requestServiceRequestOptions,
  requestServiceSystemOptions,
  type RequestServiceRequestType,
  type RequestServiceSystemType,
  useRequestService,
} from "@/components/request-service";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

type ContactSectionModalBeginProps = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  continueLabel: string;
  eyebrow: string;
  helperText: string;
  requestPrompt: string;
  systemPrompt: string;
  title: string;
};

function SelectionButton({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      className={`radius-button min-h-12 cursor-pointer border px-4 type-caption font-semibold transition-colors disabled:cursor-not-allowed ${
        isSelected
          ? "border-service-accent bg-service-accent text-text-inverse"
          : "border-service-border bg-surface-raised text-service-ink hover:border-service-accent hover:text-service-accent disabled:hover:border-service-border disabled:hover:text-service-ink"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function ContactSectionModalBegin({
  body,
  cardBorder = "on",
  cardFill = "solid",
  continueLabel,
  eyebrow,
  helperText,
  requestPrompt,
  systemPrompt,
  title,
}: ContactSectionModalBeginProps) {
  const { openRequestService } = useRequestService();
  const [systemType, setSystemType] = useState<
    RequestServiceSystemType | ""
  >("");
  const [requestType, setRequestType] = useState<
    RequestServiceRequestType | ""
  >("");
  const canContinue = Boolean(systemType && requestType);

  return (
    <section className="bg-bg-page" id="contact">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem className="col-span-6 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          <div
            className="reveal-on-scroll reveal-role-heading fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem className="col-span-6 col-start-8 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          <form
            className={[
              // The form panel is one unit. An entrance moves the panel as it
              // arrives and never touches the selection state inside it.
              "reveal-on-scroll reveal-role-action",
              "content-padding fluid-type-frame radius-medium grid card-grid-gap-med border border-service-border bg-service-surface shadow-service",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--reveal-index": 1 } as CSSProperties}
            onSubmit={(event) => {
              event.preventDefault();

              if (!systemType || !requestType) {
                return;
              }

              openRequestService({ requestType, systemType });
            }}
          >
            {/* `card-grid-gap-sml` is not small - all three card gap utilities
              * resolve to the same 2.25rem - so the option rows were spaced
              * like cards rather than like a control. Plain `gap-3` between the
              * answers instead.
              *
              * The space under each prompt is a margin on the `legend` and has
              * to be: a legend is not a grid item, so the fieldset's own `gap`
              * skips straight past it and the buttons end up against the
              * prompt. */}
            <fieldset className="grid gap-4">
              <legend className="type-heading-sm mb-4 text-service-ink">
                {systemPrompt}
              </legend>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {requestServiceSystemOptions.map((option) => (
                  <SelectionButton
                    isSelected={systemType === option.value}
                    key={option.value}
                    label={option.label}
                    onClick={() => setSystemType(option.value)}
                  />
                ))}
              </div>
            </fieldset>

            {/* Held shut until the system is chosen. The two questions are a
              * sequence, not a pair - what you need done only makes sense once
              * it is heating or cooling - and answering them out of order was
              * possible but meaningless. `disabled` on the fieldset takes every
              * button inside it out of the tab order too, so the dimming is not
              * just paint. */}
            <fieldset
              className={[
                "grid gap-4 transition-opacity",
                // Conditional rather than the `disabled:` variant, so the
                // dimming is stated in the same place as the gate it reflects
                // and does not rely on a variant resolving.
                systemType ? "opacity-100" : "opacity-45",
              ].join(" ")}
              disabled={!systemType}
            >
              <legend className="type-heading-sm mb-4 text-service-ink">
                {requestPrompt}
              </legend>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {requestServiceRequestOptions.map((option) => (
                  <SelectionButton
                    isSelected={requestType === option.value}
                    key={option.value}
                    label={option.label}
                    onClick={() => setRequestType(option.value)}
                  />
                ))}
              </div>
            </fieldset>

            <div className="grid gap-3">
              <button
                // Disabled dims the whole button rather than swapping the fill
                // to service-muted: that is a text token, and the dark/accent
                // recipes remap it to a near-white so the white label vanished
                // into it. Fading label and fill together keeps the contrast
                // ratio intact in every recipe.
                className="radius-button type-label min-h-12 cursor-pointer bg-service-accent px-6 text-text-inverse transition-colors hover:bg-bg-dark disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canContinue}
                type="submit"
              >
                {continueLabel}
              </button>
              {/* `mx-auto` is the part that centres it. `type-caption` carries
                * a max-width measure of its own, so the paragraph is narrower
                * than the button above it; `text-center` only centred the words
                * inside that narrower box, which still sat against the left
                * edge of the column. */}
              <p className="type-caption mx-auto text-center text-service-muted">
                {helperText}
              </p>
            </div>
          </form>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
