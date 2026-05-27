"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCategory } from "@/lib/utils";
import { SORT_LABELS } from "@/lib/types/product";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 text-white/30 sm:mr-1">
        <SlidersHorizontal className="size-3.5" />
        <span className="text-xs font-medium uppercase tracking-wider">
          Filters
        </span>
      </div>

      <Select
        value={selectedCategory || undefined}
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="h-10 w-full rounded-xl border-white/8 bg-white/4 text-base text-white sm:w-44">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111e1a]">
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {formatCategory(cat)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy || undefined} onValueChange={onSortChange}>
        <SelectTrigger className="h-10 w-full rounded-xl border-white/8 bg-white/4 text-base text-white sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#111e1a]">
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
