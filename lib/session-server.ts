import "server-only";

import { cookies } from "next/headers";
import type { Role, Session } from "@/lib/types/auth";

const ROLE_COOKIE = "role";
const EMAIL_COOKIE = "email";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(ROLE_COOKIE, session.role, cookieOptions);
  store.set(EMAIL_COOKIE, session.email, cookieOptions);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ROLE_COOKIE);
  store.delete(EMAIL_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const role = store.get(ROLE_COOKIE)?.value;
  const email = store.get(EMAIL_COOKIE)?.value;

  if (role !== "admin" && role !== "user") return null;
  if (!email) return null;

  return { role, email };
}

export async function getSessionRole(): Promise<Role | null> {
  const store = await cookies();
  const role = store.get(ROLE_COOKIE)?.value;
  if (role !== "admin" && role !== "user") return null;
  return role;
}
