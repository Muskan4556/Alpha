"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";
import { ROLES } from "@/lib/data/roles";
import type { Role } from "@/lib/types/auth";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const empty = !username || !password;

  function pick(r: Role) {
    setRole(r);
    setUsername("");
    setPassword("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b1512] px-4 font-sans sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />

      <div className="pointer-events-none absolute top-[-15%] right-[-10%] h-[600px] w-[700px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14)_0%,rgba(5,150,105,0.06)_40%,transparent_65%)]" />

      <div className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-[500px] w-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent_35%,rgba(11,21,18,0.85)_100%)]" />

      <div className="relative z-10 mb-6 flex items-center gap-2.5">
        <BrandLogo />
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-white/80">
          Alpha
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[420px]">
        <div className="rounded-[18px] border border-white/7 bg-[#111e1a] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_0.5px_rgba(16,185,129,0.06)_inset] sm:p-7 lg:px-8 lg:py-8">
          <h1 className="mb-5 text-xl font-bold tracking-[-0.035em] text-white sm:mb-6 sm:text-[22px]">
            Welcome back
          </h1>

          <div className="mb-5 flex gap-2 sm:mb-[22px]">
            {ROLES.map(({ id, label, Icon }) => {
              const active = role === id;
              return (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  onClick={() => pick(id)}
                  className={cn(
                    "h-9 flex-1 gap-1.5 rounded-lg border text-[13px] font-semibold tracking-[-0.015em] transition-all",
                    active
                      ? "border-emerald-500 bg-emerald-500/12 text-emerald-400 hover:bg-emerald-500/16 hover:text-emerald-400"
                      : "border-white/8 bg-white/3 text-white/35 hover:border-white/14 hover:bg-white/5 hover:text-white/50",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-4"
          >
            <div className="space-y-[7px]">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/38">
                Username
              </label>
              <Input
                type="text"
                autoComplete="username"
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-10 rounded-[10px] border-white/8 bg-[#0c1714] px-[14px] text-[14px] tracking-[-0.01em] text-white/90 placeholder:text-white/18 focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/15 sm:h-[42px]"
              />
            </div>

            <div className="space-y-[7px]">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/38">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-[10px] border-white/8 bg-[#0c1714] px-[14px] pr-10 text-[14px] tracking-[-0.01em] text-white/90 placeholder:text-white/18 focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/15 sm:h-[42px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  tabIndex={-1}
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/28 hover:bg-transparent hover:text-white/60"
                >
                  {show ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || empty}
              className={cn(
                "mt-1 h-10 w-full rounded-[10px] border-0 text-[14.5px] font-semibold tracking-[-0.02em] gap-2 transition-all sm:h-11",
                empty || loading
                  ? "cursor-not-allowed bg-emerald-500/25 text-white/30"
                  : "bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_24px_rgba(16,185,129,0.30)] hover:opacity-90 active:scale-[0.98]",
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="size-[14px] animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="size-[15px]" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
