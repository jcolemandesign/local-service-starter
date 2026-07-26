"use client";

import { useState } from "react";
import {
  requestServiceRequestOptions,
  requestServiceSystemOptions,
  type RequestServiceRequestType,
  type RequestServiceSystemType,
  useRequestService,
} from "@/components/request-service";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

export type ContentFixedCoverFadeFormMode = "modal-prefill" | "regular";

type ContentFixedCoverFadeSectionV2Props = {
  backgroundEyebrow: string;
  backgroundTitle: string;
  backgroundBody: string;
  backgroundLabel: string;
  foregroundEyebrow: string;
  foregroundTitle: string;
  foregroundBody: string;
  formMode?: ContentFixedCoverFadeFormMode;
  items: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function hasVisibleCopy(value: string) {
  return value.trim().toLowerCase() !== "[omit]";
}

function BackgroundTexture({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} background placeholder`}
      className="absolute inset-0 overflow-hidden bg-bg-dark"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.35),rgb(23_33_29_/_0.02)),linear-gradient(45deg,rgb(255_255_255_/_0.14)_0_1px,transparent_1px_22px)]" />
      <div className="absolute inset-0 bg-service-accent/15" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-dark via-bg-dark/65 to-transparent" />
      <span className="type-label absolute bottom-[var(--site-grid-inset-block)] left-[var(--site-grid-inset-inline)] text-white/55">
        {label}
      </span>
    </div>
  );
}

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

function ModalPrefillForm() {
  const { openRequestService } = useRequestService();
  const [systemType, setSystemType] = useState<RequestServiceSystemType | "">("");
  const [requestType, setRequestType] = useState<RequestServiceRequestType | "">("");
  const canContinue = Boolean(systemType && requestType);

  return (
    <form
      className="fluid-type-frame radius-medium ml-auto grid w-full max-w-4xl card-grid-gap-med border border-service-border bg-service-surface p-8 shadow-service max-lg:ml-0 max-md:p-6"
      onSubmit={(event) => {
        event.preventDefault();

        if (systemType && requestType) {
          openRequestService({ requestType, systemType });
        }
      }}
    >
      <fieldset className="grid card-grid-gap-sml">
        <legend className="type-text-sm mb-3 font-semibold text-service-ink">
          What type of system do you need help with?
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
          What can we help with?
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
      <button
        className="radius-button type-label min-h-12 cursor-pointer bg-service-accent px-6 text-text-inverse transition-colors hover:bg-bg-dark disabled:cursor-not-allowed disabled:bg-service-muted"
        disabled={!canContinue}
        type="submit"
      >
        Continue request
      </button>
    </form>
  );
}

export function ContentFixedCoverFadeSectionV2({
  backgroundTitle,
  backgroundBody,
  backgroundLabel,
  foregroundEyebrow,
  foregroundTitle,
  foregroundBody,
  formMode = "regular",
  items,
}: ContentFixedCoverFadeSectionV2Props) {
  return (
    <section className="relative min-h-[200svh] bg-bg-page">
      <div className="sticky top-0 section-min-screen overflow-hidden text-white">
        <BackgroundTexture label={backgroundLabel} />
        <SevenColumnGrid className="relative z-10">
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-6 max-lg:col-span-7"
          >
            <div className="fluid-type-frame w-full">
              <h2 className="type-display-lg text-white">
                {backgroundTitle}
              </h2>
              <p className="type-text-xl measure-longform wrap-pretty mt-display-body text-white/72">
                {backgroundBody}
              </p>
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </div>

      <div className="relative z-10 bg-bg-page text-service-ink shadow-[0_-32px_90px_rgb(23_33_29_/_0.18)]">
        <SevenColumnGrid className="section-min-screen">
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 max-lg:col-span-7"
          >
            <div className="fluid-type-frame">
              {hasVisibleCopy(foregroundEyebrow) ? (
                <p className="type-label text-service-accent">
                  {foregroundEyebrow}
                </p>
              ) : null}
              <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {foregroundTitle}
              </h3>
              <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-service-muted">
                {foregroundBody}
              </p>
              <ul className="mt-body-actions-md grid card-grid-gap-sml">
                {items.map((item) => (
                  <li
                    className="type-text-sm border-l border-service-border pl-4 font-semibold text-service-ink"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SevenColumnGridItem>

          <SevenColumnGridItem
            alignY="middle"
            className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          >
            {formMode === "modal-prefill" ? <ModalPrefillForm /> : <form className="fluid-type-frame radius-medium ml-auto grid w-full max-w-4xl card-grid-gap-med border border-service-border bg-service-surface p-8 shadow-service max-lg:ml-0 max-md:p-6">
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Name
                <input
                  className={cx(
                    "radius-4",
                    "min-h-12 w-full border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Jane Smith"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Service needed
                <input
                  className={cx(
                    "radius-4",
                    "min-h-12 w-full border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Repair, installation, maintenance"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  "type-text-sm",
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Message
                <textarea
                  className={cx(
                    "radius-4",
                    "min-h-36 w-full border border-service-border bg-bg-page px-4 py-3 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Briefly describe the issue"
                />
              </label>
              <button
                className={cx(
                  "radius-button",
                  "type-label",
                  "min-h-12 cursor-pointer bg-service-accent px-6 text-white transition-colors hover:bg-bg-dark",
                )}
                type="button"
              >
                Request service
              </button>
            </form>}
          </SevenColumnGridItem>
        </SevenColumnGrid>

      </div>
    </section>
  );
}
