"use client";

import { useState, useEffect, useMemo } from "react";
import { StatCard } from "@/components/analytics/StatCard";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { PublishPieChart } from "@/components/analytics/PublishPieChart";
import { ProductInsightsTable } from "@/components/analytics/ProductInsightsTable";
import { AnalyticsSkeleton } from "@/components/skeleton/AnalyticsSkeleton";
import { getCatalogForAnalytics } from "@/app/actions/products";
import type { Product } from "@/lib/types/product";

export function AnalyticsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const products = await getCatalogForAnalytics();
        if (cancelled) return;
        setProducts(products);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to fetch analytics:", error);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const avgRating = total
      ? products.reduce((s, p) => s + p.rating, 0) / total
      : 0;
    const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

    const categoryMap = new Map<string, number>();
    products.forEach((p) => {
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const hidden = products.filter((p) => !p.isPublished).length;

    return {
      total,
      published: total - hidden,
      hidden,
      avgRating: Math.round(avgRating * 100) / 100,
      inventoryValue,
      categoryData,
    };
  }, [products]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <AnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Analytics
        </h1>
        <p className="mt-1.5 text-base text-white/50">
          Catalog overview and inventory insights
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={stats.total} />
        <StatCard label="Published products" value={stats.published} />
        <StatCard label="Average rating" value={stats.avgRating} />
        <StatCard
          label="Inventory value"
          value={`$${stats.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryChart data={stats.categoryData} />
        </div>
        <PublishPieChart published={stats.published} hidden={stats.hidden} />
      </section>

      <section>
        <ProductInsightsTable catalog={products} />
      </section>
    </div>
  );
}
