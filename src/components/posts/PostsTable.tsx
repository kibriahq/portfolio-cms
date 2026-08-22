import { Pencil, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { CategoryBadge } from "@/components/posts/CategoryBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Post } from "@/types/post";
import { deletePost } from "@/actions/posts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }
    try {
      await deletePost(postId);
      toast.success("Blog deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred while deleting the blog"
      );
    }
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Eye className="h-5 w-5" />}
        title="No blogs found"
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
                Featured
              </th>
              <th className="hidden px-5 py-3 font-medium sm:px-6 md:table-cell">
                Order
              </th>
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
                  <div className="flex items-center gap-3">
                    <PostCover
                      src={post.coverImage}
                      title={post.title}
                      className="h-11 w-11 shrink-0"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                        {post.title.slice(0, 35)}{post.title.length > 35 ? <span className="text-zinc-400 dark:text-zinc-500">...</span> : ''}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        /{post.slug.slice(0, 35)}{post.slug.length > 35 ? '...' : ''}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <StatusBadge status={post.status} />
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  {post.featured ? (
                    <span className="inline-flex items-center rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
                      Featured
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  {post.displayOrder > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
                      {post.displayOrder}
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  <CategoryBadge category={post.category?.name} />
                </td>
                <td className="hidden whitespace-nowrap px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6 lg:table-cell">
                  {formatDate(post.createdAt)}
                </td>
                <td className="px-5 py-3 text-right text-zinc-700 dark:text-zinc-300 sm:px-6">
                  {formatNumber(post._count.views)}
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${post.title}`}
                      title="Edit"
                      onClick={() => router.push(`/blogs/edit/${post.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${post.title}`}
                      title="Delete"
                      className="text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      onClick={() => handleDelete(post.id)}
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
