import { Pencil, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { CategoryBadge } from "@/components/posts/CategoryBadge";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Post } from "@/types/post";

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Eye className="h-5 w-5" />}
        title="No posts found"
        description="Try adjusting your search or filters to find what you are looking for."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium sm:px-6">Title</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="hidden px-5 py-3 font-medium sm:px-6 md:table-cell">
                Category
              </th>
              <th className="hidden px-5 py-3 font-medium sm:px-6 lg:table-cell">
                Published
              </th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">Views</th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {post.title}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      /{post.slug}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <StatusBadge status={post.status} />
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  <CategoryBadge category={post.category} />
                </td>
                <td className="hidden whitespace-nowrap px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6 lg:table-cell">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-5 py-3 text-right text-zinc-700 dark:text-zinc-300 sm:px-6">
                  {formatNumber(post.views)}
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${post.title}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${post.title}`}
                      title="Delete"
                      className="text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
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
