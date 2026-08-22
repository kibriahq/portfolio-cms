import { Pencil, Trash2, Eye, ExternalLink, Code2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Project } from "@/types/project";
import { deleteProject } from "@/actions/projects";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProjectsTableProps {
  projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred while deleting the project"
      );
    }
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Eye className="h-5 w-5" />}
        title="No projects found"
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
              <th className="hidden px-5 py-3 font-medium sm:px-6 lg:table-cell">
                Created
              </th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">Views</th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <PostCover
                      src={project.coverImage}
                      title={project.title}
                      className="h-11 w-11 shrink-0"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                        {project.title.slice(0, 35)}{project.title.length > 35 ? <span className="text-zinc-400 dark:text-zinc-500">...</span> : ''}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        /{project.slug.slice(0, 35)}{project.slug.length > 35 ? '...' : ''}
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-accent-600 dark:text-zinc-500"
                            aria-label="Open live site"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-accent-600 dark:text-zinc-500"
                            aria-label="Open GitHub repository"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <StatusBadge status={project.status} />
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  {project.featured ? (
                    <span className="inline-flex items-center rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
                      Featured
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  {project.displayOrder > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
                      {project.displayOrder}
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6 lg:table-cell">
                  {formatDate(project.createdAt)}
                </td>
                <td className="px-5 py-3 text-right text-zinc-700 dark:text-zinc-300 sm:px-6">
                  {formatNumber(project._count.views)}
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${project.title}`}
                      title="Edit"
                      onClick={() => router.push(`/projects/edit/${project.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${project.title}`}
                      title="Delete"
                      className="text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      onClick={() => handleDelete(project.id)}
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
