export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    blogs: number;
  };
}
