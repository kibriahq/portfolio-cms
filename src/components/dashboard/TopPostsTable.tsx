import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatShortDate, formatNumber } from "@/lib/utils";
import type { Post } from "@/types/post";
import { Badge } from "@/components/ui/Badge";

interface TopPostsTableProps {
  posts: Post[];
  limit?: number;
}

export function TopPostsTable({ posts, limit = 5 }: TopPostsTableProps) {
  const rows = [...posts]
    .sort((a, b) => b._count.views - a._count.views)
    .slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Top Posts
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your most viewed published and draft content.
          </p>
        </div>
        <Link
          href="/posts"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium sm:px-6">Title</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="px-5 py-3 font-medium sm:px-6">Date</th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6"
                >
                  No posts yet.
                </td>
              </tr>
            ) : (
              rows.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <PostCover
                        src={post.coverImage}
                        title={post.title}
                        className="h-10 w-10 shrink-0"
                      />
                      <Link
                        href="/posts"
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 sm:px-6">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6">
                    {formatShortDate(post.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right sm:px-6">
                    <Badge variant="neutral">
                      {formatNumber(post._count.views)}
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
