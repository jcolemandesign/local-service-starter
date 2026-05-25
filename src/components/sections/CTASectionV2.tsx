import { RequestServiceButton } from "@/components/request-service";
import styles from "./section-v2-type.module.css";

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
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className={cx(styles["fluid-type-frame"], "flex items-center justify-between gap-10 max-lg:flex-col max-lg:items-start")}>
          <div>
            <h2
              className={cx(
                styles["fluid-heading-xl"],
                styles["measure-heading-wide"],
                styles["wrap-balance"],
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                styles["fluid-text-lg"],
                styles["measure-copy"],
                styles["wrap-pretty"],
                "mt-6 text-white/75",
              )}
            >
              {body}
            </p>
          </div>
          <RequestServiceButton
            className={cx(
              styles["radius-4"],
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
