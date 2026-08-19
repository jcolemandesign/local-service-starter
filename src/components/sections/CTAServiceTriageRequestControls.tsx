"use client";

import { useState } from "react";
import {
  RequestServiceButton,
  type RequestServicePrefill,
} from "@/components/request-service";
import { buttonClassNames } from "@/components/primitives";

export type ServiceTriageChoice = {
  label: string;
  prefill: RequestServicePrefill;
};

type CTAServiceTriageRequestControlsProps = {
  action: string;
  choices: readonly ServiceTriageChoice[];
  icons: "on" | "off";
};

function choiceKey(choice: ServiceTriageChoice) {
  return `${choice.prefill.systemType}-${choice.prefill.requestType}`;
}

export function CTAServiceTriageRequestControls({
  action,
  choices,
  icons,
}: CTAServiceTriageRequestControlsProps) {
  const [selectedChoice, setSelectedChoice] =
    useState<ServiceTriageChoice | null>(null);
  const selectedKey = selectedChoice ? choiceKey(selectedChoice) : null;

  return (
    <>
      <div className="mt-7 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {choices.slice(0, 4).map((choice) => {
          const key = choiceKey(choice);
          const isSelected = key === selectedKey;

          return (
            <button
              aria-pressed={isSelected}
              className={buttonClassNames(
                "secondary",
                [
                  "w-full !px-3",
                  isSelected
                    ? "!border-service-accent !bg-service-accent !text-text-inverse"
                    : "!border-service-border !bg-bg-page !text-service-accent hover:!border-service-accent hover:!bg-bg-page",
                ].join(" "),
              )}
              key={key}
              onClick={() => setSelectedChoice(choice)}
              type="button"
            >
              {choice.label}
            </button>
          );
        })}
      </div>

      <RequestServiceButton
        className="mt-6 w-full disabled:cursor-not-allowed"
        disabled={!selectedChoice}
        prefill={selectedChoice?.prefill}
      >
        {action}
        {icons === "on" ? <span aria-hidden="true" className="ml-3">→</span> : null}
      </RequestServiceButton>
    </>
  );
}
