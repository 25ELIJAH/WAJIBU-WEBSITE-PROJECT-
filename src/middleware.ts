import { NextResponse, type NextRequest } from "next/server";

/**
 * First line of defence for the private portal: no session cookie, no access.
 * The signature, expiry, account status and role are verified again server-side on every page and
 * action (src/lib/portal/session.ts), so this check is only a cheap early redirect.
 */
export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has("wajibu_session");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/portal/:path*", "/admin/:path*", "/api/portal/:path*"] };
