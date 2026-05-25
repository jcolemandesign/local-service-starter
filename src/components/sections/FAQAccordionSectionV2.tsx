"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

const accordionEase = [0.22, 1, 0.36, 1] as const;

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: FAQItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FAQAccordionSectionV2({
  eyebrow,
  title,
  body,
  items,
}: FAQAccordionSectionV2Props) {
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
    <section className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site">
        <div className={cx("fluid-type-frame", "mx-auto max-w-4xl text-center")}>
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-xl",
              "measure-heading-wide",
              "wrap-balance",
              "mx-auto mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
              "mx-auto mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl divide-y divide-service-border border-y border-service-border max-md:mt-12">
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.question);
            const answerId = `${sectionId}-answer-${index}`;

            return (
              <article className="fluid-type-frame" key={item.question}>
                <h3>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between gap-8 py-8 text-left text-service-ink transition-colors hover:text-service-accent max-md:gap-5 max-md:py-6"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleItem(item.question)}
                  >
                    <span
                      className={cx(
                        "type-heading-md",
                        "measure-heading-wide",
                        "wrap-balance",
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cx(
                        "radius-medium",
                        "flex size-10 shrink-0 items-center justify-center border border-service-border text-lg font-semibold leading-none text-service-accent max-md:size-9",
                      )}
                      aria-hidden="true"
                    >
                      {isOpen ? "^" : "v"}
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
                      <div
                        className={cx(
                          "type-text-md",
                          "measure-copy",
                          "wrap-pretty",
                          "pb-8 text-service-muted max-md:pb-6",
                        )}
                      >
                        {item.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
