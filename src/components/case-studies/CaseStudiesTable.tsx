import { Pencil, Trash2, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/posts/StatusBadge";
import { PostCover } from "@/components/posts/PostCover";
import { formatDate, formatNumber } from "@/lib/utils";
import type { CaseStudy } from "@/types/caseStudy";
import { deleteCaseStudy } from "@/actions/caseStudies";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface CaseStudiesTableProps {
  caseStudies: CaseStudy[];
}

export function CaseStudiesTable({ caseStudies }: CaseStudiesTableProps) {
  const router = useRouter();

  const handleDelete = async (caseStudyId: string) => {
    if (!confirm("Are you sure you want to delete this case study? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteCaseStudy(caseStudyId);
      toast.success("Case study deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred while deleting the case study"
      );
    }
  }

  if (caseStudies.length === 0) {
    return (
      <EmptyState
        icon={<Eye className="h-5 w-5" />}
        title="No case studies found"
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
            {caseStudies.map((caseStudy) => (
              <tr
                key={caseStudy.id}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-3">
                    <PostCover
                      src={caseStudy.coverImage}
                      title={caseStudy.title}
                      className="h-11 w-11 shrink-0"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                        {caseStudy.title.slice(0, 35)}{caseStudy.title.length > 35 ? <span className="text-zinc-400 dark:text-zinc-500">...</span> : ''}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        /{caseStudy.slug.slice(0, 35)}{caseStudy.slug.length > 35 ? '...' : ''}
                      </span>
                      {caseStudy.tags.length > 0 ? (
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {caseStudy.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {caseStudy.tags.length > 3 ? (
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              +{caseStudy.tags.length - 3}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <StatusBadge status={caseStudy.status} />
                </td>
                <td className="hidden px-5 py-3 sm:px-6 md:table-cell">
                  {caseStudy.featured ? (
                    <span className="inline-flex items-center rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-300">
                      Featured
                    </span>
                  ) : (
                    <span className="text-zinc-400 dark:text-zinc-500">—</span>
                  )}
                </td>
                <td className="hidden whitespace-nowrap px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6 lg:table-cell">
                  {formatDate(caseStudy.createdAt)}
                </td>
                <td className="px-5 py-3 text-right text-zinc-700 dark:text-zinc-300 sm:px-6">
                  {formatNumber(caseStudy._count.views)}
                </td>
                <td className="px-5 py-3 sm:px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${caseStudy.title}`}
                      title="Edit"
                      onClick={() => router.push(`/case-studies/edit/${caseStudy.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${caseStudy.title}`}
                      title="Delete"
                      className="text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      onClick={() => handleDelete(caseStudy.id)}
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
