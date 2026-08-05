"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/posts/SearchBar";
import { PostsTable } from "@/components/posts/PostsTable";
import type { Post } from "@/types/post";

interface PostsClientProps {
  posts: Post[];
}

export function PostsClient({ posts }: PostsClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [posts, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by title, category, tag..."
        className="sm:max-w-sm"
      />
      <PostsTable posts={filtered} />
    </div>
  );
}
