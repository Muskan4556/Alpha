"use server";

import { hiddenProductIds } from "@/lib/mock-db";
import { getSessionRole } from "@/lib/session-server";
import type { Role } from "@/lib/types/auth";
import {
  SORT_MAP,
  PAGE_SIZE,
  type Product,
  type ProductsResponse,
  type SortField,
  type SortOrder,
} from "@/lib/types/product";

const BASE_URL = "https://dummyjson.com/products";

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

function applyRoleFilter(products: Product[], role: Role | null): Product[] {
  let result = withPublishState(products);
  if (role === "user") {
    result = result.filter((p) => p.isPublished);
  }
  return result;
}

/** Count published products for users — reuses `apiTotal` from the page response (no extra probe). */
async function countVisibleProducts(
  search: string,
  category: string,
  sort: string,
  apiTotal: number,
  role: Role,
): Promise<number> {
  if (apiTotal === 0) return 0;

  const { sortBy, order } = getSortQuery(sort);

  const data = await getProductList({
    limit: apiTotal,
    skip: 0,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  });

  return applyRoleFilter(data.products, role).length;
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
    limit = PAGE_SIZE,
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
  const products = applyRoleFilter(data.products, role);

  const total =
    role === "user"
      ? await countVisibleProducts(search, category, sort, data.total, role)
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
  const listOptions = {
    skip: 0,
    search: search || undefined,
    category: category || undefined,
    sortBy,
    order,
  };

  const meta = await getProductList({ limit: PAGE_SIZE, ...listOptions });
  if (meta.total === 0) return [];

  const data = await getProductList({ limit: meta.total, ...listOptions });
  const role = await getSessionRole();
  return applyRoleFilter(data.products, role);
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/${id}`, catalogRequest);

  if (!res.ok) {
    return null;
  }

  const raw = (await res.json()) as Product;
  const role = await getSessionRole();
  const [product] = applyRoleFilter([raw], role);

  return product ?? null;
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/category-list`, catalogRequest);
  if (!res.ok) {
    throw new Error(`Failed to load categories: ${res.status}`);
  }
  return res.json() as Promise<string[]>;
}

export async function getCatalogForAnalytics(): Promise<Product[]> {
  return getFullCatalog();
}

export async function getProductsWithCategories(
  search = "",
  category = "",
  sort = "",
  page = 1,
): Promise<ProductsResponse & { categories: string[] }> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(search, category, sort, page),
  ]);

  return { categories, ...products };
}
