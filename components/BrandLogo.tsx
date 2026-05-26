import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.35)]",
        className,
      )}
    >
      <svg
        className="size-4 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.95" />
        <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.40" />
        <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.40" />
        <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.95" />
      </svg>
    </div>
  );
}
