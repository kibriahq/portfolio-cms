import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostForm } from "@/components/forms/PostForm";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/actions/categories";
import { getPostById } from "@/actions/posts";
import { notFound } from "next/navigation";

export default async function NewPostPage({ params }: { params: Promise<{ id: string }> }) {
    const categories = await getCategories();
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    return (
        <>
            <PageHeader
                title="Edit Post"
                description="Update the details of your blog post."
                actions={
                    <Link href="/posts">
                        <Button variant="secondary">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Posts
                        </Button>
                    </Link>
                }
            />

            <PostForm type="edit" categories={categories} post={
                post
                    ? {
                        ...post,
                        categoryId: post.categoryId ?? "",
                        coverImage: "",
                        excerpt: post.excerpt ?? "",
                        content: post.content ?? "",
                        status: post.status ?? "draft",
                        readingTime: post.readingTime ?? 0,
                        tags: post.tags ?? "",
                        featured: post.featured ?? false,
                        displayOrder: post.displayOrder ?? 0,
                        metaTitle: post.metaTitle ?? "",
                        metaDescription: post.metaDescription ?? ""
                    }
                    : undefined
            } />
        </>
    );
}
