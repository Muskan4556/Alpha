"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageSearch, X } from "lucide-react";
import { fetchCategories, fetchProducts } from "@/app/actions/products";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductPagination } from "@/components/products/ProductPagination";
import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/button";
import { ProductsTableSkeleton } from "@/components/skeleton/ProductsTableSkeleton";
import { formatCategory } from "@/lib/utils";
import type { Role } from "@/lib/types/auth";
import type { Product } from "@/lib/types/product";

const ITEMS_PER_PAGE = 12;

interface ProductsViewProps {
  role: Role;
}

export function ProductsView({ role }: ProductsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = role === "admin";

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const refetchProducts = useCallback(async () => {
    const data = await fetchProducts(search, category, sort);
    setProducts(data.products);
    setError(null);
  }, [search, category, sort]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchProducts(search, category, sort);
        if (cancelled) return;
        setProducts(data.products);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [search, category, sort]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, page]);

  const hasActiveFilters = Boolean(search || category || sort);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setLoading(true);
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(
    (query: string) => updateParams({ search: query || null, page: "1" }),
    [updateParams],
  );

  const handleCategoryChange = useCallback(
    (cat: string) => updateParams({ category: cat || null, page: "1" }),
    [updateParams],
  );

  const handleSortChange = useCallback(
    (sortBy: string) => updateParams({ sort: sortBy || null, page: "1" }),
    [updateParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => updateParams({ page: newPage.toString() }),
    [updateParams],
  );

  const clearAllFilters = useCallback(() => router.push("/products"), [router]);

  const sortLabel = useMemo(() => {
    const labels: Record<string, string> = {
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
      "rating-desc": "Rating: High to Low",
      "rating-asc": "Rating: Low to High",
      "name-asc": "Name: A to Z",
      "name-desc": "Name: Z to A",
      "stock-asc": "Stock: Low to High",
      "stock-desc": "Stock: High to Low",
    };
    return sort ? labels[sort] : null;
  }, [sort]);

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
              <span className="font-medium text-white/80">
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"}
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
        <ProductSearch key={search} value={search} onSearch={handleSearch} />
        <ProductFilters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          sortBy={sort}
          onSortChange={handleSortChange}
        />

        {hasActiveFilters && !loading && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-sm text-white/30">Active:</span>
            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                &ldquo;{search}&rdquo;
                <X className="size-3" />
              </button>
            )}
            {category && (
              <button
                type="button"
                onClick={() => handleCategoryChange("")}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                {formatCategory(category)}
                <X className="size-3" />
              </button>
            )}
            {sortLabel && (
              <button
                type="button"
                onClick={() => handleSortChange("")}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
              >
                {sortLabel}
                <X className="size-3" />
              </button>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
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
        ) : paginatedProducts.length > 0 ? (
          <>
            <ProductTable
              products={paginatedProducts}
              sort={sort}
              onSortChange={handleSortChange}
              isAdmin={isAdmin}
              onVisibilityChange={refetchProducts}
            />

            {products.length > ITEMS_PER_PAGE && (
              <div className="mt-8 border-t border-white/6 pt-6">
                <ProductPagination
                  currentPage={page}
                  totalItems={products.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
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
                onClick={clearAllFilters}
                className="mt-5 border-white/10 bg-transparent text-emerald-400 hover:bg-emerald-500/10"
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
