import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, Edit, FileText } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResumeData } from "@/hooks/useResumeData";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { downloadResumeAsPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

const ResumePreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  const { personalInfo, workExperience, education, skills, certifications, projects } = useResumeData(resumeId || "");

  const templates = [
    { id: "professional", name: "Professional" },
    { id: "modern", name: "Modern" },
    { id: "simple", name: "Simple" },
  ];

  const handleExport = () => {
    if (!personalInfo) {
      toast({
        title: "No Data",
        description: "Please add your personal information first.",
        variant: "destructive",
      });
      return;
    }

    const resumeData = {
      personalInfo: {
        firstName: personalInfo.first_name || "",
        lastName: personalInfo.last_name || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        address: personalInfo.address || "",
        linkedinUrl: personalInfo.linkedin_url || "",
        professionalSummary: personalInfo.professional_summary || "",
        photoUrl: personalInfo.photo_url || "",
      },
      workExperience: workExperience?.map(exp => ({
        jobTitle: exp.job_title,
        company: exp.company,
        location: exp.location || "",
        startDate: exp.start_date || "",
        endDate: exp.end_date || "",
        isCurrent: exp.is_current || false,
        description: exp.description || "",
      })) || [],
      education: education?.map(edu => ({
        school: edu.school,
        degree: edu.degree,
        fieldOfStudy: edu.field_of_study || "",
        graduationDate: edu.graduation_date || "",
        gpa: edu.gpa || "",
      })) || [],
      skills: skills?.map(skill => ({
        skillName: skill.skill_name,
        category: skill.category,
        proficiencyLevel: skill.proficiency_level || 50,
      })) || [],
      certifications: certifications?.map(cert => ({
        certificationName: cert.certification_name,
        issuingOrganization: cert.issuing_organization,
        dateEarned: cert.date_earned || "",
      })) || [],
      projects: projects?.map(proj => ({
        projectName: proj.project_name,
        description: proj.description || "",
        technologies: proj.technologies || [],
        liveUrl: proj.live_url || "",
        githubUrl: proj.github_url || "",
      })) || [],
    };

    downloadResumeAsPDF(resumeData, selectedTemplate);
  };

  if (!resumeId) {
    return (
      <MainLayout>
        <ContentWrapper>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">No resume selected</p>
            <Button onClick={() => navigate("/resume/create")} className="mt-4">
              Create Resume
            </Button>
          </div>
        </ContentWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ContentWrapper>
        <PageHeader
          title="Resume Preview"
          description="Review your resume and make final adjustments before exporting"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Template Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Select Template</h3>
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/resume/create?resumeId=${resumeId}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Resume
                  </Button>
                  <Button className="w-full" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <Tabs defaultValue="preview">
                  <TabsList className="mb-6">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="customize">Customize</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview">
                    {!personalInfo ? (
                      <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <div className="bg-white text-gray-900 p-8 shadow-lg rounded-lg min-h-[1000px]">
                        {/* Resume Preview */}
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="text-center border-b border-gray-300 pb-6">
                            <h1 className="text-4xl font-bold mb-2 text-gray-900">
                              {personalInfo.first_name} {personalInfo.last_name}
                            </h1>
                            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
                              {personalInfo.email && <span>{personalInfo.email}</span>}
                              {personalInfo.phone && (
                                <>
                                  <span>•</span>
                                  <span>{personalInfo.phone}</span>
                                </>
                              )}
                              {personalInfo.address && (
                                <>
                                  <span>•</span>
                                  <span>{personalInfo.address}</span>
                                </>
                              )}
                            </div>
                            {personalInfo.linkedin_url && (
                              <div className="mt-2 text-sm text-blue-600">
                                <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer">
                                  {personalInfo.linkedin_url}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Summary */}
                          {personalInfo.professional_summary && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Professional Summary</h2>
                              <p className="text-sm leading-relaxed text-gray-700">
                                {personalInfo.professional_summary}
                              </p>
                            </div>
                          )}

                          {/* Experience */}
                          {workExperience && workExperience.length > 0 && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Work Experience</h2>
                              <div className="space-y-4">
                                {workExperience.map((exp) => (
                                  <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold text-gray-900">{exp.job_title}</h3>
                                        <p className="text-sm text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                      </div>
                                      <span className="text-sm text-gray-600">
                                        {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                                        {exp.is_current ? ' Present' : exp.end_date ? ` ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                                      </span>
                                    </div>
                                    {exp.description && (
                                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {education && education.length > 0 && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Education</h2>
                              <div className="space-y-4">
                                {education.map((edu) => (
                                  <div key={edu.id}>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold text-gray-900">
                                          {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                                        </h3>
                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                      </div>
                                      <span className="text-sm text-gray-600">
                                        {edu.graduation_date && new Date(edu.graduation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                      </span>
                                    </div>
                                    {edu.gpa && <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {skills && skills.length > 0 && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Skills</h2>
                              <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                  <span
                                    key={skill.id}
                                    className="px-3 py-1 bg-gray-200 text-gray-900 rounded-full text-sm"
                                  >
                                    {skill.skill_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Certifications */}
                          {certifications && certifications.length > 0 && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Certifications</h2>
                              <div className="space-y-3">
                                {certifications.map((cert) => (
                                  <div key={cert.id}>
                                    <h3 className="font-semibold text-gray-900">{cert.certification_name}</h3>
                                    <p className="text-sm text-gray-600">
                                      {cert.issuing_organization}
                                      {cert.date_earned && ` - ${new Date(cert.date_earned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Projects */}
                          {projects && projects.length > 0 && (
                            <div>
                              <h2 className="text-xl font-bold mb-3 text-blue-900">Projects</h2>
                              <div className="space-y-4">
                                {projects.map((proj) => (
                                  <div key={proj.id}>
                                    <h3 className="font-semibold text-gray-900">{proj.project_name}</h3>
                                    {proj.description && (
                                      <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        Technologies: {proj.technologies.join(', ')}
                                      </p>
                                    )}
                                    {(proj.live_url || proj.github_url) && (
                                      <div className="flex gap-4 mt-1 text-sm text-blue-600">
                                        {proj.live_url && (
                                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer">
                                            Live Demo
                                          </a>
                                        )}
                                        {proj.github_url && (
                                          <a href={proj.github_url} target="_blank" rel="noopener noreferrer">
                                            GitHub
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="customize">
                    <div className="space-y-6">
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-4">Customization Options</h3>
                          <p className="text-sm text-muted-foreground">
                            Customize colors, fonts, and layout options for your resume template.
                            This feature will allow you to personalize your resume appearance.
                          </p>
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground text-center">
                              Template customization controls will be available here
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentWrapper>
    </MainLayout>
  );
};

export default ResumePreview;
