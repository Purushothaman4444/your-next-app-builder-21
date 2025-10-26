import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, Edit, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumePreview = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  const templates = [
    { id: "professional", name: "Professional" },
    { id: "modern", name: "Modern" },
    { id: "simple", name: "Simple" },
  ];

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
                  <Button variant="outline" className="w-full" onClick={() => navigate("/resume/create")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Resume
                  </Button>
                  <Button className="w-full" onClick={() => navigate("/resume/export")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Resume
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
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
                    <div className="bg-white text-foreground p-8 shadow-lg rounded-lg min-h-[1000px]">
                      {/* Resume Preview */}
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center border-b pb-6">
                          <h1 className="text-4xl font-bold mb-2">John Doe</h1>
                          <p className="text-muted-foreground">Software Engineer</p>
                          <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>john.doe@example.com</span>
                            <span>•</span>
                            <span>+1 (555) 123-4567</span>
                            <span>•</span>
                            <span>San Francisco, CA</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">Professional Summary</h2>
                          <p className="text-sm leading-relaxed">
                            Experienced software engineer with a passion for building scalable web applications.
                            Proficient in modern frameworks and technologies with a strong focus on user experience
                            and code quality.
                          </p>
                        </div>

                        {/* Experience */}
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">Work Experience</h2>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">Senior Software Engineer</h3>
                                  <p className="text-sm text-muted-foreground">Tech Corp</p>
                                </div>
                                <span className="text-sm text-muted-foreground">2020 - Present</span>
                              </div>
                              <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                                <li>Developed and maintained web applications using React and Node.js</li>
                                <li>Collaborated with cross-functional teams to deliver high-quality features</li>
                                <li>Mentored junior developers and conducted code reviews</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">Education</h2>
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                                <p className="text-sm text-muted-foreground">University of Technology</p>
                              </div>
                              <span className="text-sm text-muted-foreground">2016 - 2020</span>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h2 className="text-xl font-bold mb-3 text-primary">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                            {["React", "TypeScript", "Node.js", "Python", "SQL", "AWS"].map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
