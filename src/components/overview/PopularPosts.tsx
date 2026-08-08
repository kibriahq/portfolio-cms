import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eye } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Post } from "@/types/post";

interface PopularPostsProps {
  posts: Post[];
}

export function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No posts yet" />
        </CardContent>
      </Card>
    );
  }

  const max = Math.max(...posts.map((post) => post._count.views), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post, index) => {
          const percentage = Math.round((post._count.views / max) * 100);
          return (
            <div key={post.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-100 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {post.title}
                  </span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(post._count.views)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent-600 transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
