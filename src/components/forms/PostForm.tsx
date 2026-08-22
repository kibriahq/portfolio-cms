"use client";

import { useEffect } from "react";
import { Eye, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { PostStatus } from "@/types/post";
import { RichTextEditor } from "./RichTextEditor";
import { Category } from "@/types/category";
import slugify from "@/utils/slugify";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form"
import { toast } from "react-toastify";
import { createPost, updatePost } from "@/actions/posts";
import { useRouter } from "next/navigation";


type Inputs = {
  title: string
  slug: string
  categoryId: string
  coverImage: string
  excerpt: string
  content: string
  status: PostStatus
  readingTime: number
  tags: string
  metaTitle: string
  metaDescription: string
  featured: boolean
  displayOrder: number
};

export function PostForm({ type, categories, post }: { type: "create" | "edit", categories: Category[], post?: Inputs & { id: string } }) {
  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<Inputs>({ defaultValues: post ? {...post, coverImage: ""} : undefined });

  const router = useRouter();

  // on change title, update slug automatically if type is create
  const title = useWatch({ control, name: "title" })
  const slug = useWatch({ control, name: "slug" })
  const content = useWatch({ control, name: "content" }) ?? "";
  
  useEffect(() => {
    if (type === "create" && title) {
      setValue("slug", slugify(title), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [title, type, setValue]);

  useEffect(() => {
    if (type === "edit" && title && !slug) {
      setValue("slug", slugify(title), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [title, slug, type, setValue]);

  useEffect(() => {
      const words = content.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
      
      setValue("readingTime", readingTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
  }, [content, type, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = {
      ...data,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    };

   if(type === "create") {
      try {
        await createPost(payload);
        toast.success("Blog created successfully");
        router.push("/blogs");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred while creating the blog"
        );
      }
    } 
    
    if(type === "edit" && post?.id) {
      try {
        await updatePost(post.id, payload);
        toast.success("Blog updated successfully");
        router.push("/blogs");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred while updating the blog"
        );
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      <div className="space-y-6 md:col-span-2">
        <Card className="space-y-5 p-5 sm:p-6">
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="An interesting post title"
              className={inputClass}
            />
            {errors.title && (
              <span className="text-sm text-destructive text-red-500">
                {errors.title.message}
              </span>
            )}
          </Field>

          <Field label="Slug" htmlFor="slug">
            <input
              id="slug"
              {...register("slug", { required: "Slug is required" })}
              placeholder="my-post-slug"
              className={inputClass}
            />
            {errors.slug && (
              <span className="text-sm text-destructive text-red-500">
                {errors.slug.message}
              </span>
            )}
          </Field>

          <Field label="Excerpt" htmlFor="excerpt">
            <textarea
              id="excerpt"
              {...register("excerpt", { required: "Excerpt is required" })}
              placeholder="A short summary shown in listings and previews."
              rows={3}
              className={inputClass}
            />
            {errors.excerpt && (
              <span className="text-sm text-destructive text-red-500">
                {errors.excerpt.message}
              </span>
            )}
          </Field>

          <Field label="Content" htmlFor="content">
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your post content here..."
                />
              )}
            />
            {errors.content && (
              <span className="text-sm text-destructive text-red-500">
                {errors.content.message}
              </span>
            )}
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-5 sm:p-6">

          <Field label="Category" htmlFor="category">
            <select
              id="category"
              {...register("categoryId", { required: "Category is required" })}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-sm text-destructive text-red-500">
                {errors.categoryId.message}
              </span>
            )}
          </Field>

          <Field label="Cover Image" htmlFor="coverImage">
            <input
              id="coverImage"
              type="file"
              {...register("coverImage")}
              placeholder="https://..."
              className={inputClass}
            />
            {errors.coverImage && (
              <span className="text-sm text-destructive text-red-500">
                {errors.coverImage.message}
              </span>
            )}
          </Field>

          <Field label="Meta Title" htmlFor="metaTitle">
            <input
              id="metaTitle"
              {...register("metaTitle")}
              placeholder="SEO title for search engines"
              className={inputClass}
            />
            {errors.metaTitle && (
              <span className="text-sm text-destructive text-red-500">
                {errors.metaTitle.message}
              </span>
            )}
          </Field>

          <Field label="Meta Description" htmlFor="metaDescription">
            <textarea
              id="metaDescription"
              {...register("metaDescription")}
              placeholder="SEO description for search engines"
              rows={3}
              className={inputClass}
            />
            {errors.metaDescription && (
              <span className="text-sm text-destructive text-red-500">
                {errors.metaDescription.message}
              </span>
            )}
          </Field>

          <Field label="Reading Time" htmlFor="readingTime">
            <input
              id="readingTime"
              type="number"
              min={0}
              {...register("readingTime", { required: "Reading time is required" })}
              placeholder="e.g., 5 min"
              className={inputClass}
            />
            {errors.readingTime && (
              <span className="text-sm text-destructive text-red-500">
                {errors.readingTime.message}
              </span>
            )}
          </Field>

          <Field label="Tags" htmlFor="tags">
            <input
              id="tags"
              {...register("tags")}
              placeholder="comma, separated, tags"
              className={inputClass}
            />
            {errors.tags && (
              <span className="text-sm text-destructive text-red-500">
                {errors.tags.message}
              </span>
            )}
          </Field>

          <Field label="Display Order" htmlFor="displayOrder">
            <input
              id="displayOrder"
              type="number"
              min={0}
              {...register("displayOrder", { valueAsNumber: true })}
              placeholder="0"
              className={inputClass}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <input
              id="featured"
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4 rounded border-zinc-300 text-accent-600 focus:ring-accent-500"
            />
            Featured Blog
          </label>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit" onClick={() => setValue('status', 'PUBLISHED')}>
            <Eye className="h-4 w-4" />
            {type === "create" ? "Publish" : "Update & Publish"}
          </Button>
          <Button type="submit" onClick={() => setValue('status', 'DRAFT')} variant="secondary">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-accent-500";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
