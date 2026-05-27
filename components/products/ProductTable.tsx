"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import {
  type ColumnDef,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { Star } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { PublishToggle } from "@/components/products/PublishToggle";
import type { Product } from "@/lib/types/product";
import { cn, formatCategory } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  sort?: string;
  onSortChange?: (sort: string) => void;
  isAdmin?: boolean;
  onVisibilityChange?: () => void | Promise<void>;
}

function parseSortParam(sort: string): SortingState {
  if (!sort) return [];

  const [field, order] = sort.split("-");
  const id = field === "name" ? "title" : field;
  return [{ id, desc: order === "desc" }];
}

function formatSortParam(sorting: SortingState): string {
  if (!sorting.length) return "";

  const { id, desc } = sorting[0];
  const field = id === "title" ? "name" : id;
  return `${field}-${desc ? "desc" : "asc"}`;
}

function getColumns(
  isAdmin: boolean,
  onVisibilityChange?: () => void | Promise<void>,
): ColumnDef<Product>[] {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      enableHiding: false,
      meta: { label: "Product" },
      cell: ({ row }) => {
        const product = row.original;
        const isHidden = product.isPublished === false;

        return (
          <Link
            href={`/products/${product.id}`}
            className={cn(
              "group flex items-center gap-3",
              isHidden && "opacity-60",
            )}
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-lg bg-white/5 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-white/90 transition-colors group-hover:text-emerald-400">
                {product.title}
              </p>
              {product.brand && (
                <p className="truncate text-sm text-white/40">{product.brand}</p>
              )}
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="hidden text-sm text-white/50 capitalize sm:inline">
          {formatCategory(row.getValue("category"))}
        </span>
      ),
      meta: { label: "Category", headerClassName: "hidden sm:table-cell" },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      meta: { label: "Price" },
      cell: ({ row }) => {
        const product = row.original;
        const hasDiscount = product.discountPercentage > 0;
        const salePrice = hasDiscount
          ? product.price - (product.price * product.discountPercentage) / 100
          : product.price;

        return (
          <div>
            <span className="text-base font-semibold text-emerald-400">
              ${salePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <p className="text-sm text-white/30 line-through">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      sortDescFirst: true,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Rating"
          className="hidden md:flex"
          invertSortIcon
        />
      ),
      cell: ({ row }) => (
        <div className="hidden items-center gap-1 md:flex">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-base text-white/70">
            {(row.getValue("rating") as number).toFixed(1)}
          </span>
        </div>
      ),
      meta: { label: "Rating", headerClassName: "hidden md:table-cell" },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Stock"
          className="hidden lg:flex"
        />
      ),
      cell: ({ row }) => (
        <span className="hidden text-base text-white/50 lg:inline">
          {row.getValue("stock")}
        </span>
      ),
      meta: { label: "Stock", headerClassName: "hidden lg:table-cell" },
    },
    {
      accessorKey: "availabilityStatus",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span
            className={cn(
              "hidden rounded-md px-2 py-0.5 text-xs font-semibold lg:inline-flex",
              product.stock === 0
                ? "bg-red-500/15 text-red-400"
                : product.stock <= 10
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-emerald-500/15 text-emerald-400",
            )}
          >
            {product.availabilityStatus}
          </span>
        );
      },
      meta: { label: "Status", headerClassName: "hidden lg:table-cell" },
    },
  ];

  if (isAdmin) {
    columns.push({
      id: "published",
      header: "Visibility",
      enableSorting: false,
      meta: { label: "Visibility" },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <PublishToggle
            productId={product.id}
            isPublished={product.isPublished !== false}
            title={product.title}
            showBadge
            compact
            onVisibilityChange={onVisibilityChange}
          />
        );
      },
    });
  }

  return columns;
}

export function ProductTable({
  products,
  sort = "",
  onSortChange,
  isAdmin = false,
  onVisibilityChange,
}: ProductTableProps) {
  const columns = useMemo(
    () => getColumns(isAdmin, onVisibilityChange),
    [isAdmin, onVisibilityChange],
  );
  const sorting = useMemo(() => parseSortParam(sort), [sort]);

  const handleSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      onSortChange?.(formatSortParam(next));
    },
    [sorting, onSortChange],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      manualSorting
      showColumnToggle
    />
  );
}
