"use client";

interface PublishPieChartProps {
  published: number;
  hidden: number;
}

export function PublishPieChart({ published, hidden }: PublishPieChartProps) {
  const total = published + hidden;
  const publishedPct = total ? (published / total) * 100 : 0;
  const hiddenPct = total ? (hidden / total) * 100 : 0;

  const publishedDeg = (publishedPct / 100) * 360;

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/8 bg-alpha-surface">
      <div className="border-b border-white/8 px-6 py-5">
        <h2 className="text-base font-semibold text-white">
          Published vs hidden
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Catalog visibility for standard users
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div
          className="relative size-40 rounded-full"
          style={{
            background: total
              ? `conic-gradient(
                  rgb(16 185 129) 0deg ${publishedDeg}deg,
                  rgba(16, 185, 129, 0.15) ${publishedDeg}deg 360deg
                )`
              : "rgba(16, 185, 129, 0.08)",
          }}
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-alpha-surface">
            <span className="text-2xl font-semibold tabular-nums text-emerald-400">
              {total}
            </span>
            <span className="text-xs text-white/40">total</span>
          </div>
        </div>

        <div className="mt-8 w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm text-white/55">Published</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-emerald-400">
              {published}{" "}
              <span className="text-white/40">({publishedPct.toFixed(0)}%)</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500/20" />
              <span className="text-sm text-white/55">Hidden</span>
            </div>
            <span className="text-sm font-medium tabular-nums text-white/80">
              {hidden}{" "}
              <span className="text-white/40">({hiddenPct.toFixed(0)}%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
