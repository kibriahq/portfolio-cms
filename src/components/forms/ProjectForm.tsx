"use client";

import { useEffect, useState } from "react";
import { Eye, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ProjectStatus } from "@/types/project";
import { RichTextEditor } from "./RichTextEditor";
import slugify from "@/utils/slugify";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { toast } from "react-toastify";
import { createProject, updateProject } from "@/actions/projects";
import { useRouter } from "next/navigation";


type Inputs = {
  title: string
  subTitle: string
  slug: string
  excerpt: string
  description: string
  coverImage: string
  technologies: string
  liveUrl: string
  githubUrl: string
  featured: boolean
  displayOrder: number
  status: ProjectStatus
  metaTitle: string
  metaDescription: string
};

export function ProjectForm({ type, project }: { type: "create" | "edit", project?: Inputs & { id: string } }) {
  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Inputs>({ defaultValues: project ? {...project, coverImage: ""} : undefined });

  const router = useRouter();

  const title = watch("title")
  const slug = watch("slug")

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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const payload = {
      ...data,
      technologies: data.technologies
        .split(",")
        .map((tech) => tech.trim().toLowerCase())
        .filter(Boolean),
    };

   if(type === "create") {
      try {
        await createProject(payload);
        toast.success("Project created successfully");
        router.push("/projects");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred while creating the project"
        );
      }
    }

    if(type === "edit" && project?.id) {
      try {
        await updateProject(project.id, payload);
        toast.success("Project updated successfully");
        router.push("/projects");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred while updating the project"
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
              placeholder="Project title"
              className={inputClass}
            />
            {errors.title && (
              <span className="text-sm text-destructive text-red-500">
                {errors.title.message}
              </span>
            )}
          </Field>

          <Field label="Sub Title" htmlFor="subTitle">
            <input
              id="subTitle"
              {...register("subTitle")}
              placeholder="A short tagline for the project"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" htmlFor="slug">
            <input
              id="slug"
              {...register("slug", { required: "Slug is required" })}
              placeholder="my-project-slug"
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

          <Field label="Description" htmlFor="description">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe the project, your role, and the outcome..."
                />
              )}
            />
            {errors.description && (
              <span className="text-sm text-destructive text-red-500">
                {errors.description.message}
              </span>
            )}
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-5 sm:p-6">
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

          <Field label="Technologies" htmlFor="technologies">
            <input
              id="technologies"
              {...register("technologies")}
              placeholder="React, Next.js, TypeScript"
              className={inputClass}
            />
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Comma separated list of technologies.
            </span>
          </Field>

          <Field label="Live URL" htmlFor="liveUrl">
            <input
              id="liveUrl"
              {...register("liveUrl")}
              placeholder="https://example.com"
              className={inputClass}
            />
          </Field>

          <Field label="GitHub URL" htmlFor="githubUrl">
            <input
              id="githubUrl"
              {...register("githubUrl")}
              placeholder="https://github.com/user/repo"
              className={inputClass}
            />
          </Field>

          <Field label="Meta Title" htmlFor="metaTitle">
            <input
              id="metaTitle"
              {...register("metaTitle")}
              placeholder="SEO title for search engines"
              className={inputClass}
            />
          </Field>

          <Field label="Meta Description" htmlFor="metaDescription">
            <textarea
              id="metaDescription"
              {...register("metaDescription")}
              placeholder="SEO description for search engines"
              rows={3}
              className={inputClass}
            />
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
            Featured project
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
