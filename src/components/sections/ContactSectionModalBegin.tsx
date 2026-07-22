"use client";

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
      className={`radius-button min-h-12 cursor-pointer border px-4 type-caption font-semibold transition-colors ${
        isSelected
          ? "border-service-accent bg-service-accent text-text-inverse"
          : "border-service-border bg-bg-page text-service-ink hover:border-service-accent hover:text-service-accent"
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
          <div className="fluid-type-frame">
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
            className="content-padding fluid-type-frame radius-medium grid card-grid-gap-med border border-service-border bg-service-surface shadow-service"
            onSubmit={(event) => {
              event.preventDefault();

              if (!systemType || !requestType) {
                return;
              }

              openRequestService({ requestType, systemType });
            }}
          >
            <fieldset className="grid card-grid-gap-sml">
              <legend className="type-text-sm mb-3 font-semibold text-service-ink">
                {systemPrompt}
              </legend>
              <div className="grid grid-cols-2 card-grid-gap-sml max-sm:grid-cols-1">
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

            <fieldset className="grid card-grid-gap-sml">
              <legend className="type-text-sm mb-3 font-semibold text-service-ink">
                {requestPrompt}
              </legend>
              <div className="grid grid-cols-2 card-grid-gap-sml max-sm:grid-cols-1">
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
                className="radius-button type-label min-h-12 cursor-pointer bg-service-accent px-6 text-text-inverse transition-colors hover:bg-bg-dark disabled:cursor-not-allowed disabled:bg-service-muted"
                disabled={!canContinue}
                type="submit"
              >
                {continueLabel}
              </button>
              <p className="type-caption text-center text-service-muted">
                {helperText}
              </p>
            </div>
          </form>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
