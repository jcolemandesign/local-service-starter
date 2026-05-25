import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button, Card, Container, Section } from "@/components/primitives";
import styles from "./type-test.module.css";

export const metadata: Metadata = {
  title: "Type Test",
  description:
    "Internal typography hierarchy, text measure, and wrapping test page.",
};

const typeSamples = [
  {
    name: "display-xl",
    details: "clamp(4rem, 7vw, 7rem) / 0.95 / 650",
    text: "Emergency repairs without delay",
  },
  {
    name: "display-lg",
    details: "clamp(3.25rem, 5.4vw, 5.5rem) / 0.98 / 650",
    text: "Fast HVAC service without the runaround",
  },
  {
    name: "heading-xl",
    details: "clamp(2.75rem, 4.2vw, 4.5rem) / 1.02 / 650",
    text: "Same-day comfort when your system quits",
  },
  {
    name: "heading-lg",
    details: "clamp(2.25rem, 3.3vw, 3.5rem) / 1.06 / 650",
    text: "Repairs, tune-ups, and replacements",
  },
  {
    name: "heading-md",
    details: "clamp(1.75rem, 2.3vw, 2.5rem) / 1.12 / 650",
    text: "Clear options before work begins",
  },
  {
    name: "heading-sm",
    details: "clamp(1.35rem, 1.7vw, 1.75rem) / 1.18 / 650",
    text: "Air conditioning repair",
  },
  {
    name: "text-xl",
    details: "1.375rem / 1.55 / 400",
    text: "Priority scheduling for urgent heating and cooling problems.",
  },
  {
    name: "text-lg",
    details: "1.125rem / 1.65 / 400",
    text: "Book service online and get a fast response from a local technician.",
  },
  {
    name: "text-md",
    details: "1rem / 1.65 / 400",
    text: "Every request is saved, organized, and sent directly to the business owner.",
  },
  {
    name: "text-sm",
    details: "0.875rem / 1.55 / 400",
    text: "Serving Huntersville, Cornelius, Davidson, and North Charlotte.",
  },
  {
    name: "eyebrow",
    details: "0.75rem / 1.2 / 700 / uppercase",
    text: "Emergency HVAC Repair",
  },
  {
    name: "caption",
    details: "0.75rem / 1.45 / 500",
    text: "Most appointments confirmed within one business hour.",
  },
  {
    name: "label",
    details: "0.875rem / 1.2 / 700",
    text: "Service Area",
  },
] as const;

const measureSamples = [
  {
    name: "measure-tight",
    details: "max-width: 12ch",
    className: styles["measure-tight"],
    text: "Short labels break quickly.",
  },
  {
    name: "measure-heading",
    details: "max-width: 18ch",
    className: styles["measure-heading"],
    text: "Fast HVAC service without the runaround",
  },
  {
    name: "measure-heading-wide",
    details: "max-width: 24ch",
    className: styles["measure-heading-wide"],
    text: "Same-day repairs when your system quits",
  },
  {
    name: "measure-copy",
    details: "max-width: 60ch",
    className: styles["measure-copy"],
    text: "Request service online, describe the issue, and get a fast response from a local technician serving your neighborhood.",
  },
  {
    name: "measure-copy-wide",
    details: "max-width: 70ch",
    className: styles["measure-copy-wide"],
    text: "Every submission is saved, organized, and sent directly to the business owner so fewer leads slip through the cracks.",
  },
  {
    name: "measure-longform",
    details: "max-width: 75ch",
    className: styles["measure-longform"],
    text: "Use this longer measure for editorial sections where the reader needs a little more room before the line returns.",
  },
] as const;

const headingWidths = ["10ch", "12ch", "14ch", "16ch", "18ch", "22ch", "26ch"];
const bodyWidths = ["45ch", "55ch", "60ch", "65ch", "70ch", "75ch"];
const bodyWrapModes = [
  {
    label: "Default wrap",
    className: undefined,
    textClassName: undefined,
    note: "No text-wrap helper",
  },
  {
    label: "Pretty wrap",
    className: styles.pretty,
    textClassName: cx("max-w-[60ch]", styles["fluid-copy-after-60ch"]),
    note: "text-wrap: pretty + 60ch + fluid scale",
  },
  {
    label: "Balanced wrap",
    className: styles.balance,
    textClassName: undefined,
    note: "text-wrap: balance",
  },
] as const;

