import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { Button } from "@/components/ui/Button";
import { getProjects } from "@/actions/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects, drafts, and published work."
        actions={
          <Link href="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </Link>
        }
      />

      <ProjectsClient projects={projects} />
    </>
  );
}
