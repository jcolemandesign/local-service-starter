"use client";

import { useState } from "react";
import type { ButtonTreatment } from "@/components/primitives";
import {
  Button,
  Card,
  TextLiftButton,
  WrappingArrowButton,
} from "@/components/primitives";

type ButtonExample = {
  description: string;
  label: string;
  name: string;
  treatment: ButtonTreatment;
};

const buttonExamples: ButtonExample[] = [
  {
    description: "Default shared CTA for forms, heroes, and conversion rows.",
    label: "Standard primary",
    name: "standard-primary",
    treatment: "standard",
  },
  {
    description: "Default outline companion action for paired CTA groups.",
    label: "Standard secondary",
    name: "standard-secondary",
    treatment: "standard",
  },
  {
    description: "Expanding accent field with a wrapped arrow transition.",
    label: "Wrapping arrow",
    name: "wrapping-arrow",
    treatment: "wrapping-arrow",
  },
  {
    description: "Compact action with a vertical label lift on hover.",
    label: "Text lift",
    name: "text-lift",
    treatment: "text-lift",
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ButtonPreview({ example }: { example: ButtonExample }) {
  if (example.name === "standard-secondary") {
    return (
      <Button href="#" variant="secondary">
        View services
      </Button>
    );
  }

  if (example.treatment === "wrapping-arrow") {
    return (
      <WrappingArrowButton href="#">
        Schedule service
      </WrappingArrowButton>
    );
  }

  if (example.treatment === "text-lift") {
    return <TextLiftButton href="#">Book a visit</TextLiftButton>;
  }

  return <Button href="#">Request service</Button>;
}

export function StyleGuideButtonControls() {
  const [activeName, setActiveName] = useState(buttonExamples[0].name);
  const activeExample =
    buttonExamples.find((example) => example.name === activeName) ??
    buttonExamples[0];

  return (
    <div className="grid gap-5">
      <Card className="bg-service-surface p-5 shadow-none">
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Button controls</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Shared CTA treatments
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            Choose a treatment to inspect its shared radius, surface, hover, and
            focus behavior. New button ideas can be added to this same list.
          </p>
        </div>

        <div className="radius-medium mt-5 border border-service-border bg-white p-3">
          <div className="grid grid-cols-4 gap-2 max-lg:grid-cols-2 max-md:grid-cols-1">
            {buttonExamples.map((example) => {
              const isActive = example.name === activeExample.name;

              return (
                <button
                  aria-pressed={isActive}
                  className={cx(
                    "radius-button min-h-11 border px-3 py-2 text-center text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                    isActive
                      ? "border-service-accent bg-service-accent text-white"
                      : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
                  )}
                  key={example.name}
                  onClick={() => setActiveName(example.name)}
                  type="button"
                >
                  {example.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5 max-lg:grid-cols-1">
        <Card className="fluid-type-frame p-6 shadow-none">
          <p className="type-label text-service-accent">Active treatment</p>
          <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
            {activeExample.label}
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            {activeExample.description}
          </p>
          <code className="radius-button mt-5 inline-flex bg-service-surface px-3 py-2 text-xs font-semibold text-service-muted">
            {activeExample.name}
          </code>
        </Card>

        <Card className="p-6 shadow-none">
          <div className="radius-medium flex min-h-64 items-center justify-center border border-service-border bg-service-surface p-8">
            <ButtonPreview example={activeExample} />
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-none">
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Full set</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Standard and special buttons together
          </h3>
        </div>
        <div className="radius-medium mt-6 flex flex-wrap items-center justify-center gap-3 border border-service-border bg-service-surface p-6">
          <Button href="#">Request service</Button>
          <Button href="#" variant="secondary">
            View services
          </Button>
          <WrappingArrowButton href="#">Schedule service</WrappingArrowButton>
          <TextLiftButton href="#">Book a visit</TextLiftButton>
        </div>
      </Card>
    </div>
  );
}
