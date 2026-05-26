"use server";

import { verifyCredentials } from "@/lib/auth";
import { clearSession, setSession } from "@/lib/session-server";
import type { Role } from "@/lib/types/auth";

export type LoginResult =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

export async function login(credentials: {
  email: string;
  password: string;
  role: Role;
}): Promise<LoginResult> {
  const { email, password, role } = credentials;

  if (!verifyCredentials(email, password, role)) {
    return { success: false, error: "Invalid email or password." };
  }

  await setSession(role);

  return {
    success: true,
    redirectTo: role === "admin" ? "/analytics" : "/products",
  };
}

export async function logout(): Promise<void> {
  await clearSession();
}
