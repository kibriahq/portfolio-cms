import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseStudyForm } from "@/components/forms/CaseStudyForm";
import { Button } from "@/components/ui/Button";
import { getCaseStudyById } from "@/actions/caseStudies";
import { notFound } from "next/navigation";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy = await getCaseStudyById(id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Case Study"
        description="Update the details of your portfolio case study."
        actions={
          <Link href="/case-studies">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Case Studies
            </Button>
          </Link>
        }
      />

      <CaseStudyForm
        type="edit"
        caseStudy={
          caseStudy
            ? {
                ...caseStudy,
                subTitle: caseStudy.subTitle ?? "",
                excerpt: caseStudy.excerpt ?? "",
                content: caseStudy.content ?? "",
                coverImage: "",
                technologies: caseStudy.technologies.join(", "),
                tags: caseStudy.tags.join(", "),
                displayOrder: caseStudy.displayOrder ?? 0,
                status: caseStudy.status ?? "DRAFT",
                metaTitle: caseStudy.metaTitle ?? "",
                metaDescription: caseStudy.metaDescription ?? "",
                publishedAt: caseStudy.publishedAt
                  ? new Date(caseStudy.publishedAt).toISOString().slice(0, 10)
                  : "",
              }
            : undefined
        }
      />
    </>
  );
}
