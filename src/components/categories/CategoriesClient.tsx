"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/posts/SearchBar";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import type { Category } from "@/types/category";

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q) ||
        (category.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [categories, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by name, slug, description..."
        className="sm:max-w-sm"
      />
      <CategoriesTable categories={filtered} />
    </div>
  );
}
