import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Grid, List, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

const MyResumes = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - will be replaced with real data
  const resumes: any[] = [];

  return (
    <MainLayout>
      <ContentWrapper>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <PageHeader
            title="My Resumes"
            description="Manage all your resumes in one place"
          />
          <Button asChild size="lg">
            <Link to="/resume/create">
              <Plus className="mr-2 h-5 w-5" />
              Create New Resume
            </Link>
          </Button>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Resumes Grid/List */}
        {resumes.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </ContentWrapper>
    </MainLayout>
  );
};

export default MyResumes;
