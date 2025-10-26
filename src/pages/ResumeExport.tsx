import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Mail, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResumeExport = () => {
  const { toast } = useToast();
  const [fileName, setFileName] = useState("My_Resume");
  const [format, setFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Resume Exported Successfully",
        description: `Your resume has been downloaded as ${fileName}.${format}`,
      });
    }, 2000);
  };

  const handleEmailShare = () => {
    toast({
      title: "Email Sent",
      description: "Your resume has been sent to your email address.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://resume-generator.app/share/abc123");
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard.",
    });
  };

  return (
    <MainLayout>
      <ContentWrapper>
        <PageHeader
          title="Export Resume"
          description="Download or share your resume in your preferred format"
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
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : `Download as ${format.toUpperCase()}`}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Options</CardTitle>
                <CardDescription>Share your resume via email or link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleEmailShare}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCopyLink}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy Shareable Link
                </Button>
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
                <div className="space-y-4">
                  {[
                    { name: "My_Resume.pdf", date: "2 hours ago", format: "PDF" },
                    { name: "Software_Engineer_Resume.docx", date: "1 day ago", format: "DOCX" },
                    { name: "Resume_Final.pdf", date: "3 days ago", format: "PDF" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentWrapper>
    </MainLayout>
  );
};

export default ResumeExport;
