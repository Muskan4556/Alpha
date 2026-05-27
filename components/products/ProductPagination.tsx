"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ProductPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-white/50">
        Showing{" "}
        <span className="font-medium text-white/70">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-white/70">{totalItems}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          variant="outline"
          size="sm"
          className="h-8 border-white/10 bg-white/3 px-2 text-xs text-white/70 hover:bg-white/6 sm:px-3"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              if (pageNum > totalPages) {
                pageNum = totalPages - (4 - i);
              }
            }

            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          variant="outline"
          size="sm"
          className="h-8 border-white/10 bg-white/3 px-2 text-xs text-white/70 hover:bg-white/6 sm:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
