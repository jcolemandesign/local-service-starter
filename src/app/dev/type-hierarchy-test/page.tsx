import type { Metadata } from "next";
import { Button, Card, Container, Section } from "@/components/primitives";
import styles from "./type-hierarchy-test.module.css";

export const metadata: Metadata = {
  title: "Type Hierarchy Test",
  description:
    "Internal responsive typography hierarchy experiment with ch measures and fluid scaling.",
};

const roleSamples = [
  {
    role: "hero-display",
    className: styles["hero-display"],
    wrap: styles["wrap-balance"],
    measure: "14ch",
    range: "3.75rem - 7rem",
    sample: "Emergency HVAC service without the runaround",
  },
  {
    role: "page-title",
    className: styles["page-title"],
    wrap: styles["wrap-balance"],
    measure: "18ch",
    range: "3rem - 5.75rem",
    sample: "Reliable comfort when the weather turns",
  },
  {
    role: "section-title",
    className: styles["section-title"],
    wrap: styles["wrap-balance"],
    measure: "22ch",
    range: "2.25rem - 4.25rem",
    sample: "Same-day repairs when your system quits",
  },
  {
    role: "subsection-title",
    className: styles["subsection-title"],
    wrap: styles["wrap-balance"],
    measure: "28ch",
    range: "1.65rem - 2.75rem",
    sample: "Clear options before work begins",
  },
  {
    role: "card-title",
    className: styles["card-title"],
    wrap: styles["wrap-balance"],
    measure: "24ch",
    range: "1.25rem - 1.75rem",
    sample: "AC repair that gets the house cooling again",
  },
  {
    role: "lead-copy",
    className: styles["lead-copy"],
    wrap: styles["wrap-pretty"],
    measure: "60ch",
    range: "1.125rem - 1.6875rem",
    sample:
      "Get repairs, tune-ups, and replacement guidance from a local team that explains the problem clearly before work begins.",
  },
  {
    role: "body-copy",
    className: styles["body-copy"],
    wrap: styles["wrap-pretty"],
    measure: "60ch",
    range: "1rem - 1.5rem",
    sample:
      "Request service online, describe the issue, and get a fast response from a local technician. Every submission is saved, organized, and sent directly to the business owner.",
  },
  {
    role: "body-wide",
    className: styles["body-wide"],
    wrap: styles["wrap-pretty"],
    measure: "70ch",
    range: "1rem - 1.375rem",
    sample:
      "Use this wider paragraph style for sections that need a little more room, such as service process details, financing notes, or trust-building explanations.",
  },
  {
    role: "longform-copy",
    className: styles["longform-copy"],
    wrap: styles["wrap-pretty"],
    measure: "75ch",
    range: "1rem - 1.25rem",
    sample:
      "Longform copy should still feel controlled. The measure can open up slightly, but it should never become a wall of text that asks the reader to scan across the full viewport.",
  },
  {
    role: "small-copy",
    className: styles["small-copy"],
    wrap: styles["wrap-pretty"],
    measure: "55ch",
    range: "0.875rem - 1.125rem",
    sample:
      "Serving Huntersville, Cornelius, Davidson, Mooresville, and North Charlotte.",
  },
  {
    role: "eyebrow",
    className: styles.eyebrow,
    wrap: styles["wrap-balance"],
    measure: "34ch",
    range: "0.75rem - 0.875rem",
    sample: "Emergency HVAC Repair",
  },
  {
    role: "caption",
    className: styles.caption,
    wrap: styles["wrap-pretty"],
    measure: "48ch",
    range: "0.75rem - 0.9375rem",
    sample: "Most appointments are confirmed within one business hour.",
  },
  {
    role: "label",
    className: styles.label,
    wrap: styles["wrap-balance"],
    measure: "28ch",
    range: "0.8125rem - 1rem",
    sample: "Service Area",
  },
] as const;

const pageExamples = [
  {
    eyebrow: "Heating and Cooling",
    title: "Comfort service built around the first call",
    body:
      "From the first request to the final walkthrough, the page should make the service feel clear, local, and easy to start.",
  },
  {
    eyebrow: "Repair Process",
    title: "Know what is wrong before choosing the fix",
    body:
      "A technician inspects the system, explains the issue in plain language, and gives practical options before any repair begins.",
  },
  {
    eyebrow: "Local Coverage",
    title: "Fast scheduling across North Charlotte towns",
    body:
      "The service area language should stay compact enough to scan while still naming the communities that matter to searchers.",
  },
] as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SpecLine({
  role,
  wrap,
  measure,
  range,
}: {
  role: string;
  wrap: string;
  measure: string;
  range: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-service-border pb-5 font-mono text-xs text-service-muted">
      <span className="font-semibold text-service-ink">{role}</span>
      <span>{wrap}</span>
      <span>{measure}</span>
      <span>{range}</span>
    </div>
  );
}

function MeasureText({
  as: Component = "p",
  className,
  measure,
  showMeasure = true,
  children,
}: {
  as?: "p" | "h1" | "h2" | "h3";
  className: string;
  measure: string;
  showMeasure?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Component
      className={cx(className, showMeasure ? styles["measure-outline"] : undefined)}
      data-measure={showMeasure ? measure : undefined}
    >
      {children}
    </Component>
  );
}

