import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostForm } from "@/components/forms/PostForm";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/actions/categories";

export default async function NewPostPage() {
  const categories = await getCategories();
  
  return (
    <>
      <PageHeader
        title="Add Post"
        description="Create a new blog post. Fill in the details and publish when ready."
        actions={
          <Link href="/posts">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </Button>
          </Link>
        }
      />

      <PostForm type="create" categories={categories} />
    </>
  );
}
