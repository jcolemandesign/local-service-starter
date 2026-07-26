import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export function isBuilderAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function hasBuilderAccess() {
  // Keep the starter usable before a local Supabase project is connected, but
  // never let a deployed builder fail open because configuration is missing.
  if (!isBuilderAuthConfigured()) {
    return process.env.NODE_ENV !== "production";
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.getClaims();

  return !error && Boolean(data?.claims?.sub);
}

export async function requireBuilderPageAccess(returnTo = "/dev") {
  if (!(await hasBuilderAccess())) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }
}

export async function requireBuilderApiAccess() {
  if (await hasBuilderAccess()) {
    return null;
  }

  return Response.json({ error: "Authentication required." }, { status: 401 });
}