const headingText = "Fast HVAC service without the runaround";
const bodyText =
  "Request service online, describe the issue, and get a fast response from a local technician. Every submission is saved, organized, and sent directly to the business owner so fewer leads slip through the cracks.";

const spacingTests = [
  {
    label: "Tight",
    eyebrowGap: "mb-2",
    bodyGap: "mt-4",
    buttonGap: "mt-8",
  },
  {
    label: "Default",
    eyebrowGap: "mb-4",
    bodyGap: "mt-5",
    buttonGap: "mt-10",
  },
  {
    label: "Loose",
    eyebrowGap: "mb-6",
    bodyGap: "mt-8",
    buttonGap: "mt-14",
  },
] as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PageIntro({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mb-12 max-w-4xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
        {kicker}
      </p>
      <h2
        className={cx(
          "mt-4 text-fluid-heading font-semibold leading-heading text-service-ink",
          styles.balance,
        )}
      >
        {title}
      </h2>
      <p className={cx("mt-5 max-w-3xl text-lg leading-8 text-service-muted", styles.pretty)}>
        {body}
      </p>
    </div>
  );
}

function TokenLabel({ name, details }: { name: string; details: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-service-border pb-4">
      <p className="font-mono text-sm font-semibold text-service-ink">{name}</p>
      <p className="font-mono text-xs text-service-muted">{details}</p>
    </div>
  );
}

function WidthCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 shadow-none">
      <p className="mb-5 font-mono text-xs font-semibold uppercase text-service-muted">
        {label}
      </p>
      {children}
    </Card>
  );
}