export default function TypeHierarchyTestPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <section className="border-b border-service-border bg-white py-20 max-lg:py-16 max-md:py-12">
        <Container>
          <div className={styles["cq-frame"]}>
            <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
              Internal typography experiment
            </p>
            <MeasureText
              as="h1"
              className={cx(
                styles["page-title"],
                styles["wrap-balance"],
                "mt-6",
              )}
              measure="18ch"
            >
              Responsive type hierarchy with visible measures
            </MeasureText>
            <MeasureText
              className={cx(
                styles["lead-copy"],
                styles["wrap-pretty"],
                "mt-8 text-service-muted",
              )}
              measure="60ch"
            >
              A test page for role-based type tokens, ch-based reading widths,
              browser-assisted wrapping, and container-query fluid scaling.
            </MeasureText>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
              Role system
            </p>
            <h2 className="mt-4 text-fluid-heading font-semibold leading-heading text-service-ink">
              Type Role Matrix
            </h2>
            <p className="mt-5 max-w-[70ch] text-lg leading-8 text-service-muted">
              Each row uses the actual role class, a target measure, a wrap
              helper, and a fluid range. The dashed outline shows the element
              width that is shaping the lines.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {roleSamples.map((sample) => (
              <Card
                key={sample.role}
                className={cx("p-8 shadow-none max-md:p-6", styles["cq-frame"])}
              >
                <SpecLine
                  role={sample.role}
                  wrap={
                    sample.wrap === styles["wrap-balance"]
                      ? "text-wrap: balance"
                      : "text-wrap: pretty"
                  }
                  measure={`max-width: ${sample.measure}`}
                  range={`fluid: ${sample.range}`}
                />
                <MeasureText
                  as={sample.role.includes("title") || sample.role.includes("display") ? "h3" : "p"}
                  className={cx(sample.className, sample.wrap)}
                  measure={sample.measure}
                >
                  {sample.sample}
                </MeasureText>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
              Full page texture
            </p>
            <h2 className="mt-4 text-fluid-heading font-semibold leading-heading text-service-ink">
              Real Layout Composition
            </h2>
            <p className="mt-5 max-w-[70ch] text-lg leading-8 text-service-muted">
              The same roles are arranged into realistic local service sections
              to check hierarchy, rhythm, and line length outside of sample
              rows.
            </p>
          </div>

          <div className={cx("border-y border-service-border py-16", styles["cq-frame"])}>
            <p className={cx(styles.eyebrow, styles["wrap-balance"], "text-service-accent")}>
              Emergency HVAC Repair
            </p>
            <MeasureText
              as="h2"
              className={cx(
                styles["hero-display"],
                styles["wrap-balance"],
                "mt-7",
              )}
              measure="14ch"
              showMeasure={false}
            >
              Fast help when your system stops working
            </MeasureText>
            <MeasureText
              className={cx(
                styles["lead-copy"],
                styles["wrap-pretty"],
                "mt-8 text-service-muted",
              )}
              measure="60ch"
              showMeasure={false}
            >
              Request service online, describe the issue, and get a fast
              response from a local technician serving Huntersville, Cornelius,
              Davidson, and North Charlotte.
            </MeasureText>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#schedule">Schedule Now</Button>
              <Button href="#call" variant="secondary">
                Call Today
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 py-16 max-lg:grid-cols-1">
            {pageExamples.map((example) => (
              <Card
                key={example.title}
                className={cx("p-7 shadow-none", styles["cq-frame"])}
              >
                <p className={cx(styles.label, "text-service-accent")}>
                  {example.eyebrow}
                </p>
                <MeasureText
                  as="h3"
                  className={cx(
                    styles["card-title"],
                    styles["wrap-balance"],
                    "mt-4",
                )}
                  measure="24ch"
                  showMeasure={false}
                >
                  {example.title}
                </MeasureText>
                <MeasureText
                  className={cx(
                    styles["small-copy"],
                    styles["wrap-pretty"],
                    "mt-5 text-service-muted",
                  )}
                  measure="55ch"
                  showMeasure={false}
                >
                  {example.body}
                </MeasureText>
              </Card>
            ))}
          </div>

          <div className={cx("bg-service-ink p-10 text-white max-md:p-6", styles["cq-frame"])}>
            <p className={cx(styles.eyebrow, "text-white/55")}>
              Editorial Section
            </p>
            <MeasureText
              as="h2"
              className={cx(
                styles["section-title"],
                styles["wrap-balance"],
                "mt-6 text-white",
              )}
              measure="22ch"
              showMeasure={false}
            >
              Service copy should make the next step feel obvious
            </MeasureText>
            <MeasureText
              className={cx(
                styles["body-copy"],
                styles["wrap-pretty"],
                "mt-8 text-white/70",
              )}
              measure="60ch"
              showMeasure={false}
            >
              When a homeowner is dealing with a broken system, useful copy
              answers the practical questions first: how fast someone can come,
              what happens during the visit, and how decisions are explained.
            </MeasureText>
            <MeasureText
              className={cx(
                styles["longform-copy"],
                styles["wrap-pretty"],
                "mt-7 text-white/58",
              )}
              measure="75ch"
              showMeasure={false}
            >
              This longer paragraph tests whether the hierarchy can support an
              editorial section without relying on cards, columns, or
              decorative layout tricks. The measure should stay readable even as
              the type scales with the container.
            </MeasureText>
          </div>
        </Container>
      </Section>
    </main>
  );
}
