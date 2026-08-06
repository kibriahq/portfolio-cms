import { posts } from "@/data/posts";
import { categories } from "@/data/categories";
import type { Post, PostStatus } from "@/types/post";
import type { Category } from "@/types/category";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function getPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsSummary(posts: Post[]) {
  const total = posts.length;
  const published = posts.filter((post) => post.status === "published").length;
  const drafts = posts.filter((post) => post.status === "draft").length;
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  return { total, published, drafts, totalViews };
}

export function getPopularPosts(posts: Post[], limit = 5): Post[] {
  return [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getCategoryBreakdown(posts: Post[]): Array<{
  category: string;
  count: number;
  percentage: number;
}> {
  const total = posts.length || 1;
  const map = new Map<string, number>();
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getCategories(): Category[] {
  return categories;
}

export function getPostCountByCategory(categoryName: string): number {
  return posts.filter((post) => post.category === categoryName).length;
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
};
