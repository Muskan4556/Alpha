"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function ProductSearch({
  value,
  onSearch,
  placeholder = "Search products by name or description…",
}: ProductSearchProps) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== value) onSearch(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, value, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-11 rounded-xl border-white/8 bg-white/4 pl-10 pr-9 text-base text-white placeholder:text-white/30 focus-visible:border-emerald-500/40 focus-visible:ring-emerald-500/10"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
