import { Eye, FileEdit, Upload, BicepsFlexed } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopPostsTable } from "@/components/dashboard/TopPostsTable";
import { TopCaseStudiesTable } from "@/components/dashboard/TopCaseStudiesTable";
import { TopProjectsTable } from "@/components/dashboard/TopProjectsTable";
import { getPosts, getTotalPublishedPostsCount } from "@/actions/posts";
import { getTotalViews, getViewsLast6Hours, getTrafficOverviewLast6Hours } from "@/actions/views";
import { VisitorsLineChart } from "@/components/overview/VisitorsLineChart";
import { TrafficOverview } from "@/components/overview/TrafficOverview";
import { getCaseStudies, getTotalPublishedCaseStudiesCount } from "@/actions/caseStudies";
import { getProjects, getTotalPublishedProjectsCount } from "@/actions/projects";

export default async function DashboardPage() {
  const totalViews = await getTotalViews();
  const visitorsLast6Hours = await getViewsLast6Hours();
  const trafficOverview = await getTrafficOverviewLast6Hours();

  const posts = await getPosts();
  const caseStudies = await getCaseStudies();
  const projects = await getProjects();

  const publishedPostsCount = await getTotalPublishedPostsCount();
  const publishedCaseStudiesCount = await getTotalPublishedCaseStudiesCount();
  const publishedProjectsCount = await getTotalPublishedProjectsCount();

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

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <VisitorsLineChart data={visitorsLast6Hours} />
        </div>
        <div className="md:col-span-1">
          <TrafficOverview data={trafficOverview} />
        </div>
      </div>

      <div className="mt-6">
        <TopPostsTable posts={posts} limit={6} />
      </div>
       
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <TopCaseStudiesTable caseStudies={caseStudies} limit={6} />
        <TopProjectsTable projects={projects} limit={6} />
      </div>
    </>
  );
}
