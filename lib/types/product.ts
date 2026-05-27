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
