"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
  /** First click sorts high → low (e.g. rating, stock). Default: low → high. */
  sortDescFirst?: boolean;
  /** Show ↑ when sorted high-first and ↓ when low-first (better for rating UX). */
  invertSortIcon?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sortDescFirst = false,
  invertSortIcon = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-white/40", className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();
  const isDesc = sorted === "desc";
  const isAsc = sorted === "asc";
  const showUp = invertSortIcon ? isDesc : isAsc;
  const showDown = invertSortIcon ? isAsc : isDesc;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 text-white/40 hover:bg-white/5 hover:text-white/70 data-[state=open]:bg-white/5",
        className,
      )}
      onClick={() => {
        if (!sorted) {
          column.toggleSorting(sortDescFirst);
        } else {
          column.toggleSorting(sorted === "asc");
        }
      }}
    >
      <span>{title}</span>
      {showDown ? (
        <ArrowDown className="size-3.5" />
      ) : showUp ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </Button>
  );
}
