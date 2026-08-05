"use client";

import { useState } from "react";
import { Eye, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { PostStatus } from "@/types/post";

const categories = [
  "Engineering",
  "Design",
  "Productivity",
  "Product",
];

const emptyForm = {
  title: "",
  slug: "",
  category: categories[0],
  coverImage: "",
  excerpt: "",
  content: "",
  status: "draft" as PostStatus,
  tags: "",
};

export function PostForm() {
  const [form, setForm] = useState(emptyForm);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(status: PostStatus) {
    update("status", status);
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="space-y-6 lg:col-span-2">
        <Card className="space-y-5 p-5 sm:p-6">
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="An interesting post title"
              className={inputClass}
            />
          </Field>

          <Field label="Slug" htmlFor="slug">
            <input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="my-post-slug"
              className={inputClass}
            />
          </Field>

          <Field label="Excerpt" htmlFor="excerpt">
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="A short summary shown in listings and previews."
              rows={3}
              className={inputClass}
            />
          </Field>

          <Field label="Content" htmlFor="content">
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Write your post content here..."
              rows={14}
              className={cn(inputClass, "font-mono text-sm leading-relaxed")}
            />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Status
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(["draft", "published"] as PostStatus[]).map((status) => {
                const active = form.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => update("status", status)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                      active
                        ? "border-accent-600 bg-accent-600 text-white shadow-sm"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800",
                    )}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Category" htmlFor="category">
            <select
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Cover Image URL" htmlFor="coverImage">
            <input
              id="coverImage"
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>

          <Field label="Tags" htmlFor="tags">
            <input
              id="tags"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="comma, separated, tags"
              className={inputClass}
            />
          </Field>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit" onClick={() => handleSubmit("published")}>
            <Eye className="h-4 w-4" />
            Publish
          </Button>
          <Button
            type="submit"
            variant="secondary"
            onClick={() => handleSubmit("draft")}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <LinkBack />
      </div>
    </form>
  );
}

function LinkBack() {
  return (
    <a
      href="/posts"
      className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
    >
      Cancel
    </a>
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
