export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: AvailabilityStatus;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
  // client-side field
  isPublished?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortField = "price" | "rating" | "title" | "stock";
export type SortOrder = "asc" | "desc";

export type ProductInsightTab = "low-stock" | "latest" | "top-rated";

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
}

export const PAGE_SIZE = 10;

export const SORT_MAP: Record<string, { sortBy: SortField; order: SortOrder }> =
  {
    "price-asc": { sortBy: "price", order: "asc" },
    "price-desc": { sortBy: "price", order: "desc" },
    "rating-desc": { sortBy: "rating", order: "desc" },
    "rating-asc": { sortBy: "rating", order: "asc" },
    "name-asc": { sortBy: "title", order: "asc" },
    "name-desc": { sortBy: "title", order: "desc" },
    "stock-asc": { sortBy: "stock", order: "asc" },
    "stock-desc": { sortBy: "stock", order: "desc" },
  };

export const SORT_LABELS: Record<keyof typeof SORT_MAP, string> = {
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
  "rating-asc": "Rating: Low to High",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
  "stock-asc": "Stock: Low to High",
  "stock-desc": "Stock: High to Low",
};
