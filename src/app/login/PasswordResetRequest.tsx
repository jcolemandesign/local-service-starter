"use client";

import { useState } from "react";
import { createPasswordResetClient } from "@/utils/supabase/password-reset-client";

type ResetStatus = "error" | "idle" | "sending" | "sent";

const fieldClass =
  "radius-button h-12 border border-service-border bg-bg-page px-4 type-text-sm text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

export function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Enter your email address.");
      return;
    }

    const supabase = createPasswordResetClient();
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check your email for a password reset link.");
  };

  return (
    <form
      className="mt-body-actions-md border-t border-service-border pt-[var(--container-gutter)]"
      onSubmit={handleSubmit}
    >
      <p className="type-label text-service-accent">
        Reset password
      </p>
      <label className="type-label mt-eyebrow-heading-sm grid inline-gap-sml text-service-ink">
        Email address
        <input
          autoComplete="email"
          className={fieldClass}
          name="reset-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          type="email"
          value={email}
        />
      </label>

      {message ? (
        <p
          className={`radius-button type-text-sm mt-heading-body-sm border px-4 py-3 ${
            status === "sent"
              ? "border-service-accent/25 bg-service-accent/10 text-service-ink"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        className="radius-button mt-body-actions-sm inline-flex min-h-11 w-full cursor-pointer items-center justify-center border border-service-border bg-bg-page px-5 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent disabled:cursor-wait disabled:opacity-70"
        disabled={status === "sending"}
        type="submit"
      >
        {status === "sending" ? "Sending" : "Send reset link"}
      </button>
    </form>
  );
}
