import { createBrowserClient } from "@supabase/ssr";

export function createPasswordResetClient() {
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
            error: {
              message:
                "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
            },
          };
        },
      },
    };
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
