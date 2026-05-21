"use client";

import { useState } from "react";
import { createPasswordResetClient } from "@/utils/supabase/password-reset-client";

type ResetStatus = "error" | "idle" | "sending" | "sent";

const fieldClass =
  "h-12 rounded-md border border-service-border bg-white px-4 text-base text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

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
    <form className="mt-8 border-t border-service-border pt-7" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
        Reset password
      </p>
      <label className="mt-4 grid gap-2 text-sm font-semibold uppercase tracking-widest text-service-ink">
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
          className={`mt-4 rounded-md border px-4 py-3 text-sm leading-6 ${
            status === "sent"
              ? "border-service-accent/25 bg-service-accent/10 text-service-ink"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        className="mt-5 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-md border border-service-border bg-white px-5 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-wait disabled:opacity-70"
        disabled={status === "sending"}
        type="submit"
      >
        {status === "sending" ? "Sending" : "Send reset link"}
      </button>
    </form>
  );
}
