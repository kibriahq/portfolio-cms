import Link from "next/link";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Post } from "@/types/post";

interface RecentPostsTableProps {
  posts: Post[];
  limit?: number;
}

export function RecentPostsTable({ posts, limit = 5 }: RecentPostsTableProps) {
  const rows = posts.slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Posts
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your latest published and draft content.
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
            {rows.map((post) => (
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
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-5 py-3 text-right sm:px-6">
                  <span className="inline-flex items-center justify-end gap-1 text-zinc-700 dark:text-zinc-300">
                    <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    {formatNumber(post.views)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
