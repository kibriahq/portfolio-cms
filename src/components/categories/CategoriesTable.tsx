"use client";

import { useRouter } from "next/navigation";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/types/category";
import Link from "next/link";
import { deleteCategory } from "@/actions/categories";
import { toast } from "react-toastify";

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen className="h-5 w-5" />}
        title="No categories found"
        description="Try adjusting your search to find what you are looking for."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium sm:px-6">Name</th>
              <th className="hidden px-5 py-3 font-medium sm:px-6 md:table-cell">
                Slug
              </th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">
                Description
              </th>
              <th className="px-5 py-3 font-medium sm:px-6">Posts</th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                      {category.name}
                    </span>
                    {category.description ? null : (
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        No description
                      </span>
                    )}
                  </div>
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    /{category.slug}
                  </span>
                </td>
                <td className="hidden px-5 py-3 text-zinc-500 dark:text-zinc-400 lg:table-cell">
                  <span className="line-clamp-1 max-w-xs">
                    {category.description ?? "—"}
                  </span>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <Badge variant="neutral">
                    {category?._count?.blogs}
                  </Badge>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/categories/edit/${category.id}`}
                      aria-label={`Edit ${category.name}`}
                      className="p-2.5 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${category.name}`}
                      title="Delete"
                      className="text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
