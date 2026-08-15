"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import {
  DownArrowIcon,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const accordionEase = [0.22, 1, 0.36, 1] as const;

type FAQItem = {
  answer: string;
  question: string;
};

type FAQAccordionSectionV3Props = {
  items: readonly FAQItem[];
};

export function FAQAccordionSectionV3({
  items,
}: FAQAccordionSectionV3Props) {
  const sectionId = useId();
  const shouldReduceMotion = useReducedMotion();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const answerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: accordionEase };

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
        <SevenColumnGridItem className="col-span-7 col-start-1">
          <div className="divide-y divide-service-border border-y border-service-border">
            {items.map((item, index) => {
              const isOpen = openItems.includes(item.question);
              const answerId = `${sectionId}-answer-${index}`;

              return (
                <article
                  className="faq-accordion-item fluid-type-frame"
                  key={item.question}
                >
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
      </SevenColumnGrid>
    </section>
  );
}
