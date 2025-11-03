import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useResumeData } from "@/hooks/useResumeData";
import { useToast } from "@/hooks/use-toast";

interface WorkExperienceSectionProps {
  resumeId: string;
}

export const WorkExperienceSection = ({ resumeId }: WorkExperienceSectionProps) => {
  const { workExperience, mutations } = useResumeData(resumeId);
  const { toast } = useToast();
  const [localExperiences, setLocalExperiences] = useState<any[]>([]);

  useEffect(() => {
    if (workExperience && workExperience.length > 0) {
      setLocalExperiences(workExperience);
    } else {
      setLocalExperiences([{
        id: null,
        job_title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      }]);
    }
  }, [workExperience]);

  const handleSave = async (experience: any) => {
    const data = {
      resume_id: resumeId,
      job_title: experience.job_title,
      company: experience.company,
      location: experience.location || null,
      start_date: experience.start_date || null,
      end_date: experience.end_date || null,
      is_current: experience.is_current || false,
      description: experience.description || null,
      display_order: experience.display_order || 0,
    };

    if (experience.id) {
      mutations.workExperience.update({ id: experience.id, updates: data });
    } else {
      mutations.workExperience.create(data);
    }
  };

  const addExperience = () => {
    setLocalExperiences([
      ...localExperiences,
      {
        id: null,
        job_title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (experience: any) => {
    if (experience.id) {
      mutations.workExperience.delete(experience.id);
    } else {
      setLocalExperiences(localExperiences.filter((exp) => exp !== experience));
    }
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...localExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setLocalExperiences(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Add your work history. Start with your most recent position.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {localExperiences.map((experience, index) => (
            <Collapsible key={experience.id || index} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {experience.job_title || `Experience ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {localExperiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(experience)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Job Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          placeholder="Software Engineer"
                          value={experience.job_title || ""}
                          onChange={(e) => updateExperience(index, "job_title", e.target.value)}
                          onBlur={() => handleSave(experience)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Company <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          placeholder="Tech Corp"
                          value={experience.company || ""}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          onBlur={() => handleSave(experience)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="San Francisco, CA"
                        value={experience.location || ""}
                        onChange={(e) => updateExperience(index, "location", e.target.value)}
                        onBlur={() => handleSave(experience)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={experience.start_date || ""}
                          onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                          onBlur={() => handleSave(experience)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={experience.end_date || ""}
                          onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                          onBlur={() => handleSave(experience)}
                          disabled={experience.is_current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${index}`}
                        checked={experience.is_current || false}
                        onCheckedChange={(checked) => {
                          updateExperience(index, "is_current", checked);
                          if (checked) {
                            updateExperience(index, "end_date", null);
                          }
                          handleSave({ ...experience, is_current: checked, end_date: checked ? null : experience.end_date });
                        }}
                      />
                      <Label htmlFor={`current-${index}`} className="cursor-pointer">
                        I currently work here
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Implemented new features and bug fixes"
                        className="min-h-32"
                        value={experience.description || ""}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        onBlur={() => handleSave(experience)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Use bullet points to highlight your key responsibilities and achievements
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <Button onClick={addExperience} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Experience
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};