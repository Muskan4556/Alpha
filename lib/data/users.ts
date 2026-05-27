import type { Role } from "@/lib/types/auth";

export const USER_PROFILES: Record<
  string,
  { name: string; role: Role; title: string }
> = {
  "admin@alpha.com": {
    name: "Admin",
    role: "admin",
    title: "Catalog Administrator",
  },
  "user@alpha.com": {
    name: "User",
    role: "user",
    title: "Store Viewer",
  },
};

export function getUserProfile(email: string) {
  return USER_PROFILES[email.toLowerCase().trim()] ?? null;
}
