import type { Activity, Post } from "@/types/post";

export const posts: Post[] = [
  {
    id: "1",
    title: "Building a Scalable Design System with Tailwind CSS",
    slug: "scalable-design-system-tailwind",
    category: "Engineering",
    excerpt:
      "How we structured our components, tokens, and utilities to keep the UI consistent as the product grew.",
    status: "published",
    views: 4820,
    createdAt: "2026-07-28T10:15:00Z",
    updatedAt: "2026-07-30T08:42:00Z",
    tags: ["design-system", "tailwind", "frontend"],
    coverImage: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80",
    content:
      "A design system is only as good as the conventions behind it. In this post we walk through the folder structure, token naming, and component API decisions that kept our interface coherent.",
  },
  {
    id: "2",
    title: "Understanding React Server Components",
    slug: "understanding-react-server-components",
    category: "Engineering",
    excerpt:
      "A practical tour of server and client components, when to reach for each, and the pitfalls to avoid.",
    status: "published",
    views: 7210,
    createdAt: "2026-07-20T14:00:00Z",
    updatedAt: "2026-07-25T09:10:00Z",
    tags: ["react", "nextjs", "rsc"],
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    content:
      "Server Components let you keep expensive code and large dependencies on the server. Here is how we adopted them without rewriting our entire app.",
  },
  {
    id: "3",
    title: "The Minimalist Workspace Setup That Boosted My Focus",
    slug: "minimalist-workspace-setup",
    category: "Productivity",
    excerpt:
      "A look at the physical and digital decluttering that helped me ship more in less time.",
    status: "published",
    views: 3150,
    createdAt: "2026-07-12T09:30:00Z",
    updatedAt: "2026-07-14T11:20:00Z",
    tags: ["productivity", "workspace", "focus"],
    coverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80",
    content:
      "Fewer tabs, fewer notifications, fewer things on my desk. The results were immediate and surprisingly durable.",
  },
  {
    id: "4",
    title: "A Field Guide to Accessible Forms",
    slug: "accessible-forms-field-guide",
    category: "Design",
    excerpt:
      "Labels, error states, and focus management — the small details that make forms usable for everyone.",
    status: "published",
    views: 5390,
    createdAt: "2026-06-30T16:45:00Z",
    updatedAt: "2026-07-02T13:05:00Z",
    tags: ["accessibility", "forms", "a11y"],
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    content:
      "Accessibility is not a feature you bolt on at the end. Here is how we bake it into every form we ship.",
  },
  {
    id: "5",
    title: "Notes on Shipping a CMS from Scratch",
    slug: "shipping-a-cms-from-scratch",
    category: "Product",
    excerpt:
      "What we learned building an editor-first content platform and the trade-offs we made along the way.",
    status: "draft",
    views: 0,
    createdAt: "2026-07-31T12:00:00Z",
    updatedAt: "2026-08-02T15:30:00Z",
    tags: ["cms", "product", "product-management"],
    content:
      "Content modelling is harder than it looks. These are the decisions we are still debating.",
  },
  {
    id: "6",
    title: "Type-Safe APIs Without the Boilerplate",
    slug: "type-safe-apis-without-boilerplate",
    category: "Engineering",
    excerpt:
      "Exploring patterns that keep your frontend and backend in sync with minimal ceremony.",
    status: "draft",
    views: 0,
    createdAt: "2026-07-29T18:20:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
    tags: ["typescript", "api", "dx"],
    content:
      "Shared types are the cheapest form of documentation. Here is how we share them across the stack.",
  },
  {
    id: "7",
    title: "Dark Mode Done Right",
    slug: "dark-mode-done-right",
    category: "Design",
    excerpt:
      "Tokens, contrast, and avoiding the midnight-blue trap when designing for low light.",
    status: "published",
    views: 6280,
    createdAt: "2026-06-18T08:00:00Z",
    updatedAt: "2026-06-20T12:15:00Z",
    tags: ["dark-mode", "design", "tokens"],
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    content:
      "A great dark mode is not just inverting colors. It is a carefully tuned second palette.",
  },
  {
    id: "8",
    title: "How We Cut Bundle Size by 40%",
    slug: "cut-bundle-size-by-40-percent",
    category: "Engineering",
    excerpt:
      "A teardown of the audits, code-splitting, and dependency swaps that slimmed our initial load.",
    status: "published",
    views: 8940,
    createdAt: "2026-06-05T11:10:00Z",
    updatedAt: "2026-06-08T09:45:00Z",
    tags: ["performance", "bundling", "web"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content:
      "Performance is a feature. Here is the exact sequence of changes that got us to a 40% smaller bundle.",
  },
  {
    id: "9",
    title: "Writing Documentation People Actually Read",
    slug: "writing-documentation-people-read",
    category: "Productivity",
    excerpt:
      "Treat docs like a product. A few habits that made our internal guides genuinely useful.",
    status: "draft",
    views: 0,
    createdAt: "2026-08-01T07:40:00Z",
    updatedAt: "2026-08-03T14:25:00Z",
    tags: ["documentation", "writing", "team"],
    content:
      "Good docs reduce meetings. These are the formats that worked for our team.",
  },
  {
    id: "10",
    title: "The Quiet Power of Empty States",
    slug: "quiet-power-of-empty-states",
    category: "Design",
    excerpt:
      "Empty and loading states are where products quietly win or lose trust.",
    status: "published",
    views: 4020,
    createdAt: "2026-05-22T13:30:00Z",
    updatedAt: "2026-05-24T10:00:00Z",
    tags: ["ux", "design", "empty-states"],
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    content:
      "An empty state is a moment of intent. Design it like you would design any other screen.",
  },
];

export const activity: Activity[] = [
  {
    id: "a1",
    type: "published",
    message: "Published “Dark Mode Done Right”",
    timestamp: "2026-06-20T12:15:00Z",
  },
  {
    id: "a2",
    type: "updated",
    message: "Updated draft “Shipping a CMS from Scratch”",
    timestamp: "2026-08-02T15:30:00Z",
  },
  {
    id: "a3",
    type: "deleted",
    message: "Deleted “Old Onboarding Walkthrough”",
    timestamp: "2026-07-18T09:05:00Z",
  },
  {
    id: "a4",
    type: "created",
    message: "Created draft “Writing Documentation People Actually Read”",
    timestamp: "2026-08-01T07:40:00Z",
  },
  {
    id: "a5",
    type: "published",
    message: "Published “How We Cut Bundle Size by 40%”",
    timestamp: "2026-06-08T09:45:00Z",
  },
];
