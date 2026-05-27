import "server-only";

import { hiddenProductIds } from "@/lib/mock-db";
import { getSessionRole } from "@/lib/session-server";
import type {
  GetProductsParams,
  Product,
  ProductInsightTab,
  ProductsResponse,
  SortField,
  SortOrder,
} from "@/lib/types/product";

const BASE_URL = "https://dummyjson.com/products";

const SORT_MAP: Record<string, { sortBy: SortField; order: SortOrder }> = {
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
  "rating-asc": { sortBy: "rating", order: "asc" },
  "name-asc": { sortBy: "title", order: "asc" },
  "name-desc": { sortBy: "title", order: "desc" },
  "stock-asc": { sortBy: "stock", order: "asc" },
  "stock-desc": { sortBy: "stock", order: "desc" },
};

function getEffectivePrice(product: Product): number {
  if (product.discountPercentage > 0) {
    return product.price - (product.price * product.discountPercentage) / 100;
  }
  return product.price;
}

function sortProducts(products: Product[], sort?: string): Product[] {
  const config = sort ? SORT_MAP[sort] : undefined;
  if (!config) return products;

  const { sortBy, order } = config;
  const direction = order === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title, undefined, {
        sensitivity: "base",
      });
    } else if (sortBy === "price") {
      comparison = getEffectivePrice(a) - getEffectivePrice(b);
    } else {
      comparison = (a[sortBy] as number) - (b[sortBy] as number);
    }

    return comparison * direction;
  });
}

function withPublishState(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    isPublished: !hiddenProductIds.has(product.id),
  }));
}

async function fetchFromDummyJson(
  params: GetProductsParams = {},
): Promise<ProductsResponse> {
  const { limit = 30, skip = 0, search, category, sortBy, order } = params;

  const query = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (sortBy) {
    query.set("sortBy", sortBy);
    query.set("order", order ?? "asc");
  }

  let url: string;

  if (search?.trim()) {
    query.set("q", search.trim());
    url = `${BASE_URL}/search?${query}`;
  } else if (category?.trim()) {
    url = `${BASE_URL}/category/${category.trim()}?${query}`;
  } else {
    url = `${BASE_URL}?${query}`;
  }

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<ProductsResponse>;
}

export async function getProducts(
  options: {
    search?: string;
    category?: string;
    sort?: string;
  } = {},
): Promise<ProductsResponse> {
  const { search, category, sort } = options;
  const sortParams = sort ? (SORT_MAP[sort] ?? {}) : {};

  const all: Product[] = [];
  let skip = 0;

  while (true) {
    const data = await fetchFromDummyJson({
      limit: 100,
      skip,
      search: search || undefined,
      category: category || undefined,
      ...sortParams,
    });
    all.push(...data.products);
    skip += data.products.length;
    if (skip >= data.total) break;
  }

  const role = await getSessionRole();
  let products = withPublishState(all);

  if (role === "user") {
    products = products.filter((p) => p.isPublished);
  }

  products = sortProducts(products, sort);

  return {
    products,
    total: products.length,
    skip: 0,
    limit: products.length,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return null;
  }

  const raw = (await res.json()) as Product;
  const role = await getSessionRole();
  const product = withPublishState([raw])[0];

  if (role === "user" && !product.isPublished) {
    return null;
  }

  return product;
}

export async function getCategoryList(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/category-list`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch category list: ${res.status}`);
  }
  return res.json() as Promise<string[]>;
}

export type { ProductInsightTab } from "@/lib/types/product";

export async function getProductInsights(
  tab: ProductInsightTab,
): Promise<Product[]> {
  const role = await getSessionRole();

  if (tab === "top-rated") {
    const data = await fetchFromDummyJson({
      limit: 10,
      sortBy: "rating",
      order: "desc",
    });
    let products = withPublishState(data.products);
    if (role === "user") {
      products = products.filter((p) => p.isPublished);
    }
    return products;
  }

  const { products: all } = await getProducts();

  if (tab === "low-stock") {
    return all
      .filter((p) => p.stock <= 10)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);
  }

  return [...all]
    .sort(
      (a, b) =>
        new Date(b.meta.createdAt).getTime() -
        new Date(a.meta.createdAt).getTime(),
    )
    .slice(0, 10);
}
