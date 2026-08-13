import type { ReactNode } from "react";

type Endpoint = {
  method: "GET";
  path: string;
  description: string;
  params?: string[];
  notes?: string[];
};

type ResourceGroup = {
  name: string;
  basePath: string;
  status: "available" | "planned";
  description: string;
  endpoints: Endpoint[];
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const resourceGroups: ResourceGroup[] = [
  {
    name: "Blogs",
    basePath: "/api/blogs",
    status: "available",
    description:
      "Public read endpoints for published blog content. Every request also records an anonymous view (IP, user agent, referer and, when available, location).",
    endpoints: [
      {
        method: "GET",
        path: "/api/blogs",
        description: "List all published blog posts.",
        params: [
          "hideFeatured=true (optional) — exclude featured posts from the result.",
          "tags=tag1,tag2 (optional) — only return posts that have at least one of the given tags. Use tags=all to ignore the tag filter and return all posts.",
        ],
        notes: ["Sorted by createdAt descending.", "Includes the related category."],
      },
      {
        method: "GET",
        path: "/api/blogs/featured",
        description: "List all published posts that are marked as featured.",
        notes: ["Sorted by createdAt descending.", "Includes the related category."],
      },
      {
        method: "GET",
        path: "/api/blogs/ordered-list",
        description:
          "List all published posts that have a non-zero displayOrder, sorted ascending by displayOrder.",
        notes: ["Use this for manually curated/ranked listings.", "Includes the related category."],
      },
      {
        method: "GET",
        path: "/api/blogs/[slug]",
        description: "Fetch a single published blog post by its slug.",
        params: ["slug (path) — the unique post slug."],
        notes: [
          "Returns 404 if the slug does not exist or the post is not published.",
          "Includes the related category.",
          "Records a view with blogId set (pageType left as default).",
        ],
      },
    ],
  },
  {
    name: "Projects",
    basePath: "/api/projects",
    status: "available",
    description:
      "Public read endpoints for published project content. Every request also records an anonymous view (IP, user agent, referer and, when available, location).",
    endpoints: [
      {
        method: "GET",
        path: "/api/projects",
        description: "List all published projects.",
        params: [
          "hideFeatured=true (optional) — exclude featured projects from the result.",
          "tech=tech1,tech2 (optional) — only return projects that use at least one of the given technologies. Use tech=all to ignore the technology filter and return all projects.",
        ],
        notes: ["Sorted by createdAt descending."],
      },
      {
        method: "GET",
        path: "/api/projects/featured",
        description: "List all published projects that are marked as featured.",
        notes: ["Sorted by createdAt descending."],
      },
      {
        method: "GET",
        path: "/api/projects/ordered-list",
        description:
          "List all published projects that have a non-zero displayOrder, sorted ascending by displayOrder.",
        notes: ["Use this for manually curated/ranked listings."],
      },
      {
        method: "GET",
        path: "/api/projects/[slug]",
        description: "Fetch a single published project by its slug.",
        params: ["slug (path) — the unique project slug."],
        notes: [
          "Returns 404 if the slug does not exist or the project is not published.",
          "Records a view with projectId set (pageType left as default).",
        ],
      },
    ],
  },
  {
    name: "Case Studies",
    basePath: "/api/case-studies",
    status: "available",
    description:
      "Public read endpoints for published case study content. Every request also records an anonymous view (IP, user agent, referer and, when available, location).",
    endpoints: [
      {
        method: "GET",
        path: "/api/case-studies",
        description: "List all published case studies.",
        params: [
          "hideFeatured=true (optional) — exclude featured case studies from the result.",
          "tech=tech1,tech2 (optional) — only return case studies that use at least one of the given technologies. Use tech=all to ignore the technology filter and return all case studies.",
        ],
        notes: ["Sorted by createdAt descending."],
      },
      {
        method: "GET",
        path: "/api/case-studies/featured",
        description: "List all published case studies that are marked as featured.",
        notes: ["Sorted by createdAt descending."],
      },
      {
        method: "GET",
        path: "/api/case-studies/ordered-list",
        description:
          "List all published case studies that have a non-zero displayOrder, sorted ascending by displayOrder.",
        notes: ["Use this for manually curated/ranked listings."],
      },
      {
        method: "GET",
        path: "/api/case-studies/[slug]",
        description: "Fetch a single published case study by its slug.",
        params: ["slug (path) — the unique case study slug."],
        notes: [
          "Returns 404 if the slug does not exist or the case study is not published.",
          "Records a view with caseStudyId set (pageType left as default).",
        ],
      },
    ],
  },
  {
    name: "Page Views",
    basePath: "/api/track",
    status: "available",
    description:
      "Records an anonymous view for a static site page (IP, user agent, referer and, when available, location). The slug must be a valid page type.",
    endpoints: [
      {
        method: "GET",
        path: "/api/track/[slug]",
        description: "Track a view for the page identified by slug.",
        params: [
          "slug (path) — the page type, one of: home, about, skills, services, contact, testimonials, blogs, projects, case_studies, privacy_policy, terms_of_service.",
        ],
        notes: [
          "The slug is uppercased and validated against the PageType enum.",
          "Returns 404 if the slug is missing or not a recognized page type.",
          "Returns 200 with \"View tracked successfully\" on success.",
        ],
      },
    ],
  },
];

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="inline-flex items-center rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
      {method}
    </span>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {children}
    </div>
  );
}

function ResourceSection({ group }: { group: ResourceGroup }) {
  const planned = group.status === "planned";

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {group.name}
        </h2>
        <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {group.basePath}
        </code>
        {planned ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Planned
          </span>
        ) : (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Available
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {group.description}
      </p>

      {planned ? (
        <p className="mt-4 text-sm italic text-zinc-500">
          Endpoints will be documented here once implemented.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {group.endpoints.map((endpoint) => (
            <li
              key={endpoint.path}
              className="rounded-md border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <MethodBadge method={endpoint.method} />
                <code className="font-mono text-sm text-zinc-800 dark:text-zinc-200">
                  {endpoint.path}
                </code>
              </div>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {endpoint.description}
              </p>
              {endpoint.params && endpoint.params.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Parameters
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                    {endpoint.params.map((param) => (
                      <li key={param}>{param}</li>
                    ))}
                  </ul>
                </div>
              )}
              {endpoint.notes && endpoint.notes.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Notes
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                    {endpoint.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          API Reference
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Public REST endpoints exposed by the Portfolio CMS. All responses are
          JSON. Base URL:
        </p>
        <code className="mt-2 inline-block rounded bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {BASE_URL}
        </code>
      </header>

      <div className="space-y-6">
        {resourceGroups.map((group) => (
          <ResourceSection key={group.basePath} group={group} />
        ))}
      </div>

      <footer className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
        <p>
          To add a new resource, append an entry to the{" "}
          <code className="font-mono">resourceGroups</code> array in this page.
          Planned resources (e.g. projects, case studies) automatically render a
          placeholder until their endpoints are implemented.
        </p>
      </footer>
    </main>
  );
}
