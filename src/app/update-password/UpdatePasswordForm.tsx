"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPasswordResetClient } from "@/utils/supabase/password-reset-client";

type RecoveryStatus = "checking" | "error" | "ready" | "updated";

const fieldClass =
  "radius-button h-12 border border-service-border bg-bg-page px-4 type-text-sm text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

export function UpdatePasswordForm() {
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [message, setMessage] = useState("Checking your reset link...");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createPasswordResetClient();
    let isMounted = true;

    async function prepareRecoverySession() {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = params.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          if (isMounted) {
            setStatus("error");
            setMessage(error.message);
          }
          return;
        }

        window.history.replaceState(null, "", window.location.pathname);
      }

      if (hashParams.get("type") === "recovery") {
        setStatus("ready");
        setMessage("Enter a new password for your dashboard account.");
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      if (!session) {
        setStatus("error");
        setMessage("This reset link is missing, expired, or already used.");
        return;
      }

      setStatus("ready");
      setMessage("Enter a new password for your dashboard account.");
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
        setStatus("ready");
        setMessage("Enter a new password for your dashboard account.");
      }
    });

    void prepareRecoverySession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (password.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters for the new password.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("The passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const supabase = createPasswordResetClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus("updated");
    setMessage("Password updated. You can now return to your dashboard.");
    setIsSubmitting(false);
  }

  const canSubmit = status === "ready" || status === "error";

  return (
    <form className="mt-body-actions-md grid inline-gap-med" onSubmit={handleSubmit}>
      <label className="type-label grid inline-gap-sml text-service-ink">
        New password
        <input
          autoComplete="new-password"
          className={fieldClass}
          disabled={status === "checking" || status === "updated"}
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter a new password"
          required
          type="password"
          value={password}
        />
      </label>

      <label className="type-label grid inline-gap-sml text-service-ink">
        Confirm password
        <input
          autoComplete="new-password"
          className={fieldClass}
          disabled={status === "checking" || status === "updated"}
          minLength={8}
          name="confirm-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
          required
          type="password"
          value={confirmPassword}
        />
      </label>

      {message ? (
        <p
          className={`radius-button type-text-sm border px-4 py-3 ${
            status === "updated"
              ? "border-service-accent/25 bg-service-accent/10 text-service-ink"
              : status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-service-border bg-bg-page text-service-muted"
          }`}
        >
          {message}
        </p>
      ) : null}

      {status === "updated" ? (
        <Link
          className="radius-button inline-flex min-h-12 w-full items-center justify-center bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
          href="/dashboard"
        >
          Continue to dashboard
        </Link>
      ) : (
        <button
          className="radius-button inline-flex min-h-12 w-full cursor-pointer items-center justify-center bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent disabled:cursor-wait disabled:opacity-70"
          disabled={!canSubmit || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      )}
    </form>
  );
}
