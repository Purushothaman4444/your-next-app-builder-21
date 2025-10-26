import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, CheckCircle2, Clock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateEarned: string;
  expirationDate: string;
  credentialId: string;
  verified: boolean;
  documentUrl?: string;
}

export const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "",
      issuer: "",
      dateEarned: "",
      expirationDate: "",
      credentialId: "",
      verified: false,
    },
  ]);

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        id: Date.now().toString(),
        name: "",
        issuer: "",
        dateEarned: "",
        expirationDate: "",
        credentialId: "",
        verified: false,
      },
    ]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCertifications(
      certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    );
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      updateCertification(id, "documentUrl", URL.createObjectURL(file));
      updateCertification(id, "verified", true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Add your professional certifications and credentials. Upload documents for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {certifications.map((certification, index) => (
            <Collapsible key={certification.id} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {certification.name || `Certification ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                      {certification.verified ? (
                        <Badge className="bg-emerald text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    {certifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(certification.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <Label>
                        Certification Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="AWS Certified Solutions Architect"
                        value={certification.name}
                        onChange={(e) =>
                          updateCertification(certification.id, "name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Issuing Organization <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="Amazon Web Services"
                        value={certification.issuer}
                        onChange={(e) =>
                          updateCertification(certification.id, "issuer", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date Earned</Label>
                        <Input
                          type="month"
                          value={certification.dateEarned}
                          onChange={(e) =>
                            updateCertification(certification.id, "dateEarned", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiration Date (if applicable)</Label>
                        <Input
                          type="month"
                          value={certification.expirationDate}
                          onChange={(e) =>
                            updateCertification(certification.id, "expirationDate", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Credential ID</Label>
                      <Input
                        placeholder="ABC123XYZ"
                        value={certification.credentialId}
                        onChange={(e) =>
                          updateCertification(certification.id, "credentialId", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Certificate</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id={`cert-upload-${certification.id}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload(certification.id, e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            document.getElementById(`cert-upload-${certification.id}`)?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {certification.documentUrl ? "Change Document" : "Upload Document"}
                        </Button>
                      </div>
                      {certification.documentUrl && (
                        <p className="text-sm text-muted-foreground">
                          Document uploaded successfully
                        </p>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <Button onClick={addCertification} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Certification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
