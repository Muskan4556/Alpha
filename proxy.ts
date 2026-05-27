import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types/auth";

const ROLE_COOKIE = "role";
const EMAIL_COOKIE = "email";

const ROLE_ROUTES: Record<Role, string[]> = {
  admin: ["/analytics", "/products", "/profile"],
  user: ["/products", "/profile"],
};

const PUBLIC_ROUTES = ["/login"];

function getRole(request: NextRequest): Role | null {
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  if (role !== "admin" && role !== "user") return null;
  return role;
}

function hasValidSession(request: NextRequest): boolean {
  return getRole(request) !== null && !!request.cookies.get(EMAIL_COOKIE)?.value;
}

function matches(pathname: string, routes: string[]) {
  return routes.some((r) => pathname.startsWith(r));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request);
  const authenticated = hasValidSession(request);

  if (pathname === "/login") {
    if (authenticated && role) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/analytics" : "/products", request.url),
      );
    }

    if (role && !request.cookies.get(EMAIL_COOKIE)?.value) {
      const response = NextResponse.next();
      response.cookies.delete(ROLE_COOKIE);
      return response;
    }

    return NextResponse.next();
  }

  if (matches(pathname, PUBLIC_ROUTES)) return NextResponse.next();

  if (!authenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (role && !request.cookies.get(EMAIL_COOKIE)?.value) {
      response.cookies.delete(ROLE_COOKIE);
    }
    return response;
  }

  if (role && !matches(pathname, ROLE_ROUTES[role])) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
