import {
  Eye,
  FileText,
  FolderOpen,
  PenLine,
  Upload,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnalyticsCard } from "@/components/overview/AnalyticsCard";
import { ActivityList } from "@/components/overview/ActivityList";
import { PopularPosts } from "@/components/overview/PopularPosts";
import { CategoryProgress } from "@/components/overview/CategoryProgress";
import { activity } from "@/data/posts";
import {
  getCategoryBreakdown,
  getPopularPosts,
  getPostsSummary,
} from "@/lib/utils";
import { getTotalViews } from "@/actions/views";
import { getPosts } from "@/actions/posts";

export default async function OverviewPage() {
  const totalViews = await getTotalViews();
  const posts = await getPosts();

  const summary = await getPostsSummary(posts);
  const categoryBreakdown = getCategoryBreakdown(posts);
  const uniqueCategories = categoryBreakdown.length;
  const popular = getPopularPosts(posts, 5);
  const monthlyViews = Math.round(totalViews * 0.34);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="A high-level snapshot of your site performance and content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnalyticsCard
          label="Total Posts"
          value={summary.total.toString()}
          icon={FileText}
          accent="default"
          delta="+2 this month"
          trend="up"
        />
        <AnalyticsCard
          label="Published"
          value={summary.published.toString()}
          icon={Upload}
          accent="success"
          delta="+1 this month"
          trend="up"
        />
        <AnalyticsCard
          label="Drafts"
          value={summary.drafts.toString()}
          icon={PenLine}
          accent="warning"
          delta="3 in progress"
        />
        <AnalyticsCard
          label="Categories"
          value={uniqueCategories.toString()}
          icon={FolderOpen}
          accent="info"
        />
        <AnalyticsCard
          label="Total Views"
          value={totalViews.toLocaleString("en-US")}
          icon={Eye}
          accent="default"
          delta="+12.4%"
          trend="up"
        />
        <AnalyticsCard
          label="Monthly Views"
          value={monthlyViews.toLocaleString("en-US")}
          icon={Users}
          accent="success"
          delta="+8.1%"
          trend="up"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PopularPosts posts={popular} />
          <CategoryProgress data={categoryBreakdown} />
        </div>
        <div>
          <ActivityList items={activity} />
        </div>
      </div>
    </>
  );
}
