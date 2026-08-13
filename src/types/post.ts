export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
  } | null;
  _count: {
    views: number;
  };
  readingTime: number | null;
  excerpt: string | null;
  status: PostStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  tags: string[] | null;
  coverImage?: string | null;
  content?: string;
  featured?: boolean;
}

export interface Activity {
  id: string;
  type: "published" | "updated" | "deleted" | "created";
  message: string;
  timestamp: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface PostInput {
  title: string;
  slug: string;
  categoryId: string;
  excerpt: string;
  status: PostStatus;
  readingTime: number;
  tags?: string[];
  coverImage?: string;
  content: string;
  featured?: boolean;
  displayOrder?: number;
}