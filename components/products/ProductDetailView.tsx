"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProductById } from "@/app/actions/products";
import { ImageCarousel } from "@/components/products/ImageCarousel";
import { PublishToggle } from "@/components/products/PublishToggle";
import { Button } from "@/components/ui/button";
import { ProductDetailSkeleton } from "@/components/skeleton/ProductDetailSkeleton";
import {
  ArrowLeft,
  EyeOff,
  Package,
  ShoppingCart,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import type { Role } from "@/lib/types/auth";
import type { Product } from "@/lib/types/product";
import { cn, formatCategory } from "@/lib/utils";

interface ProductDetailViewProps {
  id: string;
  role: Role;
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/2 px-4 py-3">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-white/85">{value}</p>
    </div>
  );
}

export function ProductDetailView({ id, role }: ProductDetailViewProps) {
  const isAdmin = role === "admin";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchProduct = useCallback(async () => {
    const data = await getProductById(parseInt(id, 10));
    setProduct(data);
    setError(data ? null : "Product not found");
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const data = await getProductById(parseInt(id, 10));
        if (cancelled) return;
        setProduct(data);
        setError(data ? null : "Product not found");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load product");
        setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    const unavailable = !isAdmin && !error;
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
        {unavailable ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 bg-[#111e1a] px-6 py-16 text-center">
            <EyeOff className="size-10 text-white/25" />
            <h2 className="mt-4 text-lg font-semibold text-white/80">
              Product unavailable
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white/45">
              This product is not published in the catalog.
            </p>
          </div>
        ) : (
          <p className="text-sm text-red-400">{error || "Product not found"}</p>
        )}
      </div>
    );
  }

  const salePrice =
    product.price - (product.price * product.discountPercentage) / 100;
  const hasDiscount = product.discountPercentage > 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-emerald-400"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      {isAdmin && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-white/8 bg-[#111e1a] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-white/50">Visibility for standard users</p>
          <PublishToggle
            productId={product.id}
            isPublished={product.isPublished !== false}
            title={product.title}
            showBadge
            onVisibilityChange={refetchProduct}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <ImageCarousel images={product.images} productName={product.title} />

        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-block rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {formatCategory(product.category)}
            </span>
            <h1 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="mt-1.5 text-sm text-white/45">by {product.brand}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-white/15",
                  )}
                />
              ))}
              <span className="ml-1 text-sm font-medium text-white/70">
                {product.rating.toFixed(1)}
              </span>
              {product.reviews.length > 0 && (
                <span className="text-sm text-white/35">
                  ({product.reviews.length} reviews)
                </span>
              )}
            </div>
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium",
                isOutOfStock
                  ? "bg-red-500/15 text-red-400"
                  : isLowStock
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-emerald-500/15 text-emerald-400",
              )}
            >
              {isOutOfStock
                ? "Out of stock"
                : isLowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
            </span>
          </div>

          <div className="py-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold tabular-nums text-emerald-400">
                ${salePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-white/35 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-white/60">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <SpecItem label="SKU" value={product.sku} />
            <SpecItem label="Weight" value={`${product.weight} kg`} />
            <SpecItem
              label="Dimensions"
              value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
            />
            <SpecItem
              label="Min. order"
              value={String(product.minimumOrderQuantity)}
            />
          </div>

          <div className="space-y-2 text-sm text-white/50">
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 size-4 shrink-0 text-white/35" />
              <span>{product.shippingInformation}</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="mt-0.5 size-4 shrink-0 text-white/35" />
              <span>
                {product.warrantyInformation} · {product.returnPolicy}
              </span>
            </div>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/8 bg-white/3 px-2.5 py-1 text-xs text-white/45"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Button
            disabled={isOutOfStock}
            className="h-10 w-full bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            <ShoppingCart className="size-4" />
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-10 lg:mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Package className="size-4 text-white/35" />
            <h2 className="text-base font-semibold text-white">
              Customer reviews
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.slice(0, 6).map((review, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/8 bg-[#111e1a] p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white/85">
                    {review.reviewerName}
                  </p>
                  <div className="flex shrink-0 gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "size-3",
                          j < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/15",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {review.comment}
                </p>
                <p className="mt-3 text-xs text-white/30">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
