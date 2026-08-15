import Link from "next/link";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Project } from "@/types/project";

interface RecentProjectsTableProps {
  projects: Project[];
  limit?: number;
}

export function RecentProjectsTable({
  projects,
  limit = 5,
}: RecentProjectsTableProps) {
  const rows = projects.slice(0, limit);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Projects
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your latest published and draft projects.
          </p>
        </div>
        <Link
          href="/projects"
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
              <th className="px-5 py-3 text-right font-medium sm:px-6">Views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((project) => (
              <tr
                key={project.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <PostCover
                      src={project.coverImage}
                      title={project.title}
                      className="h-10 w-10 shrink-0"
                    />
                    <Link
                      href="/projects"
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {project.title}
                    </Link>
                  </div>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-5 py-3 text-right sm:px-6">
                  <span className="inline-flex items-center justify-end gap-1 text-zinc-700 dark:text-zinc-300">
                    <Eye className="h-3.5 w-3.5 text-zinc-400" />
                    {formatNumber(project._count.views)}
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
