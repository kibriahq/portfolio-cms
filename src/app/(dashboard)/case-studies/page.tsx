import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudiesClient } from "@/components/case-studies/CaseStudiesClient";
import { Button } from "@/components/ui/Button";
import { getCaseStudies } from "@/actions/caseStudies";

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <PageHeader
        title="Case Studies"
        description="Manage your portfolio case studies, drafts, and published work."
        actions={
          <Link href="/case-studies/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Case Study
            </Button>
          </Link>
        }
      />

      <CaseStudiesClient caseStudies={caseStudies} />
    </>
  );
}
