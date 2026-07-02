import { createServerClient } from "@supabase/ssr";

type Cookie = {
  name: string;
  value: string;
};

type CookieStore = {
  getAll: () => Cookie[];
  set?: (name: string, value: string, options?: Record<string, unknown>) => void;
};

const missingConfigError = {
  message:
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
};

function createUnconfiguredClient() {
  return {
    auth: {
      async getUser() {
        return {
          data: { user: null },
          error: missingConfigError,
        };
      },
      async signInWithPassword() {
        return {
          data: null,
          error: missingConfigError,
        };
      },
      async signOut() {
        return {
          error: null,
        };
      },
    },
    from() {
      return {
        select() {
          return {
            async order() {
              return {
                data: null,
                error: missingConfigError,
              };
            },
          };
        },
        update() {
          return {
            async eq() {
              return {
                data: null,
                error: missingConfigError,
              };
            },
          };
        },
        delete() {
          return {
            eq() {
              return {
                async select() {
                  return {
                    data: null,
                    error: missingConfigError,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}

export function createClient(cookieStore: CookieStore) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return createUnconfiguredClient();
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, options, value } of cookiesToSet) {
          try {
            cookieStore.set?.(name, value, options);
          } catch {
            // Server Components cannot set cookies. Server Actions and Route
            // Handlers can, which is where auth mutations happen.
          }
        }
      },
    },
  });
}
