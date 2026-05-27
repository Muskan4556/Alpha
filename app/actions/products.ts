"use server";

import {
  getCategoryList,
  getProduct,
  getProductInsights,
  getProducts,
} from "@/lib/data/products";
import type { ProductInsightTab } from "@/lib/types/product";

export async function fetchProducts(search = "", category = "", sort = "") {
  return getProducts({ search, category, sort });
}

export async function fetchProduct(id: number) {
  return getProduct(id);
}

export async function fetchCategories() {
  return getCategoryList();
}

export async function fetchProductInsights(tab: ProductInsightTab) {
  return getProductInsights(tab);
}
