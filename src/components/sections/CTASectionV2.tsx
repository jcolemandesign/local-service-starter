import { RequestServiceButton } from "@/components/request-service";

type CTASectionV2Props = {
  title: string;
  body: string;
  action: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CTASectionV2({ title, body, action }: CTASectionV2Props) {
  return (
    <section className="bg-service-ink py-24 text-white max-lg:py-20 max-md:py-16">
      <div className="container-site">
        <div className={cx("fluid-type-frame", "flex items-center justify-between gap-10 max-lg:flex-col max-lg:items-start")}>
          <div>
            <h2
              className={cx(
                "type-heading-xl",
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                "type-text-lg",
                "measure-copy",
                "wrap-pretty",
                "mt-6 text-white/75",
              )}
            >
              {body}
            </p>
          </div>
          <RequestServiceButton
            className={cx(
              "radius-4",
              "shrink-0 border-white bg-white text-service-ink hover:bg-service-surface",
            )}
            variant="secondary"
          >
            {action}
          </RequestServiceButton>
        </div>
      </div>
    </section>
  );
}
