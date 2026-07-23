"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import {
  Button,
  DownArrowIcon,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const accordionEase = [0.22, 1, 0.36, 1] as const;

type FAQItem = {
  answer: string;
  question: string;
};

export type FAQAccordionSidebarAlign = "left" | "right";

type FAQAccordionSidebarSectionV3Props = {
  align?: FAQAccordionSidebarAlign;
  items: readonly FAQItem[];
  primaryAction: string;
  primaryActionHref?: string;
  subhead: string;
  title: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FAQAccordionSidebarSectionV3({
  align = "right",
  items,
  primaryAction,
  primaryActionHref = "/contact",
  subhead,
  title,
}: FAQAccordionSidebarSectionV3Props) {
  const sectionId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const answerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: accordionEase };
  // Both grid items get an explicit row-start-1: with align="left" the panel
  // (col-start-1) has an earlier column than the accordion even though the
  // accordion renders first in the DOM, and CSS grid's default sparse
  // auto-placement pushes a later item with an earlier column into a new row
  // instead of sharing row 1.
  const accordionPosition = align === "left" ? "col-start-4" : "col-start-1";
  const panelPosition = align === "left" ? "col-start-1" : "col-start-5";
  // At 7 columns there's no column to spare between the two blocks (unlike
  // layouts that offset a start column for breathing room), so add inner
  // padding on whichever edge of the accordion faces the panel instead.
  const accordionGutterClassName =
    align === "left" ? "pl-8 max-md:pl-0" : "pr-8 max-md:pr-0";

  function toggleItem(question: string) {
    setOpenItems((currentItems) =>
      currentItems.includes(question)
        ? currentItems.filter((item) => item !== question)
        : [...currentItems, question],
    );
  }

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          className={cx(
            "col-span-4 row-start-1",
            accordionPosition,
            accordionGutterClassName,
            "max-lg:col-span-5 max-lg:col-start-1 max-lg:row-auto max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <div className="divide-y divide-service-border border-y border-service-border">
            {items.map((item, index) => {
              const isOpen = openItems.includes(item.question);
              const answerId = `${sectionId}-answer-${index}`;

              return (
                <article className="fluid-type-frame" key={item.question}>
                  <h3>
                    <button
                      aria-controls={answerId}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center justify-between gap-8 py-8 text-left text-service-ink transition-colors hover:text-service-accent max-md:gap-5 max-md:py-6"
                      onClick={() => toggleItem(item.question)}
                      type="button"
                    >
                      <span className="type-heading-md">{item.question}</span>
                      <span
                        aria-hidden="true"
                        className={`radius-medium flex size-12 shrink-0 items-center justify-center border border-service-border text-service-accent transition-transform max-md:size-11 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <DownArrowIcon className="size-5" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        id={answerId}
                        initial={{ height: 0, opacity: 0 }}
                        transition={answerTransition}
                      >
                        <div className="type-text-md wrap-pretty pb-8 text-service-muted max-md:pb-6">
                          {item.answer}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className={cx(
            "col-span-3 row-start-1",
            panelPosition,
            "max-lg:col-span-5 max-lg:col-start-1 max-lg:row-auto max-lg:mt-12 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <article className="fluid-type-frame rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-service-ink shadow-service max-md:p-6">
            <h2 className="type-heading-lg wrap-pretty text-service-ink">
              {title}
            </h2>
            <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
              {subhead}
            </p>
            <div className="mt-body-actions-md">
              <Button href={primaryActionHref}>{primaryAction}</Button>
            </div>
          </article>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
