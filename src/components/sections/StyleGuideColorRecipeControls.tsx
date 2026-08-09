"use client";

import { type ReactNode, useState } from "react";

import { DecisionSplitDecisionLargeSectionV3 } from "@/components/sections/DecisionSplitDecisionLargeSectionV3";
import { ServicesBentoCardsSectionV2 } from "@/components/sections/ServicesBentoCardsSectionV2";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";
import type {
  SectionCardBorder,
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import { useAvailableColorRecipes } from "@/utils/use-available-recipes";

type RecipeButtonProps = {
  id: SectionColorRecipe;
  isSelected: boolean;
  label: string;
  onSelect: (recipe: SectionColorRecipe) => void;
};

function RecipeButton({ id, isSelected, label, onSelect }: RecipeButtonProps) {
  return (
    <button
      aria-pressed={isSelected}
      className="group grid shrink-0 justify-items-center gap-2 text-service-muted transition-colors hover:text-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
      onClick={() => onSelect(id)}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`pagebuilder-paint-surface block size-14 rounded-full border shadow-service transition-transform group-hover:-translate-y-0.5 ${
          isSelected
            ? "border-service-accent ring-2 ring-service-accent ring-offset-2 ring-offset-bg-page"
            : "border-service-border"
        }`}
        data-pagebuilder-color-recipe={id}
        style={{ backgroundColor: "var(--recipe-ground)" }}
      />
      <span className="type-caption max-w-20 text-center">{label}</span>
    </button>
  );
}

function CardFillIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <rect
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.35 : 0}
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeDasharray={filled ? undefined : "3 2.5"}
        strokeWidth="1.75"
        width="18"
        x="3"
        y="5"
      />
    </svg>
  );
}

function CardBorderIcon({ bordered }: { bordered: boolean }) {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <rect
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeOpacity={bordered ? 1 : 0.25}
        strokeWidth={bordered ? "2.25" : "1.25"}
        width="18"
        x="3"
        y="5"
      />
    </svg>
  );
}

function PreviewSurfaceButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`flex size-14 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent ${
        active
          ? "border-service-accent bg-service-accent/10 text-service-accent ring-2 ring-service-accent ring-offset-2 ring-offset-bg-page"
          : "border-service-border text-service-muted hover:border-service-accent hover:text-service-ink"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function PreviewSectionFrame({
  cardBorder,
  cardFill,
  children,
  component,
  mode,
  paddingBottom = "default",
}: {
  cardBorder: SectionCardBorder;
  cardFill: SectionCardFill;
  children: ReactNode;
  component: string;
  mode: "Decision" | "Services";
  paddingBottom?: "default" | "none";
}) {
  return (
    <div
      className="pagebuilder-section-frame pagebuilder-paint-surface relative"
      data-pagebuilder-background-fill="solid"
      data-pagebuilder-background-treatment="none"
      data-pagebuilder-card-border={cardBorder}
      data-pagebuilder-card-fill={cardFill}
      data-pagebuilder-card-style="true"
      data-pagebuilder-color-recipe="inherit"
      data-pagebuilder-padding-bottom={paddingBottom}
      data-pagebuilder-padding-top="default"
      data-pagebuilder-section-component={component}
      data-pagebuilder-section-mode={mode}
    >
      {children}
    </div>
  );
}

export function StyleGuideColorRecipeControls() {
  const { draft } = useStyleGuideTokens();
  const availableRecipes = useAvailableColorRecipes({ accent: draft.ctaAccent });
  const [selectedRecipe, setSelectedRecipe] = useState<SectionColorRecipe>("page");
  const [cardFill, setCardFill] = useState<SectionCardFill>("solid");
  const [cardBorder, setCardBorder] = useState<SectionCardBorder>("on");
  const activeRecipe = availableRecipes.some(
    (recipe) => recipe.id === selectedRecipe,
  )
    ? selectedRecipe
    : availableRecipes[0]?.id ?? "page";

  const servicesContent = sectionLibraryV3Content.servicesBento;
  const decisionContent = sectionLibraryV3Content.decisionSplitDecisionLarge;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-label text-service-accent">Section recipe preview</p>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            Choose a section ground, then inspect the same two Pagebuilder
            layouts against its card, border, type, spacing, radius, and shadow tokens.
          </p>
        </div>
        <p className="type-caption rounded-full border border-service-border bg-bg-page px-3 py-1.5 text-service-muted">
          {availableRecipes.length} active recipes
        </p>
      </div>

      <div className="mt-5 flex gap-[var(--site-grid-gap)] overflow-x-auto px-1 pb-4 pt-1">
        <div aria-label="Preview color recipe" className="flex gap-[var(--site-grid-gap)]" role="group">
        {availableRecipes.map((recipe) => (
          <RecipeButton
            id={recipe.id}
            isSelected={recipe.id === activeRecipe}
            key={recipe.id}
            label={recipe.label}
            onSelect={setSelectedRecipe}
          />
        ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-l border-service-border pl-[var(--site-grid-gap)]">
          <div aria-label="Preview card fill" className="flex gap-2" role="group">
            <PreviewSurfaceButton
              active={cardFill === "solid"}
              label="Filled cards"
              onClick={() => setCardFill("solid")}
            >
              <CardFillIcon filled />
            </PreviewSurfaceButton>
            <PreviewSurfaceButton
              active={cardFill === "none"}
              label="Transparent cards"
              onClick={() => setCardFill("none")}
            >
              <CardFillIcon filled={false} />
            </PreviewSurfaceButton>
          </div>

          <div aria-label="Preview card border" className="flex gap-2" role="group">
            <PreviewSurfaceButton
              active={cardBorder === "on"}
              label="Card border on"
              onClick={() => setCardBorder("on")}
            >
              <CardBorderIcon bordered />
            </PreviewSurfaceButton>
            <PreviewSurfaceButton
              active={cardBorder === "off"}
              label="Card border off"
              onClick={() => setCardBorder("off")}
            >
              <CardBorderIcon bordered={false} />
            </PreviewSurfaceButton>
          </div>
        </div>
      </div>

      <div className="style-guide-demo-surface pagebuilder-density-normal mt-4 overflow-hidden rounded-[var(--radius-surface-token)] shadow-service">
        <div
          className="pagebuilder-section-band pagebuilder-paint-surface"
          data-pagebuilder-background-treatment="none"
          data-pagebuilder-color-recipe={activeRecipe}
        >
          <PreviewSectionFrame
            cardBorder={cardBorder}
            cardFill={cardFill}
            component="ServicesBentoCardsSectionV2"
            mode="Services"
          >
            <ServicesBentoCardsSectionV2
              {...servicesContent}
              cardBorder={cardBorder}
              cardFill={cardFill}
              items={servicesContent.items.slice(0, 2)}
              variant="split-header"
            />
          </PreviewSectionFrame>

          <PreviewSectionFrame
            cardBorder={cardBorder}
            cardFill={cardFill}
            component="DecisionSplitDecisionLargeSectionV3"
            mode="Decision"
          >
            <DecisionSplitDecisionLargeSectionV3
              {...decisionContent}
              cardBorder={cardBorder}
              cardFill={cardFill}
            />
          </PreviewSectionFrame>
        </div>
      </div>
    </div>
  );
}
