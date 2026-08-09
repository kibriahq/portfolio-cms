export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Project {
  id: string;
  title: string;
  subTitle: string | null;
  slug: string;
  excerpt: string | null;
  description: string | null;
  coverImage: string | null;
  coverImagePublicId: string | null;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  displayOrder: number;
  status: ProjectStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  _count: {
    views: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProjectInput {
  title: string;
  subTitle?: string;
  slug: string;
  excerpt?: string;
  description?: string;
  coverImage?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  displayOrder?: number;
  status: ProjectStatus;
  metaTitle?: string;
  metaDescription?: string;
}
