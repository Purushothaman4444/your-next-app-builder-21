import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Mail, Link as LinkIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResumeData } from "@/hooks/useResumeData";
import { useResumes } from "@/hooks/useResumes";
import { useExportHistory } from "@/hooks/useExportHistory";
import { useActivities } from "@/hooks/useActivities";
import { downloadResumeAsPDF } from "@/utils/pdfGenerator";
import { downloadResumeAsDocx } from "@/utils/docxGenerator";
import { downloadResumeAsText } from "@/utils/textGenerator";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const ResumeExport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const { resumes } = useResumes();
  const currentResume = resumes?.find(r => r.id === resumeId);
  const { logActivity } = useActivities();
  const { exportHistory, isLoading: isLoadingHistory, logExport } = useExportHistory(resumeId || undefined);
  
  const [fileName, setFileName] = useState(currentResume?.title.replace(/\s+/g, '_') || "My_Resume");
  const [format, setFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [shareableLink, setShareableLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const { personalInfo, workExperience, education, skills, certifications, projects } = useResumeData(resumeId || "");

  const getResumeData = () => ({
    personalInfo: {
      firstName: personalInfo?.first_name || "",
      lastName: personalInfo?.last_name || "",
      email: personalInfo?.email || "",
      phone: personalInfo?.phone || "",
      address: personalInfo?.address || "",
      linkedinUrl: personalInfo?.linkedin_url || "",
      professionalSummary: personalInfo?.professional_summary || "",
      photoUrl: personalInfo?.photo_url || "",
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
  });

  const handleExport = async () => {
    if (!personalInfo || !resumeId || !currentResume) {
      toast({
        title: "No Data",
        description: "Please add your personal information first.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const resumeData = getResumeData();
      const fullFileName = `${fileName}`;

      if (format === "pdf") {
        downloadResumeAsPDF(resumeData, currentResume.template_id);
      } else if (format === "docx") {
        await downloadResumeAsDocx(resumeData, fullFileName);
      } else if (format === "txt") {
        downloadResumeAsText(resumeData, fullFileName);
      }

      logExport({
        resumeId,
        resumeTitle: currentResume.title,
        exportFormat: format.toUpperCase(),
        fileName: `${fullFileName}.${format}`,
      });

      logActivity({
        activityType: 'downloaded',
        resumeTitle: currentResume.title,
        resumeId,
      });

      toast({
        title: "Resume Exported Successfully",
        description: `Your resume has been downloaded as ${fullFileName}.${format}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailShare = async () => {
    if (!emailAddress || !resumeId || !currentResume || !personalInfo) {
      toast({
        title: "Missing Information",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const shareLink = shareableLink || `${window.location.origin}/resume/preview?resumeId=${resumeId}`;
      
      const { error } = await supabase.functions.invoke('send-resume-email', {
        body: {
          recipientEmail: emailAddress,
          resumeUrl: shareLink,
          resumeTitle: currentResume.title,
          senderName: `${personalInfo.first_name} ${personalInfo.last_name}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `Your resume has been sent to ${emailAddress}.`,
      });
      setEmailAddress("");
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleGenerateLink = () => {
    if (!resumeId) return;
    
    setIsGeneratingLink(true);
    setTimeout(() => {
      const link = `${window.location.origin}/resume/preview?resumeId=${resumeId}`;
      setShareableLink(link);
      setIsGeneratingLink(false);
      toast({
        title: "Link Generated",
        description: "Your shareable link has been created.",
      });
    }, 500);
  };

  const handleCopyLink = () => {
    if (!shareableLink) {
      handleGenerateLink();
      return;
    }
    
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard.",
    });
  };

  if (!resumeId || !currentResume) {
    return (
      <MainLayout>
        <ContentWrapper>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">No resume selected</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4">
              Go to Dashboard
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
          title="Export Resume"
          description={`Download or share "${currentResume.title}" in your preferred format`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
                <CardDescription>Choose your export format and file name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>File Name</Label>
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="My_Resume"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <RadioGroup value={format} onValueChange={setFormat}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="cursor-pointer">
                        PDF (Recommended)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="docx" id="docx" />
                      <Label htmlFor="docx" className="cursor-pointer">
                        Microsoft Word (.docx)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="txt" id="txt" />
                      <Label htmlFor="txt" className="cursor-pointer">
                        Plain Text (.txt)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  className="w-full"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download as {format.toUpperCase()}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Options</CardTitle>
                <CardDescription>Share your resume via email or link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send via Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Resume via Email</DialogTitle>
                      <DialogDescription>
                        Enter the recipient's email address to share your resume.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="recipient@example.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleEmailShare}
                        disabled={isSendingEmail}
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCopyLink}
                  disabled={isGeneratingLink}
                >
                  {isGeneratingLink ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {shareableLink ? "Copy Shareable Link" : "Generate Shareable Link"}
                    </>
                  )}
                </Button>

                {shareableLink && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Shareable Link:</p>
                    <p className="text-sm break-all">{shareableLink}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Export History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Export History</CardTitle>
                <CardDescription>Your recent resume exports</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : exportHistory && exportHistory.length > 0 ? (
                  <div className="space-y-4">
                    {exportHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {item.export_format}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No export history yet</p>
                    <p className="text-sm mt-1">Your exports will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentWrapper>
    </MainLayout>
  );
};

export default ResumeExport;
