"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import {
  Container,
  DownArrowIcon,
  Section,
  SectionHeading,
} from "@/components/primitives";

const accordionEase = [0.22, 1, 0.36, 1] as const;

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: FAQItem[];
};

export function FAQAccordionSection({
  eyebrow,
  title,
  body,
  items,
}: FAQAccordionSectionProps) {
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
    <Section className="bg-white">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          align="center"
        />

        <div className="mx-auto mt-16 max-w-6xl divide-y divide-service-border border-y border-service-border max-md:mt-12">
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.question);
            const answerId = `${sectionId}-answer-${index}`;

            return (
              <article key={item.question}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-8 py-8 text-left text-2xl font-semibold leading-tight text-service-ink transition-colors hover:text-service-accent max-md:gap-5 max-md:py-6 max-md:text-xl"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleItem(item.question)}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-md border border-service-border text-service-accent transition-transform max-md:size-9 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <DownArrowIcon className="size-4" />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={answerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={answerTransition}
                      className="overflow-hidden"
                    >
                      <div className="max-w-3xl pb-8 text-base leading-7 text-service-muted max-md:pb-6">
                        {item.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
