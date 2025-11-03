import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, CheckCircle2, Clock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useResumeData } from "@/hooks/useResumeData";

interface CertificationsSectionProps {
  resumeId: string;
}

export const CertificationsSection = ({ resumeId }: CertificationsSectionProps) => {
  const { certifications, mutations } = useResumeData(resumeId);
  const [localCertifications, setLocalCertifications] = useState<any[]>([]);

  useEffect(() => {
    if (certifications && certifications.length > 0) {
      setLocalCertifications(certifications);
    } else {
      setLocalCertifications([{
        id: null,
        certification_name: "",
        issuing_organization: "",
        date_earned: "",
        expiration_date: "",
        credential_id: "",
        is_verified: false,
        certificate_url: "",
      }]);
    }
  }, [certifications]);

  const handleSave = async (cert: any) => {
    const data = {
      resume_id: resumeId,
      certification_name: cert.certification_name,
      issuing_organization: cert.issuing_organization,
      date_earned: cert.date_earned || null,
      expiration_date: cert.expiration_date || null,
      credential_id: cert.credential_id || null,
      is_verified: cert.is_verified || false,
      certificate_url: cert.certificate_url || null,
      display_order: cert.display_order || 0,
    };

    if (cert.id) {
      mutations.certifications.update({ id: cert.id, updates: data });
    } else {
      mutations.certifications.create(data);
    }
  };

  const addCertification = () => {
    setLocalCertifications([
      ...localCertifications,
      {
        id: null,
        certification_name: "",
        issuing_organization: "",
        date_earned: "",
        expiration_date: "",
        credential_id: "",
        is_verified: false,
        certificate_url: "",
      },
    ]);
  };

  const removeCertification = (cert: any) => {
    if (cert.id) {
      mutations.certifications.delete(cert.id);
    } else {
      setLocalCertifications(localCertifications.filter((c) => c !== cert));
    }
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...localCertifications];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCertifications(updated);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to Supabase storage
      updateCertification(index, "certificate_url", URL.createObjectURL(file));
      updateCertification(index, "is_verified", true);
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
          {localCertifications.map((certification, index) => (
            <Collapsible key={certification.id || index} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {certification.certification_name || `Certification ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                      {certification.is_verified ? (
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
                    {localCertifications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(certification)}
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
                        value={certification.certification_name || ""}
                        onChange={(e) => updateCertification(index, "certification_name", e.target.value)}
                        onBlur={() => handleSave(certification)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Issuing Organization <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="Amazon Web Services"
                        value={certification.issuing_organization || ""}
                        onChange={(e) => updateCertification(index, "issuing_organization", e.target.value)}
                        onBlur={() => handleSave(certification)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date Earned</Label>
                        <Input
                          type="date"
                          value={certification.date_earned || ""}
                          onChange={(e) => updateCertification(index, "date_earned", e.target.value)}
                          onBlur={() => handleSave(certification)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiration Date (if applicable)</Label>
                        <Input
                          type="date"
                          value={certification.expiration_date || ""}
                          onChange={(e) => updateCertification(index, "expiration_date", e.target.value)}
                          onBlur={() => handleSave(certification)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Credential ID</Label>
                      <Input
                        placeholder="ABC123XYZ"
                        value={certification.credential_id || ""}
                        onChange={(e) => updateCertification(index, "credential_id", e.target.value)}
                        onBlur={() => handleSave(certification)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Certificate</Label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          id={`cert-upload-${index}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload(index, e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            document.getElementById(`cert-upload-${index}`)?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {certification.certificate_url ? "Change Document" : "Upload Document"}
                        </Button>
                      </div>
                      {certification.certificate_url && (
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