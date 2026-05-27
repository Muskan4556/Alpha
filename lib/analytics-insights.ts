import type { Product, ProductInsightTab } from "@/lib/types/product";

export function getInsightsFromCatalog(
  catalog: Product[],
  tab: ProductInsightTab,
): Product[] {
  if (tab === "top-rated") {
    return [...catalog]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  if (tab === "low-stock") {
    return [...catalog]
      .filter((p) => p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);
  }

  return [...catalog]
    .sort(
      (a, b) =>
        new Date(b.meta.createdAt).getTime() -
        new Date(a.meta.createdAt).getTime(),
    )
    .slice(0, 10);
}
