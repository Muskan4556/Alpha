import { ShieldCheck, User } from "lucide-react";
import type { Role } from "@/lib/types/auth";

type RoleData  = {
  id: Role;
  label: string;  
  Icon: typeof User;
}

export const ROLES: RoleData[] = [
  { id: "user",  label: "User",  Icon: User },
  { id: "admin", label: "Admin", Icon: ShieldCheck },
];
