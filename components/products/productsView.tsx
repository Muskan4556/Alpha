"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageSearch, X } from "lucide-react";
import { getCategories, getProducts } from "@/app/actions/products";
import { useRefetchOnTabVisible } from "@/hooks/use-refetch-on-tab-visible";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductPagination } from "@/components/products/ProductPagination";
import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { ProductsTableSkeleton } from "@/components/skeleton/ProductsTableSkeleton";
import { formatCategory } from "@/lib/utils";
import type { Role } from "@/lib/types/auth";
import { SORT_LABELS, PAGE_SIZE, type Product } from "@/lib/types/product";

export function ProductsView({ role }: { role: Role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = role === "admin";

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function applyProductData(data: Awaited<ReturnType<typeof getProducts>>) {
    setProducts(data.products);
    setTotal(data.total);
    setError(null);
  }

  function applyProductError(err: unknown) {
    setError(err instanceof Error ? err.message : "Failed to load products");
    setProducts([]);
    setTotal(0);
  }

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const data = await getProducts(search, category, sort, page);
        if (cancelled) return;
        applyProductData(data);
      } catch (err) {
        if (cancelled) return;
        applyProductError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [search, category, sort, page]);

  async function refetchProducts(silent = false) {
    try {
      const data = await getProducts(search, category, sort, page);
      applyProductData(data);
    } catch (err) {
      if (silent) return;
      applyProductError(err);
    }
  }

  // Users: silent refresh 
  useRefetchOnTabVisible(!isAdmin, () => refetchProducts(true));

  function updateParams(updates: Record<string, string | null>) {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  const hasActiveFilters = Boolean(search || category || sort);
  const sortLabel =
    sort && sort in SORT_LABELS
      ? SORT_LABELS[sort as keyof typeof SORT_LABELS]
      : null;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Products
        </h1>
        <p className="mt-1.5 text-base text-white/50">
          {loading ? (
            "Loading catalog…"
          ) : (
            <>
              <span className="font-medium text-white/80">{total}</span>{" "}
              {total === 1 ? "product" : "products"}
              {isAdmin && (
                <span className="text-white/35">
                  {" "}
                  · toggle visibility in the table
                </span>
              )}
            </>
          )}
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-white/6 bg-white/2 p-4 sm:p-5">
        <ProductSearch
          key={search}
          value={search}
          onSearch={(query) =>
            updateParams({ search: query || null, page: "1" })
          }
        />
        <ProductFilters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={(cat) =>
            updateParams({ category: cat || null, page: "1" })
          }
          sortBy={sort}
          onSortChange={(sortBy) =>
            updateParams({ sort: sortBy || null, page: "1" })
          }
        />

        {hasActiveFilters && !loading && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-sm text-white/30">Active:</span>
            {search && (
              <button
                type="button"
                onClick={() => updateParams({ search: null, page: "1" })}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                &ldquo;{search}&rdquo;
                <X className="size-3 cursor-pointer" />
              </button>
            )}
            {category && (
              <button
                type="button"
                onClick={() => updateParams({ category: null, page: "1" })}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                {formatCategory(category)}
                <X className="size-3" />
              </button>
            )}
            {sortLabel && (
              <button
                type="button"
                onClick={() => updateParams({ sort: null, page: "1" })}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                {sortLabel}
                <X className="size-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="text-sm font-medium text-emerald-400/70 hover:text-emerald-400"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-base text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <ProductsTableSkeleton />
        ) : products.length > 0 ? (
          <>
            <ProductTable
              products={products}
              sort={sort}
              onSortChange={(sortBy) =>
                updateParams({ sort: sortBy || null, page: "1" })
              }
              isAdmin={isAdmin}
              onVisibilityChange={refetchProducts}
            />

            {total > PAGE_SIZE && (
              <div className="mt-8 border-t border-white/6 pt-6">
                <ProductPagination
                  currentPage={page}
                  totalItems={total}
                  itemsPerPage={PAGE_SIZE}
                  onPageChange={(newPage) =>
                    updateParams({ page: newPage.toString() })
                  }
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 py-16 px-6 text-center">
            <PackageSearch className="size-10 text-white/20" />
            <h3 className="mt-4 text-lg font-semibold text-white/80">
              No products found
            </h3>
            <p className="mt-1 max-w-sm text-base text-white/40">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "The product catalog is empty."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/products")}
                className="mt-5 border-white/10 bg-transparent text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
