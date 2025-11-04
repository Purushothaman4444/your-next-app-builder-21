import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";
import { useRealtimeResumes } from "@/hooks/useRealtimeResumes";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useAuth();
  const { resumes, isLoading } = useResumes();
  useRealtimeResumes();

  const stats = {
    totalResumes: resumes?.length || 0,
    downloads: 0, // TODO: Track downloads in the future
    lastModified: resumes?.[0]?.updated_at 
      ? new Date(resumes[0].updated_at).toLocaleDateString()
      : null,
  };

  if (isLoading) {
    return (
      <MainLayout>
        <ContentWrapper>
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </ContentWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentWrapper>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <PageHeader
            title={`Welcome back, ${user?.email?.split('@')[0] || 'User'}!`}
            description="Manage your resumes and track your progress"
          />
          <Button asChild size="lg">
            <Link to="/resume/create">
              <Plus className="mr-2 h-5 w-5" />
              Create New Resume
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalResumes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.downloads}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Modified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.lastModified || "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Resumes Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Resumes</h2>
            <Button variant="outline" asChild>
              <Link to="/my-resumes">View All</Link>
            </Button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.slice(0, 3).map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </ContentWrapper>
    </MainLayout>
  );
};

export default Dashboard;
