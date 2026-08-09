import { Container, Section } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type CTASectionProps = {
  title: string;
  body: string;
  action: string;
};

export function CTASection({ title, body, action }: CTASectionProps) {
  return (
    <Section className="bg-service-ink">
      <Container>
        <div className="flex items-center justify-between gap-10 max-lg:flex-col max-lg:items-start">
          <div className="max-w-3xl">
            <h2 className="text-fluid-heading font-semibold leading-heading text-white">{title}</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{body}</p>
          </div>
          <RequestServiceButton
            /* The fill is a literal white on purpose - this button sits on a
               dark band and has to clear it. The label therefore cannot follow
               the recipe: `text-service-ink` is the recipe's text source, which
               is white on every dark recipe, so the label vanished into its own
               fill. `bg-dark` is unscoped by the role table and stays the
               palette's dark under every recipe, which is what a fixed white
               fill needs. */
            className="shrink-0 border-white bg-white text-bg-dark hover:bg-service-surface"
            variant="secondary"
          >
            {action}
          </RequestServiceButton>
        </div>
      </Container>
    </Section>
  );
}
