"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-toastify";
import { createCategory, updateCategory } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import slugify from "@/utils/slugify";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
};

export function CategoryForm({ type, category }: { type: "create" | "edit"; category: Category | null }) {
  const cat = {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  }

  const [form, setForm] = useState(cat ?? emptyForm);
  const router = useRouter();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value: string) {
    if (type === "create") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: slugify(value),
      }));
    }

    if (type === "edit") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: form?.slug || slugify(value),
      }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and slug are required.");
      return;
    }

    try {
      if (type === "create") {
        await createCategory(form);
        toast.success("Category saved successfully!");
      }

      if (type === "edit" && category) {
        await updateCategory(category.id, form);
        toast.success("Category updated successfully!");
      }

      setForm(emptyForm); // Reset form after submission
      router.push("/categories"); // Navigate to categories page after submission
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while saving the category.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      <div className="space-y-6 md:col-span-2">
        <Card className="space-y-5 p-5 sm:p-6">
          <Field label="Name" htmlFor="name">
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Engineering"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Slug" htmlFor="slug">
            <input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="engineering"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short description of what this category covers."
              rows={5}
              className={inputClass}
            />
          </Field>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preview
            </span>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {form.name || "Category name"}
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                /{form.slug || "category-slug"}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {form.description || "No description yet."}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit">
            <Save className="h-4 w-4" />
            {type === "create" ? "Create Category" : "Update Category"}
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
