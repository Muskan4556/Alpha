import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types/auth";

const COOKIE_NAME = "role";

const ROLE_ROUTES: Record<Role, string[]> = {
  admin: ["/analytics", "/products"],
  user:  ["/products"],
};

const PUBLIC_ROUTES = ["/login"];

function getRole(request: NextRequest): Role | null {
  return (request.cookies.get(COOKIE_NAME)?.value as Role) ?? null;
}

function matches(pathname: string, routes: string[]) {
  return routes.some((r) => pathname.startsWith(r));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request);

  // Already logged in → skip login
  if (pathname === "/login" && role) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/analytics" : "/products", request.url),
    );
  }

  // Public routes pass through
  if (matches(pathname, PUBLIC_ROUTES)) return NextResponse.next();

  // Unauthenticated -> redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // RBAC
  if (!matches(pathname, ROLE_ROUTES[role])) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

// Configuration
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$).*)"],
};
