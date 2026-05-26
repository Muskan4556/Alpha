import "server-only";
import { cookies } from "next/headers";
import type { Role } from "@/lib/types/auth";

const COOKIE_NAME = "role";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setSession(role: Role): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Role | null> {
  const store = await cookies();
  return (store.get(COOKIE_NAME)?.value as Role) ?? null;
}
