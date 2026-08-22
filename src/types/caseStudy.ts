export type CaseStudyStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CaseStudy {
  id: string;
  title: string;
  subTitle: string | null;
  slug: string;
  excerpt: string | null;
  content?: string;
  coverImage: string | null;
  coverImagePublicId?: string | null;
  tags: string[];
  status: CaseStudyStatus;
  featured: boolean;
  displayOrder: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt: string | Date | null;
  _count: {
    views: number;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CaseStudyInput {
  title: string;
  subTitle?: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  featured?: boolean;
  displayOrder?: number;
  status: CaseStudyStatus;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string | Date | null;
}
