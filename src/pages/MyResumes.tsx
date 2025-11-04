import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Grid, List, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumes } from "@/hooks/useResumes";
import { useRealtimeResumes } from "@/hooks/useRealtimeResumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MyResumes = () => {
  const navigate = useNavigate();
  const { resumes, isLoading, createResume, isCreating } = useResumes();
  useRealtimeResumes();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");

  const handleCreateResume = () => {
    if (!newResumeTitle.trim()) return;
    
    createResume(newResumeTitle.trim());
    setShowCreateDialog(false);
    setNewResumeTitle("");
  };

  const filteredResumes = resumes?.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            title="My Resumes"
            description="Manage all your resumes in one place"
          />
          <Button size="lg" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Create New Resume
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
        {filteredResumes.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </ContentWrapper>

      {/* Create Resume Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to get started.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="e.g., Software Engineer Resume"
            value={newResumeTitle}
            onChange={(e) => setNewResumeTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateResume();
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setNewResumeTitle("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={!newResumeTitle.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default MyResumes;
