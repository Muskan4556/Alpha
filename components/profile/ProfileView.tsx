import { LogOut, ShieldCheck, User } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/data/users";
import type { Session } from "@/lib/types/auth";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  session: Session;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileView({ session }: ProfileViewProps) {
  const profile = getUserProfile(session.email);
  const isAdmin = session.role === "admin";
  const displayName = profile?.name ?? session.role;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 border-b border-white/6 pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold",
              isAdmin
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/10 text-white/75",
            )}
          >
            {getInitials(displayName)}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-1 text-base text-white/50">
              {profile?.title ?? "Team member"}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/40">
              {isAdmin ? (
                <ShieldCheck className="size-3.5 text-emerald-400" />
              ) : (
                <User className="size-3.5" />
              )}
              <span className={isAdmin ? "text-emerald-400/90" : undefined}>
                {isAdmin ? "Administrator" : "Standard user"}
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/35">
          Account
        </h2>
        <div className="divide-y divide-white/6">
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <span className="text-sm text-white/45">Email</span>
            <span className="text-sm font-medium text-white/90 sm:text-right">
              {session.email}
            </span>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <span className="text-sm text-white/45">Role</span>
            <span className="text-sm font-medium text-white/90 sm:text-right">
              {isAdmin ? "Administrator" : "Standard user"}
            </span>
          </div>
          <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <span className="text-sm text-white/45">Access</span>
            <span className="text-sm font-medium text-white/90 sm:text-right">
              {isAdmin
                ? "Analytics, products, publish controls"
                : "Published catalog only"}
            </span>
          </div>
        </div>

        <form action={logout} className="mt-6 border-t border-white/6 pt-6">
          <Button
            type="submit"
            variant="ghost"
            className="h-9 px-0 text-white/45 hover:bg-transparent hover:text-red-400"
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
