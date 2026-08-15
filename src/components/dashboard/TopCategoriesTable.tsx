import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import type { Category } from "@/types/category";
import { Badge } from "@/components/ui/Badge";

interface TopCategoriesTableProps {
  categories: Category[];
  limit?: number;
}

export function TopCategoriesTable({
  categories,
  limit = 5,
}: TopCategoriesTableProps) {
  const rows = [...categories]
    .sort(
      (a, b) =>
        (b._count?.blogs ?? 0) - (a._count?.blogs ?? 0)
    )
    .slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Top Categories
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Categories ranked by total blogs.
          </p>
        </div>
        <Link
          href="/categories"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium sm:px-6">Category</th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">
                Blogs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6"
                >
                  No categories yet.
                </td>
              </tr>
            ) : (
              rows.map((category) => (
                <tr
                  key={category.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-3 sm:px-6">
                    <Link
                      href="/categories"
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <Badge variant="neutral">
                      {formatNumber(category._count?.blogs ?? 0)}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
