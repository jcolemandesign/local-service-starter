import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, Card, Section } from "@/components/primitives";
import styles from "./type-hierarchy-test.module.css";

export const metadata: Metadata = {
  title: "Type Hierarchy Test",
  description:
    "Internal responsive typography hierarchy experiment with ch measures and fluid scaling.",
};

const bodyParagraph =
  "Request service online, describe the issue, and get a fast response from a local technician. Every submission is saved, organized, and sent directly to the business owner so fewer leads slip through the cracks.";

const roles = [
  {
    label: "caption",
    typeClass: styles["fluid-caption"],
    measureClass: styles["measure-caption"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 48ch",
    range: "0.75rem - 0.8125rem / 48rem - 80rem",
    sample:
      "Most appointments are confirmed within one business hour, with arrival updates sent as soon as the schedule is set.",
  },
  {
    label: "text-xs",
    typeClass: styles["fluid-text-xs"],
    measureClass: styles["measure-caption"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 48ch",
    range: "0.8125rem - 0.875rem / 48rem - 80rem",
    sample:
      "Serving Huntersville, Cornelius, Davidson, Mooresville, and North Charlotte with repair visits, seasonal tune-ups, and replacement guidance.",
  },
  {
    label: "text-sm",
    typeClass: styles["fluid-text-sm"],
    measureClass: styles["measure-copy-wide"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 70ch",
    range: "0.875rem - 0.95rem / 45rem - 80rem",
    sample:
      "Useful supporting details should stay compact while still giving homeowners enough context to understand what happens after they request service.",
  },
  {
    label: "text-md / body",
    typeClass: styles["fluid-text-md"],
    measureClass: styles["measure-copy"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 60ch",
    range: "1rem - 1.125rem / 40rem - 80rem",
    sample: bodyParagraph,
  },
  {
    label: "text-lg",
    typeClass: styles["fluid-text-lg"],
    measureClass: styles["measure-copy"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 60ch",
    range: "1.0625rem - 1.25rem / 36rem - 80rem",
    sample:
      "This larger paragraph style can support intro copy, important explanatory text, and short editorial passages where the page needs a little more voice without becoming a headline.",
  },
  {
    label: "text-xl / lead",
    typeClass: styles["fluid-text-xl"],
    measureClass: styles["measure-lead"],
    wrapClass: styles["wrap-pretty"],
    measure: "max-width: 60ch",
    range: "1.1875rem - 1.5rem / 30rem - 80rem",
    sample:
      "Lead copy should feel clearly larger than body copy while staying readable across multiple lines, especially in hero sections and high-priority conversion areas.",
  },
  {
    label: "heading-sm",
    typeClass: styles["fluid-heading-sm"],
    measureClass: styles["measure-heading-wide"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 28ch",
    range: "1.125rem - 1.375rem / 28rem - 76rem",
    sample: "Air conditioning repair that gets the house cooling again",
  },
  {
    label: "heading-md",
    typeClass: styles["fluid-heading-md"],
    measureClass: styles["measure-heading-wide"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 28ch",
    range: "1.375rem - 2rem / 28rem - 76rem",
    sample: "Clear options before any repair work begins",
  },
  {
    label: "heading-lg",
    typeClass: styles["fluid-heading-lg"],
    measureClass: styles["measure-heading"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 22ch",
    range: "1.75rem - 2.75rem / 28rem - 80rem",
    sample: "Same-day repairs when your system quits",
  },
  {
    label: "heading-xl",
    typeClass: styles["fluid-heading-xl"],
    measureClass: styles["measure-heading"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 22ch",
    range: "2.25rem - 4rem / 24rem - 84rem",
    sample: "Reliable comfort when the weather turns",
  },
  {
    label: "display-lg",
    typeClass: styles["fluid-display-lg"],
    measureClass: styles["measure-display-wide"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 18ch",
    range: "3rem - 5.5rem / 24rem - 90rem",
    sample: "Fast HVAC service without the runaround",
  },
  {
    label: "display-xl",
    typeClass: styles["fluid-display-xl"],
    measureClass: styles["measure-display"],
    wrapClass: styles["wrap-balance"],
    measure: "max-width: 14ch",
    range: "3.5rem - 7rem / 24rem - 96rem",
    sample: "Emergency repairs without delay",
  },
] as const;

const responsiveParents = [
  {
    label: "Narrow parent",
    size: "max-width: 28rem",
    className: "max-w-[28rem]",
  },
  {
    label: "Default parent",
    size: "max-width: 56rem",
    className: "max-w-[56rem]",
  },
  {
    label: "Wide parent",
    size: "max-width: 80rem",
    className: "max-w-[80rem]",
  },
  {
    label: "Extra-wide parent",
    size: "full 1440px container",
    className: "max-w-none",
  },
] as const;

const compositionCards = [
  {
    label: "Heating and Cooling",
    title: "Comfort service built around the first call",
    body:
      "From the first request to the final walkthrough, the page should make the service feel clear, local, and easy to start.",
  },
  {
    label: "Repair Process",
    title: "Know what is wrong before choosing the fix",
    body:
      "A technician inspects the system, explains the issue in plain language, and gives practical options before any repair begins.",
  },
  {
    label: "Local Coverage",
    title: "Fast scheduling across North Charlotte towns",
    body:
      "The service area language should stay compact enough to scan while still naming the communities that matter to searchers.",
  },
] as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ExperimentContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
      {children}
    </div>
  );
}

function TypeText({
  as: Component = "p",
  typeClass,
  measureClass,
  wrapClass,
  measure,
  className,
  showMeasure = true,
  children,
}: {
  as?: "p" | "h1" | "h2" | "h3";
  typeClass: string;
  measureClass?: string;
  wrapClass: string;
  measure?: string;
  className?: string;
  showMeasure?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Component
      className={cx(
        typeClass,
        measureClass,
        wrapClass,
        className,
        showMeasure ? styles["measure-debug"] : undefined,
      )}
      data-measure={showMeasure ? measure : undefined}
    >
      {children}
    </Component>
  );
}

function SectionIntro({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className={cx("mb-12", styles["fluid-type-frame"])}>
      <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
        {kicker}
      </p>
      <TypeText
        as="h2"
        typeClass={styles["fluid-heading-xl"]}
        measureClass={styles["measure-heading"]}
        wrapClass={styles["wrap-balance"]}
        measure="max-width: 22ch"
        className="mt-4"
      >
        {title}
      </TypeText>
      <TypeText
        typeClass={styles["fluid-text-md"]}
        measureClass={styles["measure-copy"]}
        wrapClass={styles["wrap-pretty"]}
        measure="max-width: 60ch"
        className="mt-6 text-service-muted"
      >
        {body}
      </TypeText>
    </div>
  );
}

function RoleSpec({
  role,
}: {
  role: {
    label: string;
    measure: string;
    wrapClass: string;
    range: string;
  };
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-service-border pb-5 font-mono text-xs text-service-muted">
      <span className="font-semibold text-service-ink">{role.label}</span>
      <span>{role.measure}</span>
      <span>
        {role.wrapClass === styles["wrap-balance"]
          ? "text-wrap: balance"
          : "text-wrap: pretty"}
      </span>
      <span>{role.range}</span>
    </div>
  );
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        styles["fluid-label"],
        "inline-flex text-service-accent",
        className,
      )}
    >
      {children}
    </p>
  );
}

export default function TypeHierarchyTestPage() {
  const bodyRole = roles.find((role) => role.label === "text-md / body")!;

  return (
    <main className="bg-service-surface text-service-ink">
      <section className="border-b border-service-border bg-white py-20 max-lg:py-16 max-md:py-12">
        <ExperimentContainer>
          <div className={styles["fluid-type-frame"]}>
            <Eyebrow>Internal typography experiment</Eyebrow>
            <TypeText
              as="h1"
              typeClass={styles["fluid-display-lg"]}
              measureClass={styles["measure-display-wide"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 18ch"
              className="mt-6"
            >
              Responsive type hierarchy with healthy measures
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-xl"]}
              measureClass={styles["measure-lead"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-8 text-service-muted"
            >
              A test page for role-based type tokens, ch-based reading widths,
              browser-assisted wrapping, and hierarchy-safe fluid scaling.
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-md"]}
              measureClass={styles["measure-copy-wide"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 70ch"
              className="mt-8 border-l-4 border-service-accent pl-5 text-service-muted"
            >
              The 60ch experiment is useful for body copy, but a full type
              hierarchy needs hierarchy-safe fluid scaling. Measures control
              line length; type classes control size hierarchy.
            </TypeText>
          </div>
        </ExperimentContainer>
      </section>

      <Section>
        <ExperimentContainer>
          <SectionIntro
            kicker="Measured role system"
            title="Type Role Matrix"
            body="Every row composes a fluid type class, a measure class, and a wrap helper. The visible box is the measured text element, not the parent card."
          />
          <div className="grid grid-cols-1 gap-6">
            {roles.map((role) => (
              <Card
                key={role.label}
                className={cx(
                  "p-8 shadow-none max-md:p-6",
                  styles["fluid-type-frame"],
                )}
              >
                <RoleSpec role={role} />
                <TypeText
                  as={
                    role.label.includes("heading") ||
                    role.label.includes("display")
                      ? "h3"
                      : "p"
                  }
                  typeClass={role.typeClass}
                  measureClass={role.measureClass}
                  wrapClass={role.wrapClass}
                  measure={role.measure}
                >
                  {role.sample}
                </TypeText>
              </Card>
            ))}
          </div>
        </ExperimentContainer>
      </Section>

      <Section className="bg-white">
        <ExperimentContainer>
          <SectionIntro
            kicker="Line length proof"
            title="Measured vs Unmeasured"
            body="This is the only section where unmeasured reading copy is allowed. The parent is intentionally wide so the difference is obvious."
          />
          <div className="grid grid-cols-1 gap-6">
            <Card className={cx("p-8 shadow-none", styles["fluid-type-frame"])}>
              <RoleSpec
                role={{
                  ...bodyRole,
                  label: "Unmeasured / parent-controlled / not recommended",
                  measure: "no max-width",
                }}
              />
              <p
                className={cx(
                  styles["fluid-text-md"],
                  styles["wrap-pretty"],
                  "text-service-muted",
                )}
              >
                {bodyParagraph}
              </p>
            </Card>

            <Card className={cx("p-8 shadow-none", styles["fluid-type-frame"])}>
              <RoleSpec
                role={{
                  ...bodyRole,
                  label: "Measured",
                  measure: "max-width: 60ch",
                }}
              />
              <TypeText
                typeClass={styles["fluid-text-md"]}
                measureClass={styles["measure-copy"]}
                wrapClass={styles["wrap-pretty"]}
                measure="max-width: 60ch"
                className="text-service-muted"
              >
                {bodyParagraph}
              </TypeText>
            </Card>

            <Card className="p-8 shadow-none">
              <div className={styles["fluid-type-frame"]}>
                <RoleSpec
                  role={{
                    ...bodyRole,
                    label: "Measured + fluid frame",
                    measure: "max-width: 60ch",
                  }}
                />
                <TypeText
                  typeClass={styles["fluid-text-md"]}
                  measureClass={styles["measure-copy"]}
                  wrapClass={styles["wrap-pretty"]}
                  measure="max-width: 60ch"
                  className="text-service-muted"
                >
                  {bodyParagraph}
                </TypeText>
              </div>
            </Card>
          </div>
        </ExperimentContainer>
      </Section>

      <Section>
        <ExperimentContainer>
          <SectionIntro
            kicker="Measured hierarchy"
            title="Full Hierarchy Measured Stack"
            body="Every role is stacked vertically using its recommended measure and wrap behavior. Nothing relies on the parent card width for readable line length."
          />
          <Card className={cx("p-8 shadow-none max-md:p-6", styles["fluid-type-frame"])}>
            <div className="space-y-10">
              {roles.map((role) => (
                <div key={`stack-${role.label}`}>
                  <p className="mb-5 font-mono text-xs font-semibold text-service-muted">
                    {role.label}
                  </p>
                  <TypeText
                    as={
                      role.label.includes("heading") ||
                      role.label.includes("display")
                        ? "h3"
                        : "p"
                    }
                    typeClass={role.typeClass}
                    measureClass={role.measureClass}
                    wrapClass={role.wrapClass}
                    measure={role.measure}
                  >
                    {role.sample}
                  </TypeText>
                </div>
              ))}
            </div>
          </Card>
        </ExperimentContainer>
      </Section>

      <Section className="bg-white">
        <ExperimentContainer>
          <SectionIntro
            kicker="Parent width proof"
            title="Responsive Parent Width Test"
            body="The parent can grow from narrow to extra-wide, but each text role keeps its measure while the type scale responds to the container width."
          />
          <div className="grid grid-cols-1 gap-8">
            {responsiveParents.map((parent) => (
              <Card
                key={parent.label}
                className={cx(
                  "w-full p-8 shadow-none max-md:p-6",
                  parent.className,
                  styles["fluid-type-frame"],
                )}
              >
                <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3 border-b border-service-border pb-5">
                  <h3 className="text-lg font-semibold text-service-ink">
                    {parent.label}
                  </h3>
                  <p className="font-mono text-xs text-service-muted">
                    {parent.size}
                  </p>
                </div>
                <div className="space-y-10">
                  {roles.map((role) => (
                    <div key={`${parent.label}-${role.label}`}>
                      <p className="mb-5 font-mono text-xs font-semibold text-service-muted">
                        {role.label}
                      </p>
                      <TypeText
                        as={
                          role.label.includes("heading") ||
                          role.label.includes("display")
                            ? "h3"
                            : "p"
                        }
                        typeClass={role.typeClass}
                        measureClass={role.measureClass}
                        wrapClass={role.wrapClass}
                        measure={role.measure}
                      >
                        {role.sample}
                      </TypeText>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ExperimentContainer>
      </Section>

      <Section className="bg-white">
        <ExperimentContainer>
          <SectionIntro
            kicker="Measured page texture"
            title="Real Layout Composition"
            body="The same measured utilities are arranged into realistic local service sections to check hierarchy, rhythm, and line length outside of sample rows."
          />

          <article
            className={cx(
              "border-y border-service-border py-16",
              styles["fluid-type-frame"],
            )}
          >
            <Eyebrow>Longform service narrative</Eyebrow>
            <TypeText
              as="h2"
              typeClass={styles["fluid-display-xl"]}
              measureClass={styles["measure-display"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 14ch"
              className="mt-7"
            >
              The page should make help feel close
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-xl"]}
              measureClass={styles["measure-lead"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-8 text-service-muted"
            >
              When a system fails, the customer is not studying a brand. They
              are trying to understand whether someone nearby can respond, what
              the visit will feel like, and whether the next step is simple.
            </TypeText>

            <TypeText
              as="h3"
              typeClass={styles["fluid-display-lg"]}
              measureClass={styles["measure-display-wide"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 18ch"
              className="mt-20"
            >
              Start with the problem they can name
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-lg"]}
              measureClass={styles["measure-copy"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-7 text-service-muted"
            >
              Strong local service pages meet people at the moment of friction.
              Warm air from the vents, a frozen coil, a noisy furnace, or a
              thermostat that will not respond are better entry points than
              abstract claims about quality.
            </TypeText>

            <div className="mt-16 grid grid-cols-[0.7fr_1.3fr] gap-12 max-lg:grid-cols-1">
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-service-muted">
                  Label
                </p>
                <p
                  className={cx(
                    styles["fluid-label"],
                    "mt-4 inline-flex text-service-accent",
                  )}
                >
                  Dispatch Note
                </p>
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase text-service-muted">
                  Text XS
                </p>
                <TypeText
                  typeClass={styles["fluid-text-xs"]}
                  measureClass={styles["measure-caption"]}
                  wrapClass={styles["wrap-pretty"]}
                  measure="max-width: 48ch"
                  className="mt-4 text-service-muted"
                >
                  Same-day availability depends on technician routing, parts
                  access, and the number of urgent calls already scheduled.
                </TypeText>
              </div>
            </div>

            <TypeText
              as="h3"
              typeClass={styles["fluid-heading-xl"]}
              measureClass={styles["measure-heading"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 22ch"
              className="mt-20"
            >
              A clear hierarchy turns service details into a guided path
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-md"]}
              measureClass={styles["measure-copy"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-8 text-service-muted"
            >
              Body copy should carry the explanation without becoming dense.
              It should answer what happens during the visit, how the technician
              explains the issue, and what the customer can expect before work
              begins.
            </TypeText>

            <div className="mt-14 border-l-4 border-service-accent pl-7 max-md:pl-5">
              <TypeText
                as="h3"
                typeClass={styles["fluid-heading-lg"]}
                measureClass={styles["measure-heading"]}
                wrapClass={styles["wrap-balance"]}
                measure="max-width: 22ch"
              >
                The best conversion copy lowers the temperature before it asks
                for action
              </TypeText>
              <TypeText
                typeClass={styles["fluid-caption"]}
                measureClass={styles["measure-caption"]}
                wrapClass={styles["wrap-pretty"]}
                measure="max-width: 48ch"
                className="mt-6 text-service-muted"
              >
                Caption: this pullquote area tests small supporting text after
                a larger editorial statement.
              </TypeText>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-10 max-lg:grid-cols-1">
              <Card className={cx("p-7 shadow-none", styles["fluid-type-frame"])}>
                <Eyebrow>Repair Visit</Eyebrow>
                <TypeText
                  as="h3"
                  typeClass={styles["fluid-heading-md"]}
                  measureClass={styles["measure-heading-wide"]}
                  wrapClass={styles["wrap-balance"]}
                  measure="max-width: 28ch"
                  className="mt-5"
                >
                  Know what is wrong before choosing the fix
                </TypeText>
                <TypeText
                  typeClass={styles["fluid-text-sm"]}
                  measureClass={styles["measure-copy-wide"]}
                  wrapClass={styles["wrap-pretty"]}
                  measure="max-width: 70ch"
                  className="mt-5 text-service-muted"
                >
                  The smaller paragraph style should remain useful for cards,
                  process notes, and service descriptions without outgrowing
                  regular body copy.
                </TypeText>
              </Card>

              <Card className={cx("p-7 shadow-none", styles["fluid-type-frame"])}>
                <Eyebrow>Maintenance</Eyebrow>
                <TypeText
                  as="h3"
                  typeClass={styles["fluid-heading-sm"]}
                  measureClass={styles["measure-heading-wide"]}
                  wrapClass={styles["wrap-balance"]}
                  measure="max-width: 28ch"
                  className="mt-5"
                >
                  Seasonal tune-ups that keep problems from compounding
                </TypeText>
                <TypeText
                  typeClass={styles["fluid-text-sm"]}
                  measureClass={styles["measure-copy-wide"]}
                  wrapClass={styles["wrap-pretty"]}
                  measure="max-width: 70ch"
                  className="mt-5 text-service-muted"
                >
                  Use this pairing to judge whether small headings and compact
                  copy still feel distinct when placed inside repeated content.
                </TypeText>
              </Card>
            </div>
          </article>

          <div
            className={cx(
              "border-b border-service-border py-16",
              styles["fluid-type-frame"],
            )}
          >
            <Eyebrow>Emergency HVAC Repair</Eyebrow>
            <TypeText
              as="h2"
              typeClass={styles["fluid-display-xl"]}
              measureClass={styles["measure-display"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 14ch"
              className="mt-7"
            >
              Fast help when your system stops working
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-xl"]}
              measureClass={styles["measure-lead"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-8 text-service-muted"
            >
              Request service online, describe the issue, and get a fast
              response from a local technician serving Huntersville, Cornelius,
              Davidson, and North Charlotte.
            </TypeText>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#schedule">Schedule Now</Button>
              <Button href="#call" variant="secondary">
                Call Today
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 py-16 max-lg:grid-cols-1">
            {compositionCards.map((card) => (
              <Card
                key={card.title}
                className={cx("p-7 shadow-none", styles["fluid-type-frame"])}
              >
                <Eyebrow>{card.label}</Eyebrow>
                <TypeText
                  as="h3"
                  typeClass={styles["fluid-heading-sm"]}
                  measureClass={styles["measure-heading-wide"]}
                  wrapClass={styles["wrap-balance"]}
                  measure="max-width: 28ch"
                  className="mt-4"
                >
                  {card.title}
                </TypeText>
                <TypeText
                  typeClass={styles["fluid-text-sm"]}
                  measureClass={styles["measure-copy-wide"]}
                  wrapClass={styles["wrap-pretty"]}
                  measure="max-width: 70ch"
                  className="mt-5 text-service-muted"
                >
                  {card.body}
                </TypeText>
              </Card>
            ))}
          </div>

          <div
            className={cx(
              "bg-service-ink p-10 text-white max-md:p-6",
              styles["fluid-type-frame"],
            )}
          >
            <Eyebrow className="text-white/55">Editorial Section</Eyebrow>
            <TypeText
              as="h2"
              typeClass={styles["fluid-heading-xl"]}
              measureClass={styles["measure-heading"]}
              wrapClass={styles["wrap-balance"]}
              measure="max-width: 22ch"
              className="mt-6 text-white"
            >
              Service copy should make the next step feel obvious
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-md"]}
              measureClass={styles["measure-copy"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 60ch"
              className="mt-8 text-white/70"
            >
              When a homeowner is dealing with a broken system, useful copy
              answers the practical questions first: how fast someone can come,
              what happens during the visit, and how decisions are explained.
            </TypeText>
            <TypeText
              typeClass={styles["fluid-text-md"]}
              measureClass={styles["measure-longform"]}
              wrapClass={styles["wrap-pretty"]}
              measure="max-width: 75ch"
              className="mt-7 text-white/58"
            >
              This longer paragraph tests whether the hierarchy can support an
              editorial section without relying on cards, columns, or
              decorative layout tricks. The measure should stay readable even as
              the type scales with the container.
            </TypeText>
          </div>
        </ExperimentContainer>
      </Section>
    </main>
  );
}
