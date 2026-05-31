"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Info,
  X,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";
import { ROLES } from "@/lib/data/roles";
import type { Role } from "@/lib/types/auth";
import { login } from "@/app/actions/auth";

import { DEMO_CREDENTIALS } from "@/lib/data/auth";

function CredentialsPopover({
  role,
  onUse,
}: {
  role: Role;
  onUse: (cred: (typeof DEMO_CREDENTIALS)[number]) => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredCredentials = DEMO_CREDENTIALS.filter((c) => c.role === role);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    });
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-[14px] border border-white/10 bg-[#111c18] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_0_0.5px_rgba(16,185,129,0.08)_inset]">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/30">
        {role === "admin" ? "Admin" : "User"} demo credentials
      </p>
      <div className="flex flex-col gap-3">
        {filteredCredentials.map((cred) => (
          <div
            key={cred.email}
            className="p-3"
          >
            <div className="space-y-1.5">
              {[
                {
                  label: "Email",
                  value: cred.email,
                  key: `${cred.email}-row`,
                },
                {
                  label: "Password",
                  value: cred.password,
                  key: `${cred.email}-pwd-row`,
                },
              ].map(({ label, value, key }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white/3 px-2.5 py-1.5"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-white/25">{label} </span>
                    <span className="font-mono text-[12px] text-white/65">
                      {value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(value, key)}
                    className="shrink-0 text-white/25 transition-colors hover:text-white/60"
                    aria-label={`Copy ${label}`}
                  >
                    {copiedKey === key ? (
                      <Check className="size-3 text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onUse(cred)}
              className="mt-3 h-8 w-full cursor-pointer rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              Use this
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreds, setShowCreds] = useState(false);
  const credsRef = useRef<HTMLDivElement>(null);

  const empty = !email || !password;


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (credsRef.current && !credsRef.current.contains(e.target as Node)) {
        setShowCreds(false);
      }
    }
    if (showCreds) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCreds]);

  function pick(r: Role) {
    setRole(r);
    setEmail("");
    setPassword("");
  }

  function useDemoCredential(cred: (typeof DEMO_CREDENTIALS)[number]) {
    setRole(cred.role);
    setEmail(cred.email);
    setPassword(cred.password);
    setShowCreds(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (empty) return;

    setLoading(true);

    try {
      const result = await login({ email, password, role });

      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully!");
      router.push(result.redirectTo);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-alpha-bg px-4 font-sans sm:px-6">
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      {/* Glows */}
      <div className="pointer-events-none absolute top-[-15%] right-[-10%] h-150 w-175 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14)_0%,rgba(5,150,105,0.06)_40%,transparent_65%)]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-125 w-125 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent_35%,rgb(var(--alpha-bg-rgb)/0.88)_100%)]" />

      <div className="relative z-10 mb-6 flex items-center gap-2.5">
        <BrandLogo />
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-white/80">
          Alpha
        </span>
      </div>

      <div className="relative z-10 w-full max-w-90 sm:max-w-100 lg:max-w-105">
        <div className="rounded-[18px] border border-white/7 bg-alpha-surface p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_0.5px_rgba(16,185,129,0.06)_inset] sm:p-7 lg:px-8 lg:py-8">
          {/* Header row */}
          <div className="mb-5 flex items-center justify-between sm:mb-6">
            <h1 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-[22px]">
              Welcome back
            </h1>

            {/* Info button + popover */}
            <div ref={credsRef} className="relative">
              <button
                id="demo-credentials-toggle"
                type="button"
                onClick={() => setShowCreds((v) => !v)}
                aria-label="Show demo credentials"
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border transition-all",
                  showCreds
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/35 hover:border-white/18 hover:bg-white/8 hover:text-white/60",
                )}
              >
                {showCreds ? (
                  <X className="size-3.5" />
                ) : (
                  <Info className="size-3.5" />
                )}
              </button>

              {showCreds && (
                <CredentialsPopover role={role} onUse={useDemoCredential} />
              )}
            </div>
          </div>

          <div className="mb-5 flex gap-2 sm:mb-5.5">
            {ROLES.map(({ id, label, Icon }) => {
              const active = role === id;
              return (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  onClick={() => pick(id)}
                  className={cn(
                    "h-9 flex-1 cursor-pointer gap-1.5 rounded-lg border text-[13px] font-semibold tracking-[-0.015em] transition-all hover:bg-transparent",
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.75">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/38">
                Email
              </label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@alpha.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-[10px] border-white/8 bg-alpha-input! px-3.5 text-sm tracking-tight text-white/90 shadow-none placeholder:text-white/18 focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/15 sm:h-10.5"
              />
            </div>

            <div className="space-y-1.75">
              <label className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/38">
                Password
              </label>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-[10px] border-white/8 bg-alpha-input! px-3.5 pr-10 text-sm tracking-tight text-white/90 shadow-none placeholder:text-white/18 focus-visible:border-emerald-500/70 focus-visible:ring-emerald-500/15 sm:h-10.5"
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
                "mt-1 h-10 w-full cursor-pointer rounded-[10px] border-0 text-[14.5px] font-semibold tracking-[-0.02em] gap-2 transition-all sm:h-11",
                empty || loading
                  ? "cursor-not-allowed bg-emerald-500/25 text-white/30"
                  : "bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_24px_rgba(16,185,129,0.30)] hover:opacity-90 active:scale-[0.98]",
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
