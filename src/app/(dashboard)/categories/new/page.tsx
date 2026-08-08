import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/Button";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        title="Add Category"
        description="Create a new category to group related posts together."
        actions={
          <Link href="/categories">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
        }
      />

      <CategoryForm type="create" category={null} />
    </>
  );
}