export default function TypeTestPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <section className="border-b border-service-border bg-white py-20 max-lg:py-16 max-md:py-12">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
            Internal style guide
          </p>
          <h1
            className={cx(
              "mt-5 max-w-[18ch] text-fluid-hero font-semibold leading-heading text-service-ink",
              styles.balance,
            )}
          >
            Typography, measure, and wrap tests
          </h1>
          <p className={cx("mt-6 max-w-[65ch] text-lg leading-8 text-service-muted", styles.pretty)}>
            A throwaway page for checking how local service copy behaves across
            heading scales, ch-based line lengths, and browser text wrapping
            support.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <PageIntro
            kicker="Type hierarchy"
            title="Type Hierarchy Samples"
            body="Temporary local tokens for comparing scale, weight, line height, and text texture before deciding what belongs in the shared system."
          />
          <div className="grid grid-cols-1 gap-5">
            {typeSamples.map((sample) => (
              <Card key={sample.name} className="p-6 shadow-none">
                <TokenLabel name={sample.name} details={sample.details} />
                <p
                  className={cx(
                    styles[sample.name],
                    styles.balance,
                    sample.name.startsWith("text") ? styles.pretty : undefined,
                    "text-service-ink",
                  )}
                >
                  {sample.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <PageIntro
            kicker="Text measure"
            title="Measure Token Samples"
            body="These scoped measure classes make it easier to compare short labels, narrow headings, comfortable body copy, and longform text blocks."
          />
          <div className="grid grid-cols-1 gap-5">
            {measureSamples.map((sample) => (
              <Card key={sample.name} className="p-6 shadow-none">
                <TokenLabel name={sample.name} details={sample.details} />
                <p
                  className={cx(
                    sample.className,
                    styles.pretty,
                    "text-lg leading-8 text-service-muted",
                  )}
                >
                  {sample.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <PageIntro
            kicker="Heading wraps"
            title="Heading Measure Tests"
            body="The same heading is repeated across narrow and wider ch values with balanced wrapping enabled."
          />
          <div className="grid grid-cols-1 gap-5">
            {headingWidths.map((width) => (
              <WidthCard key={width} label={width}>
                <h3
                  className={cx(
                    "text-4xl font-semibold leading-heading text-service-ink max-md:text-3xl",
                    styles.balance,
                  )}
                  style={{ maxWidth: width } as CSSProperties}
                >
                  {headingText}
                </h3>
              </WidthCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <PageIntro
            kicker="Body copy"
            title="Body Copy Measure Tests"
            body="The same paragraph is repeated across common body-copy measures with pretty wrapping enabled where the browser supports it."
          />
          <div className="grid grid-cols-1 gap-5">
            {bodyWidths.map((width) => (
              <WidthCard key={width} label={width}>
                <p
                  className={cx("text-base leading-7 text-service-muted", styles.pretty)}
                  style={{ maxWidth: width } as CSSProperties}
                >
                  {bodyText}
                </p>
              </WidthCard>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <PageIntro
            kicker="Body copy"
            title="Body Copy Wrap Assist Tests"
            body="The same paragraph is repeated without ch-based max-widths to compare native wrapping against pretty and balanced wrapping."
          />
          <div className="grid grid-cols-1 gap-5">
            {bodyWrapModes.map((mode) => (
              <div key={mode.label} className={styles["fluid-copy-frame"]}>
                <WidthCard label={mode.note}>
                <p className="mb-4 font-mono text-xs font-semibold uppercase text-service-muted">
                  {mode.label}
                </p>
                <p
                  className={cx(
                    "text-base leading-7 text-service-muted",
                    mode.className,
                    mode.textClassName,
                  )}
                >
                  {bodyText}
                </p>
                </WidthCard>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <PageIntro
            kicker="Spacing rhythm"
            title="Section Header Spacing Tests"
            body="Three versions of the same conversion block compare the relationship between eyebrow, heading, body copy, and actions."
          />
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {spacingTests.map((test) => (
              <Card key={test.label} className="p-8 shadow-none">
                <p className="mb-8 font-mono text-xs font-semibold uppercase text-service-muted">
                  {test.label}
                </p>
                <p
                  className={cx(
                    "text-sm font-semibold uppercase tracking-widest text-service-accent",
                    test.eyebrowGap,
                  )}
                >
                  Emergency HVAC Repair
                </p>
                <h3
                  className={cx(
                    "max-w-[16ch] text-4xl font-semibold leading-heading text-service-ink max-md:text-3xl",
                    styles.balance,
                  )}
                >
                  Same-day repairs when your system quits
                </h3>
                <p
                  className={cx(
                    "max-w-[56ch] text-lg leading-8 text-service-muted",
                    styles.pretty,
                    test.bodyGap,
                  )}
                >
                  Get fast help from licensed technicians serving Huntersville,
                  Cornelius, Davidson, and North Charlotte.
                </p>
                <div className={cx("flex flex-wrap gap-3", test.buttonGap)}>
                  <Button href="#schedule">Schedule Now</Button>
                  <Button href="#call" variant="secondary">
                    Call Today
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-service-ink text-white">
        <Container>
          <div className="max-w-none">
            <p className={cx(styles.eyebrow, "text-white/60")}>
              Full Width Editorial Block
            </p>
            <h2
              className={cx(
                styles["display-xl"],
                styles.balance,
                "mt-7 max-w-[24ch] text-white",
              )}
            >
              A quieter way to explain local service work
            </h2>
            <p
              className={cx(
                styles["text-xl"],
                styles.pretty,
                "mt-8 max-w-[68ch] text-white/72",
              )}
            >
              The best service pages do not need to shout. They need to make a
              homeowner feel oriented: what is happening, what comes next, who
              is showing up, and why the company can be trusted inside the home.
            </p>

            <div className="mt-16 border-y border-white/15 py-10">
              <p className={cx(styles.caption, "max-w-[75ch] text-white/55")}>
                Editorial texture test: full content width container, one
                column, varied type hierarchy, long-form paragraph rhythm, and
                enough vertical spacing to judge whether this could become a
                reusable content pattern later.
              </p>
            </div>

            <div className="mt-16 max-w-[75ch] space-y-9">
              <h3
                className={cx(
                  styles["heading-lg"],
                  styles.balance,
                  "max-w-[21ch] text-white",
                )}
              >
                Start with the moment the customer is actually in
              </h3>
              <p
                className={cx(
                  styles["text-lg"],
                  styles.pretty,
                  "max-w-[45ch] text-white/70",
                )}
              >
                When a heating system quits on a cold morning, the customer is
                not looking for a brand manifesto. They are trying to understand
                whether someone can come soon, whether the visit will be clear,
                and whether they will be pressured into a decision before they
                know what is wrong.
              </p>
              <p className={cx(styles["text-md"], styles.pretty, "text-white/64")}>
                That changes the job of the page. The headline should carry the
                promise plainly. Supporting copy should lower the temperature.
                Details should answer the next practical question before it has
                to be asked.
              </p>
            </div>

            <blockquote className="mt-16 max-w-[70ch] border-l-4 border-service-accent pl-8 max-md:pl-5">
              <p
                className={cx(
                  styles["heading-md"],
                  styles.balance,
                  "text-white",
                )}
              >
                Clear service copy creates confidence by making the next step
                feel obvious.
              </p>
              <p className={cx(styles.label, "mt-6 text-white/50")}>
                Messaging note
              </p>
            </blockquote>

            <div className="mt-16 grid grid-cols-[0.85fr_1.15fr] gap-12 max-lg:grid-cols-1">
              <div>
                <p className={cx(styles.label, "text-service-accent")}>
                  What this block is testing
                </p>
                <h3
                  className={cx(
                    styles["heading-sm"],
                    styles.balance,
                    "mt-4 max-w-[18ch] text-white",
                  )}
                >
                  Whether hierarchy still works without cards
                </h3>
              </div>
              <div className="max-w-[72ch] space-y-6">
                <p className={cx(styles["text-md"], styles.pretty, "text-white/66")}>
                  The section uses a large display headline, an oversized lead
                  paragraph, small captions, mid-sized subheads, body copy, a
                  pullquote, and labels in a single vertical flow. It should
                  show whether the type system has enough contrast when the
                  layout is not doing much decorative work.
                </p>
                <p className={cx(styles["text-sm"], styles.pretty, "text-white/52")}>
                  If the page feels too heavy here, the display scale may be
                  too large for editorial content. If everything feels flat, the
                  body and subhead relationship likely needs more contrast.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <PageIntro
            kicker="Real copy"
            title="Real Page Copy Examples"
            body="Miniature section patterns using HVAC/local service copy to reveal whether the scale, measure, and spacing choices hold up in context."
          />
          <div className="grid grid-cols-[1.35fr_0.8fr_0.85fr] gap-5 max-lg:grid-cols-1">
            <Card className="p-10 shadow-none max-md:p-7">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-service-accent">
                Huntersville HVAC Service
              </p>
              <h3
                className={cx(
                  styles["display-lg"],
                  styles.balance,
                  "max-w-[18ch] text-service-ink",
                )}
              >
                Reliable comfort when the weather turns
              </h3>
              <p
                className={cx(
                  "mt-6 max-w-[62ch] text-lg leading-8 text-service-muted",
                  styles.pretty,
                )}
              >
                Get repairs, tune-ups, and replacement guidance from a local
                team that explains the problem clearly before work begins.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#schedule">Schedule Service</Button>
                <Button href="#estimate" variant="secondary">
                  Request Estimate
                </Button>
              </div>
            </Card>

            <Card className="p-8 shadow-none">
              <p className="mb-4 font-mono text-xs font-semibold uppercase text-service-muted">
                Service card
              </p>
              <h3
                className={cx(
                  styles["heading-sm"],
                  styles.balance,
                  "max-w-[18ch] text-service-ink",
                )}
              >
                AC repair that gets the house cooling again
              </h3>
              <p className={cx("mt-4 text-base leading-7 text-service-muted", styles.pretty)}>
                From warm air to frozen coils, get a clear diagnosis and a
                practical repair plan.
              </p>
              <a
                href="#ac-repair"
                className="mt-6 inline-flex text-sm font-semibold text-service-accent hover:text-service-ink"
              >
                Explore AC repair
              </a>
            </Card>

            <Card className="p-8 shadow-none">
              <p className="mb-4 font-mono text-xs font-semibold uppercase text-service-muted">
                FAQ item
              </p>
              <h3
                className={cx(
                  styles["heading-sm"],
                  styles.balance,
                  "max-w-[20ch] text-service-ink",
                )}
              >
                How quickly can you come out for an emergency?
              </h3>
              <p className={cx("mt-4 text-base leading-7 text-service-muted", styles.pretty)}>
                During normal service hours, urgent heating and cooling issues
                are prioritized and confirmed as quickly as the schedule allows.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
