"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { getInsightsFromCatalog } from "@/lib/analytics-insights";
import { DataTable } from "@/components/ui/data-table";
import type { ProductInsightTab, Product } from "@/lib/types/product";
import { cn, formatCategory } from "@/lib/utils";

const TABS: { id: ProductInsightTab; label: string }[] = [
  { id: "low-stock", label: "Low stock" },
  { id: "latest", label: "Latest" },
  { id: "top-rated", label: "Top rated" },
];

function insightColumn(
  accessorKey: keyof Product,
  header: string,
  render: (product: Product) => React.ReactNode,
  headerClassName = "text-white/45",
): ColumnDef<Product> {
  return {
    accessorKey,
    header,
    enableSorting: false,
    meta: { headerClassName },
    cell: ({ row }) => render(row.original),
  };
}

const insightColumns: ColumnDef<Product>[] = [
  {
    id: "product",
    accessorKey: "title",
    header: "Product",
    enableSorting: false,
    meta: { headerClassName: "pl-6 text-white/45" },
    cell: ({ row }) => {
      const { id, thumbnail, title } = row.original;
      return (
        <div className="pl-6">
          <Link
            href={`/products/${id}`}
            className="group flex items-center gap-3"
          >
            <Image
              src={thumbnail}
              alt={title}
              width={36}
              height={36}
              className="size-9 rounded-md bg-white/5 object-cover"
            />
            <span className="max-w-[200px] truncate text-sm font-medium text-white/85 transition-colors group-hover:text-emerald-400 sm:max-w-xs">
              {title}
            </span>
          </Link>
        </div>
      );
    },
  },
  insightColumn("category", "Category", (p) => (
    <span className="text-sm text-white/50">{formatCategory(p.category)}</span>
  )),
  insightColumn("price", "Price", (p) => (
    <span className="text-sm tabular-nums text-alpha-price">
      ${p.price.toFixed(2)}
    </span>
  )),
  insightColumn("stock", "Stock", (p) => (
    <span className="text-sm tabular-nums text-white/80">{p.stock}</span>
  )),
  insightColumn(
    "rating",
    "Rating",
    (p) => (
      <div className="pr-6 text-right text-sm tabular-nums text-white/80">
        {p.rating.toFixed(1)}
      </div>
    ),
    "pr-6 text-right text-white/45",
  ),
];

export function ProductInsightsTable({ catalog }: { catalog: Product[] }) {
  const [tab, setTab] = useState<ProductInsightTab>("low-stock");

  const rows = useMemo(
    () => getInsightsFromCatalog(catalog, tab),
    [catalog, tab],
  );

  return (
    <div className="rounded-lg border border-white/8 bg-alpha-surface">
      <div className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Products</h2>
          <p className="mt-1 text-sm text-white/45">
            Inventory and catalog highlights
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/8 bg-white/3 p-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === id
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-white/45 hover:text-white/70",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={insightColumns}
        data={rows}
        className="rounded-none border-0"
        emptyMessage="No products in this view"
      />
    </div>
  );
}
