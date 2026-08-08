import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { Button } from "@/components/ui/Button";
import { getCategoryById } from "@/actions/categories";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const category = await getCategoryById(id);
    
    return (
        <>
            <PageHeader
                title="Edit Category"
                description="Update the details of this category."

                actions={
                    <Link href="/categories">
                        <Button variant="secondary">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Categories
                        </Button>
                    </Link>
                }
            />

            <CategoryForm type="edit" category={category} />
        </>
    );
}
