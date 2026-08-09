import { Eye, FileEdit, Upload, BicepsFlexed } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPostsTable } from "@/components/dashboard/RecentPostsTable";
import { getPosts, getTotalPublishedPostsCount } from "@/actions/posts";
import { getTotalViews } from "@/actions/views";
import { getTotalPublishedCaseStudiesCount } from "@/actions/caseStudies";
import { getTotalPublishedProjectsCount } from "@/actions/projects";

export default async function DashboardPage() {
  const totalViews = await getTotalViews();
  
  const posts = await getPosts();

  const publishedPostsCount = await getTotalPublishedPostsCount();
  const publishedCaseStudiesCount = await getTotalPublishedCaseStudiesCount();
  const publishedProjectsCount = await getTotalPublishedProjectsCount()


  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back, here is what is happening with your content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={publishedProjectsCount.toString()}
          icon={BicepsFlexed}
          accent="default"
          hint="Total published projects"
        />
        <StatCard
          label="Case Studies"
          value={publishedCaseStudiesCount.toString()}
          icon={FileEdit}
          accent="warning"
          hint="Total published case studies"
        />
        <StatCard
          label="Published Posts"
          value={publishedPostsCount.toString()}
          icon={Upload}
          accent="success"
          hint="Posts live on site"
        />
        <StatCard
          label="Total Views"
          value={totalViews.toLocaleString("en-US")}
          icon={Eye}
          accent="info"
          hint="All time all pages and posts"
        />
      </div>

      <div className="mt-6">
        <RecentPostsTable posts={posts} limit={6} />
      </div>
    </>
  );
}
