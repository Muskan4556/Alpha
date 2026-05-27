"use server";

import { hiddenProductIds } from "@/lib/mock-db";
import { getSessionRole } from "@/lib/session-server";
import {
  SORT_MAP,
  PAGE_SIZE,
  type Product,
  type ProductInsightTab,
  type ProductsResponse,
  type SortField,
  type SortOrder,
} from "@/lib/types/product";

const BASE_URL = "https://dummyjson.com/products";
const DEFAULT_API_LIMIT = 30;
const CATALOG_SIZE = 194;

const catalogRequest: RequestInit =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 300 } };

function withPublishState(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    isPublished: !hiddenProductIds.has(product.id),
  }));
}

async function applyRoleFilter(products: Product[]): Promise<Product[]> {
  const role = await getSessionRole();
  let result = withPublishState(products);
  if (role === "user") {
    result = result.filter((p) => p.isPublished);
  }
  return result;
}

async function countVisibleProducts(
  search = "",
  category = "",
  sort = "",
): Promise<number> {
  const { sortBy, order } = getSortQuery(sort);

  const meta = await getProductList({
    limit: 1,
    skip: 0,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  });

  if (meta.total === 0) return 0;

  const data = await getProductList({
    limit: meta.total,
    skip: 0,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  });

  const products = await applyRoleFilter(data.products);
  return products.length;
}

async function getProductList(options: {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
}): Promise<ProductsResponse> {
  const {
    limit = DEFAULT_API_LIMIT,
    skip = 0,
    search,
    category,
    sortBy,
    order,
  } = options;

  const query = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  if (sortBy) {
    query.set("sortBy", sortBy);
    query.set("order", order ?? "desc");
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

  const res = await fetch(url, catalogRequest);

  if (!res.ok) {
    throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ProductsResponse>;
}

function getSortQuery(sort: string) {
  const sortConfig = sort ? SORT_MAP[sort] : undefined;
  return {
    sortBy: sortConfig?.sortBy,
    order: sortConfig?.order,
  };
}


export async function getProducts(
  search = "",
  category = "",
  sort = "",
  page = 1,
  limit = PAGE_SIZE,
): Promise<ProductsResponse> {
  const skip = Math.max(0, (page - 1) * limit);
  const { sortBy, order } = getSortQuery(sort);

  const data = await getProductList({
    limit,
    skip,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  });

  const role = await getSessionRole();
  const products = await applyRoleFilter(data.products);

  const total =
    role === "user"
      ? await countVisibleProducts(search, category, sort)
      : data.total;

  return {
    products,
    total,
    skip: data.skip,
    limit: data.limit,
  };
}

async function getFullCatalog(
  search = "",
  category = "",
  sort = "",
): Promise<Product[]> {
  const { sortBy, order } = getSortQuery(sort);

  const data = await getProductList({
    limit: CATALOG_SIZE,
    skip: 0,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  });

  return applyRoleFilter(data.products);
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/${id}`, catalogRequest);

  if (!res.ok) {
    return null;
  }

  const raw = (await res.json()) as Product;
  const [product] = await applyRoleFilter([raw]);

  return product ?? null;
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/category-list`, catalogRequest);
  if (!res.ok) {
    throw new Error(`Failed to load categories: ${res.status}`);
  }
  return res.json() as Promise<string[]>;
}

export async function getInsights(tab: ProductInsightTab): Promise<Product[]> {
  if (tab === "top-rated") {
    const data = await getProductList({
      limit: 10,
      sortBy: "rating",
      order: "desc",
    });
    return applyRoleFilter(data.products);
  }

  if (tab === "low-stock") {
    const data = await getProductList({
      limit: 50,
      sortBy: "stock",
      order: "asc",
    });
    const products = await applyRoleFilter(data.products);
    return products.filter((p) => p.stock <= 10).slice(0, 10);
  }

  const all = await getFullCatalog();
  return [...all]
    .sort(
      (a, b) =>
        new Date(b.meta.createdAt).getTime() -
        new Date(a.meta.createdAt).getTime(),
    )
    .slice(0, 10);
}

export async function getCatalogForAnalytics(): Promise<Product[]> {
  return getFullCatalog();
}
