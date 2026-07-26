import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let response = NextResponse.next({
    request,
  });

  const builderRequest = isBuilderRequest(request.nextUrl.pathname);

  if (!supabaseUrl || !supabasePublishableKey) {
    if (builderRequest && process.env.NODE_ENV === "production") {
      return getUnauthenticatedBuilderResponse(request);
    }

    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({
          request,
        });

        for (const { name, options, value } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();

  if (builderRequest && (error || !data?.claims?.sub)) {
    return getUnauthenticatedBuilderResponse(request);
  }

  return response;
}

export function isBuilderRequest(pathname: string) {
  const isDevPage = pathname === "/dev" || pathname.startsWith("/dev/");
  const isInternalApi =
    pathname.startsWith("/api/") && pathname !== "/api/intake";

  return isDevPage || isInternalApi;
}

function getUnauthenticatedBuilderResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}
