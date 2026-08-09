import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Button } from "@/components/ui/Button";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        title="Add Project"
        description="Create a new portfolio project. Fill in the details and publish when ready."
        actions={
          <Link href="/projects">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        }
      />

      <ProjectForm type="create" />
    </>
  );
}
