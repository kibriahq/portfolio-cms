import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoriesClient } from "@/components/categories/CategoriesClient";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/lib/utils";

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize your posts into meaningful groups and topics."
        actions={
          <Link href="/categories/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </Link>
        }
      />

      <CategoriesClient categories={categories} />
    </>
  );
}
