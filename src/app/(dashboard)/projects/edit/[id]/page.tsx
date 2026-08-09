import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/Button";
import { getProjectById } from "@/actions/projects";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Project"
        description="Update the details of your portfolio project."
        actions={
          <Link href="/projects">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        }
      />

      <ProjectForm
        type="edit"
        project={
          project
            ? {
                ...project,
                subTitle: project.subTitle ?? "",
                excerpt: project.excerpt ?? "",
                description: project.description ?? "",
                coverImage: "",
                technologies: project.technologies.join(", "),
                liveUrl: project.liveUrl ?? "",
                githubUrl: project.githubUrl ?? "",
                displayOrder: project.displayOrder ?? 0,
                status: project.status ?? "DRAFT",
                metaTitle: project.metaTitle ?? "",
                metaDescription: project.metaDescription ?? "",
              }
            : undefined
        }
      />
    </>
  );
}
