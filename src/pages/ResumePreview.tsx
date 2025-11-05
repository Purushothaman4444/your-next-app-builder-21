import { useState, useEffect } from "react";
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
import { TEMPLATES, getTemplateById } from "@/constants/templates";
import { getTemplateStyles } from "@/utils/templateStyles";
import { useResumes } from "@/hooks/useResumes";

const ResumePreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const { resumes } = useResumes();
  const currentResume = resumes?.find(r => r.id === resumeId);
  const [selectedTemplate, setSelectedTemplate] = useState(currentResume?.template_id || "professional-classic");

  const { personalInfo, workExperience, education, skills, certifications, projects } = useResumeData(resumeId || "");

  useEffect(() => {
    if (currentResume?.template_id) {
      setSelectedTemplate(currentResume.template_id);
    }
  }, [currentResume?.template_id]);

  const templateStyles = getTemplateStyles(selectedTemplate);
  const currentTemplateInfo = getTemplateById(selectedTemplate);

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
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{template.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{template.category}</div>
                        </div>
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
                        {/* Resume Preview with Template Styling */}
                        <div className={templateStyles.container}>
                          {/* Header */}
                          <div className={templateStyles.header.wrapper}>
                            <h1 className={templateStyles.header.name}>
                              {personalInfo.first_name} {personalInfo.last_name}
                            </h1>
                            <div className={templateStyles.header.contact}>
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
                              {personalInfo.linkedin_url && (
                                <>
                                  <span>•</span>
                                  <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    LinkedIn
                                  </a>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Summary */}
                          {personalInfo.professional_summary && (
                            <div>
                              <h2 className={templateStyles.section.title}>Professional Summary</h2>
                              <p className="text-sm leading-relaxed">
                                {personalInfo.professional_summary}
                              </p>
                            </div>
                          )}

                          {/* Experience */}
                          {workExperience && workExperience.length > 0 && (
                            <div>
                              <h2 className={templateStyles.section.title}>Work Experience</h2>
                              <div className={templateStyles.section.content}>
                                {workExperience.map((exp) => (
                                  <div key={exp.id} className={templateStyles.entry.wrapper}>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className={templateStyles.entry.title}>{exp.job_title}</h3>
                                        <p className={templateStyles.entry.subtitle}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                                      </div>
                                      <span className={templateStyles.entry.date}>
                                        {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                                        {exp.is_current ? ' Present' : exp.end_date ? ` ${new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                                      </span>
                                    </div>
                                    {exp.description && (
                                      <p className="mt-2 text-sm whitespace-pre-wrap">{exp.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Education */}
                          {education && education.length > 0 && (
                            <div>
                              <h2 className={templateStyles.section.title}>Education</h2>
                              <div className={templateStyles.section.content}>
                                {education.map((edu) => (
                                  <div key={edu.id} className={templateStyles.entry.wrapper}>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className={templateStyles.entry.title}>
                                          {edu.degree}{edu.field_of_study && ` in ${edu.field_of_study}`}
                                        </h3>
                                        <p className={templateStyles.entry.subtitle}>{edu.school}</p>
                                      </div>
                                      <span className={templateStyles.entry.date}>
                                        {edu.graduation_date && new Date(edu.graduation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                      </span>
                                    </div>
                                    {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {skills && skills.length > 0 && (
                            <div>
                              <h2 className={templateStyles.section.title}>Skills</h2>
                              <div className={templateStyles.skill.wrapper}>
                                {skills.map((skill) => (
                                  <span key={skill.id} className={templateStyles.skill.badge}>
                                    {skill.skill_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Certifications */}
                          {certifications && certifications.length > 0 && (
                            <div>
                              <h2 className={templateStyles.section.title}>Certifications</h2>
                              <div className={templateStyles.section.content}>
                                {certifications.map((cert) => (
                                  <div key={cert.id} className={templateStyles.entry.wrapper}>
                                    <h3 className={templateStyles.entry.title}>{cert.certification_name}</h3>
                                    <p className={templateStyles.entry.subtitle}>
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
                              <h2 className={templateStyles.section.title}>Projects</h2>
                              <div className={templateStyles.section.content}>
                                {projects.map((proj) => (
                                  <div key={proj.id} className={templateStyles.entry.wrapper}>
                                    <h3 className={templateStyles.entry.title}>{proj.project_name}</h3>
                                    {proj.description && (
                                      <p className="text-sm mt-1">{proj.description}</p>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                      <p className="text-sm mt-1">
                                        Technologies: {proj.technologies.join(', ')}
                                      </p>
                                    )}
                                    {(proj.live_url || proj.github_url) && (
                                      <div className="flex gap-4 mt-1 text-sm">
                                        {proj.live_url && (
                                          <a href={proj.live_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            Live Demo
                                          </a>
                                        )}
                                        {proj.github_url && (
                                          <a href={proj.github_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
