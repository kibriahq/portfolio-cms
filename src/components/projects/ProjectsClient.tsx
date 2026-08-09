"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/posts/SearchBar";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import type { Project } from "@/types/project";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(q) ||
        project.slug.toLowerCase().includes(q) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [projects, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by title, slug, or technology..."
        className="sm:max-w-sm"
      />
      <ProjectsTable projects={filtered} />
    </div>
  );
}
