interface StatCardProps {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#111e1a] px-6 py-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-emerald-400">
        {value}
      </p>
    </div>
  );
}
