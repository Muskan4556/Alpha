export type Role = "admin" | "user";

export interface Session {
  role: Role;
  email: string;
}
