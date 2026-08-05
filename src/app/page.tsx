import { Eye, FileEdit, FileText, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPostsTable } from "@/components/dashboard/RecentPostsTable";
import { getPosts, getPostsSummary } from "@/lib/utils";

export default function DashboardPage() {
  const posts = getPosts();
  const { total, drafts, published, totalViews } = getPostsSummary(posts);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back, here is what is happening with your content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Posts"
          value={total.toString()}
          icon={FileText}
          accent="default"
          hint="Across all categories"
        />
        <StatCard
          label="Draft Posts"
          value={drafts.toString()}
          icon={FileEdit}
          accent="warning"
          hint="Not yet published"
        />
        <StatCard
          label="Published Posts"
          value={published.toString()}
          icon={Upload}
          accent="success"
          hint="Live on your site"
        />
        <StatCard
          label="Total Views"
          value={totalViews.toLocaleString("en-US")}
          icon={Eye}
          accent="info"
          hint="All time"
        />
      </div>

      <div className="mt-6">
        <RecentPostsTable posts={posts} limit={6} />
      </div>
    </>
  );
}
