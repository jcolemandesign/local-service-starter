import { createBrowserClient } from "@supabase/ssr";

const missingConfigError = {
  message:
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return {
      auth: {
        async resetPasswordForEmail() {
          return {
            data: null,
            error: missingConfigError,
          };
        },
      },
    };
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
