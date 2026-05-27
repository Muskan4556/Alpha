"use client";

import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
  /** For metrics like rating where "best first" should show ↑ */
  invertSortIcon?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  invertSortIcon = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-white/40", className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();
  const showUp = invertSortIcon ? sorted === "desc" : sorted === "asc";
  const showDown = invertSortIcon ? sorted === "asc" : sorted === "desc";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 text-white/40 hover:bg-white/5 hover:text-white/70 data-[state=open]:bg-white/5",
        className,
      )}
      onClick={() => {
        const current = column.getIsSorted();
        if (!current) {
          column.toggleSorting(column.getFirstSortDir() === "desc");
        } else {
          column.toggleSorting(current === "asc");
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
