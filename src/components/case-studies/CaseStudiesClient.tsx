"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/posts/SearchBar";
import { CaseStudiesTable } from "@/components/case-studies/CaseStudiesTable";
import type { CaseStudy } from "@/types/caseStudy";

interface CaseStudiesClientProps {
  caseStudies: CaseStudy[];
}

export function CaseStudiesClient({ caseStudies }: CaseStudiesClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return caseStudies;
    return caseStudies.filter((caseStudy) => {
      return (
        caseStudy.title.toLowerCase().includes(q) ||
        caseStudy.slug.toLowerCase().includes(q) ||
        caseStudy.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [caseStudies, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by title, slug, or tag..."
        className="sm:max-w-sm"
      />
      <CaseStudiesTable caseStudies={filtered} />
    </div>
  );
}
