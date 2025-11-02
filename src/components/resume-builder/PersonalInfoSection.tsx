import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, User } from "lucide-react";
import { useResumeData } from "@/hooks/useResumeData";

interface PersonalInfoSectionProps {
  resumeId: string;
}

export const PersonalInfoSection = ({ resumeId }: PersonalInfoSectionProps) => {
  const { personalInfo, mutations } = useResumeData(resumeId);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    linkedin_url: "",
    professional_summary: "",
    photo_url: "",
  });

  useEffect(() => {
    if (personalInfo) {
      setFormData({
        first_name: personalInfo.first_name || "",
        last_name: personalInfo.last_name || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        address: personalInfo.address || "",
        linkedin_url: personalInfo.linkedin_url || "",
        professional_summary: personalInfo.professional_summary || "",
        photo_url: personalInfo.photo_url || "",
      });
      if (personalInfo.photo_url) {
        setPhotoPreview(personalInfo.photo_url);
      }
    }
  }, [personalInfo]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        const newFormData = { ...formData, photo_url: reader.result as string };
        setFormData(newFormData);
        handleSave(newFormData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (dataToSave = formData) => {
    const saveData = {
      ...dataToSave,
      resume_id: resumeId,
    };

    if (personalInfo?.id) {
      mutations.personalInfo.update({ id: personalInfo.id, updates: dataToSave });
    } else {
      mutations.personalInfo.create(saveData);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Tell us about yourself. This information will appear at the top of your resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  size="sm"
                  className="absolute bottom-0 right-0"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </label>
            </div>
            <p className="text-sm text-muted-foreground">Upload a professional photo</p>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                onBlur={() => handleSave()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                onBlur={() => handleSave()}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleSave()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+1 (555) 123-4567" 
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleSave()}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              placeholder="123 Main St, City, State, ZIP" 
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              onBlur={() => handleSave()}
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input 
              id="linkedin" 
              placeholder="https://linkedin.com/in/johndoe" 
              value={formData.linkedin_url}
              onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
              onBlur={() => handleSave()}
            />
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              placeholder="Write a brief summary of your professional background, skills, and career objectives..."
              className="min-h-32"
              value={formData.professional_summary}
              onChange={(e) => handleInputChange("professional_summary", e.target.value)}
              onBlur={() => handleSave()}
            />
            <p className="text-sm text-muted-foreground">
              A compelling summary can help you stand out to recruiters and hiring managers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
