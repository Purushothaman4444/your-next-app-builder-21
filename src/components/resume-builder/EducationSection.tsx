import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useResumeData } from "@/hooks/useResumeData";

interface EducationSectionProps {
  resumeId: string;
}

export const EducationSection = ({ resumeId }: EducationSectionProps) => {
  const { education, mutations } = useResumeData(resumeId);
  const [localEducation, setLocalEducation] = useState<any[]>([]);

  useEffect(() => {
    if (education && education.length > 0) {
      setLocalEducation(education);
    } else {
      setLocalEducation([{
        id: null,
        school: "",
        degree: "",
        field_of_study: "",
        graduation_date: "",
        gpa: "",
        relevant_coursework: "",
      }]);
    }
  }, [education]);

  const handleSave = async (edu: any) => {
    const data = {
      resume_id: resumeId,
      school: edu.school,
      degree: edu.degree,
      field_of_study: edu.field_of_study || null,
      graduation_date: edu.graduation_date || null,
      gpa: edu.gpa || null,
      relevant_coursework: edu.relevant_coursework || null,
      display_order: edu.display_order || 0,
    };

    if (edu.id) {
      mutations.education.update({ id: edu.id, updates: data });
    } else {
      mutations.education.create(data);
    }
  };

  const addEducation = () => {
    setLocalEducation([
      ...localEducation,
      {
        id: null,
        school: "",
        degree: "",
        field_of_study: "",
        graduation_date: "",
        gpa: "",
        relevant_coursework: "",
      },
    ]);
  };

  const removeEducation = (edu: any) => {
    if (edu.id) {
      mutations.education.delete(edu.id);
    } else {
      setLocalEducation(localEducation.filter((e) => e !== edu));
    }
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...localEducation];
    updated[index] = { ...updated[index], [field]: value };
    setLocalEducation(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Add your educational background. Include degrees, certifications, and relevant coursework.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {localEducation.map((edu, index) => (
            <Collapsible key={edu.id || index} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {edu.degree || `Education ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {localEducation.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu)}
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
                        School/Institution <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="University of Technology"
                        value={edu.school || ""}
                        onChange={(e) => updateEducation(index, "school", e.target.value)}
                        onBlur={() => handleSave(edu)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Degree <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          placeholder="Bachelor of Science"
                          value={edu.degree || ""}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          onBlur={() => handleSave(edu)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          placeholder="Computer Science"
                          value={edu.field_of_study || ""}
                          onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                          onBlur={() => handleSave(edu)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="date"
                          value={edu.graduation_date || ""}
                          onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                          onBlur={() => handleSave(edu)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          placeholder="3.8/4.0"
                          value={edu.gpa || ""}
                          onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                          onBlur={() => handleSave(edu)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Relevant Coursework</Label>
                      <Textarea
                        placeholder="Data Structures, Algorithms, Database Systems, Web Development"
                        className="min-h-24"
                        value={edu.relevant_coursework || ""}
                        onChange={(e) => updateEducation(index, "relevant_coursework", e.target.value)}
                        onBlur={() => handleSave(edu)}
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <Button onClick={addEducation} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Education
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};