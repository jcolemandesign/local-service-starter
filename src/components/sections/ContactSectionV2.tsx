import styles from "./section-v2-type.module.css";

type ContactSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  details: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContactSectionV2({
  eyebrow,
  title,
  body,
  details,
}: ContactSectionV2Props) {
  return (
    <section id="contact" className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 max-lg:grid-cols-1">
          <div className={styles["fluid-type-frame"]}>
            <p className={cx(styles["fluid-label"], "text-service-accent")}>
              {eyebrow}
            </p>
            <h2
              className={cx(
                styles["fluid-heading-xl"],
                styles["measure-heading-wide"],
                styles["wrap-balance"],
                "mt-5 text-service-ink",
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                styles["fluid-text-lg"],
                styles["measure-copy"],
                styles["wrap-pretty"],
                "mt-6 text-service-muted",
              )}
            >
              {body}
            </p>

            <ul className="mt-9 grid gap-3">
              {details.map((detail) => (
                <li
                  className={cx(
                    styles["fluid-text-md"],
                    styles["wrap-pretty"],
                    "font-semibold text-service-ink",
                  )}
                  key={detail}
                >
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cx(
              styles["fluid-type-frame"],
              styles["radius-medium"],
              "border border-service-border bg-service-surface p-8 shadow-service max-md:p-6",
            )}
          >
            <form className="grid gap-5">
              <label
                className={cx(
                  styles["fluid-text-sm"],
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Name
                <input
                  className={cx(
                    styles["radius-4"],
                    "min-h-12 border border-service-border bg-white px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Jane Smith"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  styles["fluid-text-sm"],
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Service needed
                <input
                  className={cx(
                    styles["radius-4"],
                    "min-h-12 border border-service-border bg-white px-4 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Repair, installation, maintenance"
                  type="text"
                />
              </label>
              <label
                className={cx(
                  styles["fluid-text-sm"],
                  "grid gap-2 font-semibold text-service-ink",
                )}
              >
                Message
                <textarea
                  className={cx(
                    styles["radius-4"],
                    "min-h-32 border border-service-border bg-white px-4 py-3 text-base font-normal outline-none transition-colors focus:border-service-accent",
                  )}
                  placeholder="Briefly describe the issue"
                />
              </label>
              <button
                className={cx(
                  styles["radius-4"],
                  styles["fluid-label"],
                  "min-h-12 cursor-pointer bg-service-accent px-6 text-white transition-colors hover:bg-service-ink",
                )}
                type="button"
              >
                Submit preview
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
