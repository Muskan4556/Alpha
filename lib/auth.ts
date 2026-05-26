import type { Role } from "@/lib/types/auth";

const USERS: Record<string, { password: string; role: Role }> = {
  "admin@alpha.com": { password: "admin123", role: "admin" },
  "user@alpha.com":  { password: "user123",  role: "user" },
};

export function verifyCredentials(
  email: string,
  password: string,
  role: Role,
): boolean {
  const record = USERS[email.toLowerCase().trim()];
  return (
    record !== undefined &&
    record.password === password &&
    record.role === role
  );
}
