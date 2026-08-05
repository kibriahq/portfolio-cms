export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  status: PostStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string;
  content?: string;
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
