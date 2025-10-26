import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { PersonalInfoSection } from "@/components/resume-builder/PersonalInfoSection";
import { WorkExperienceSection } from "@/components/resume-builder/WorkExperienceSection";
import { EducationSection } from "@/components/resume-builder/EducationSection";
import { SkillsSection } from "@/components/resume-builder/SkillsSection";
import { CertificationsSection } from "@/components/resume-builder/CertificationsSection";
import { ProjectsSection } from "@/components/resume-builder/ProjectsSection";
import { useToast } from "@/hooks/use-toast";

const sections = [
  { id: "personal", title: "Personal Info", component: PersonalInfoSection },
  { id: "experience", title: "Work Experience", component: WorkExperienceSection },
  { id: "education", title: "Education", component: EducationSection },
  { id: "skills", title: "Skills", component: SkillsSection },
  { id: "certifications", title: "Certifications", component: CertificationsSection },
  { id: "projects", title: "Projects", component: ProjectsSection },
];

const ResumeBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentSection = searchParams.get("section") || "personal";
  const currentIndex = sections.findIndex((s) => s.id === currentSection);
  const CurrentComponent = sections[currentIndex]?.component;

  const progress = ((currentIndex + 1) / sections.length) * 100;

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      setSearchParams({ section: sections[currentIndex + 1].id });
    } else {
      navigate("/resume/preview");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSearchParams({ section: sections[currentIndex - 1].id });
    }
  };

  const handleSave = () => {
    toast({
      title: "Progress Saved",
      description: "Your resume has been saved successfully.",
    });
  };

  return (
    <MainLayout>
      <ContentWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">Create Your Resume</h1>
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                Step {currentIndex + 1} of {sections.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 p-4 bg-muted/50 rounded-lg">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSearchParams({ section: section.id })}
                className="flex-shrink-0"
              >
                <span className="mr-2">{index + 1}.</span>
                {section.title}
              </Button>
            ))}
          </div>

          {/* Current Section */}
          <div className="mb-8">
            {CurrentComponent && <CurrentComponent />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentIndex === sections.length - 1 ? "Preview Resume" : "Next"}
              {currentIndex < sections.length - 1 && (
                <ChevronRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </ContentWrapper>
    </MainLayout>
  );
};

export default ResumeBuilder;
