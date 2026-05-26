import type {
  GetProductsParams,
  Product,
  ProductsResponse,
} from "@/lib/types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(
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

// Single Product
export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Product ${id} not found: ${res.status}`);
  }

  return res.json() as Promise<Product>;
}

// Categories List
export async function getCategoryList(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/category-list`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch category list: ${res.status}`);
  return res.json() as Promise<string[]>;
}
