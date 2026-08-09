import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudyForm } from "@/components/forms/CaseStudyForm";
import { Button } from "@/components/ui/Button";

export default function NewCaseStudyPage() {
  return (
    <>
      <PageHeader
        title="Add Case Study"
        description="Create a new portfolio case study. Fill in the details and publish when ready."
        actions={
          <Link href="/case-studies">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Case Studies
            </Button>
          </Link>
        }
      />

      <CaseStudyForm type="create" />
    </>
  );
}
