"use client";

function formatCategory(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface CategoryChartProps {
  data: Array<{ category: string; count: number }>;
}

export function CategoryChart({ data }: CategoryChartProps) {
  const items = [...data].sort((a, b) => b.count - a.count).slice(0, 8);
  const max = Math.max(...items.map((d) => d.count), 1);

  return (
    <div className="rounded-lg border border-white/8 bg-alpha-surface">
      <div className="border-b border-white/8 px-6 py-5">
        <h2 className="text-base font-semibold text-white">
          Category distribution
        </h2>
        <p className="mt-1 text-sm text-white/45">
          Number of products per category
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        {items.map((item) => (
          <div key={item.category} className="grid grid-cols-[120px_1fr_40px] items-center gap-4 sm:grid-cols-[140px_1fr_48px]">
            <span className="truncate text-sm text-white/60">
              {formatCategory(item.category)}
            </span>
            <div className="h-2 overflow-hidden rounded-full bg-emerald-500/10">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="text-right text-sm tabular-nums text-emerald-400/90">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
