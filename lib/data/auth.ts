import type { Role } from "@/lib/types/auth";

export interface DemoCredential {
  role: Role;
  email: string;
  password: string;
  label: string;
  color: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: "admin",
    email: "admin@alpha.com",
    password: "admin123",
    label: "Admin",
    color: "emerald",
  },
  {
    role: "user",
    email: "user@alpha.com",
    password: "user123",
    label: "User",
    color: "slate",
  },
];
