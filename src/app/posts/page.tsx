import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostsClient } from "@/components/posts/PostsClient";
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/actions/posts";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        title="Posts / Blog"
        description="Manage your blog content, drafts, and published posts."
        actions={
          <Link href="/posts/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Post
            </Button>
          </Link>
        }
      />

      <PostsClient posts={posts} />
    </>
  );
}
