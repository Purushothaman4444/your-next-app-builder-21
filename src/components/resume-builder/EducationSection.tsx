import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
  coursework: string;
}

export const EducationSection = () => {
  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      school: "",
      degree: "",
      field: "",
      graduationDate: "",
      gpa: "",
      coursework: "",
    },
  ]);

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        id: Date.now().toString(),
        school: "",
        degree: "",
        field: "",
        graduationDate: "",
        gpa: "",
        coursework: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
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
          {educations.map((education, index) => (
            <Collapsible key={education.id} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {education.degree || `Education ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {educations.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(education.id)}
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
                        value={education.school}
                        onChange={(e) => updateEducation(education.id, "school", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>
                          Degree <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          placeholder="Bachelor of Science"
                          value={education.degree}
                          onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          placeholder="Computer Science"
                          value={education.field}
                          onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          type="month"
                          value={education.graduationDate}
                          onChange={(e) =>
                            updateEducation(education.id, "graduationDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input
                          placeholder="3.8/4.0"
                          value={education.gpa}
                          onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Relevant Coursework</Label>
                      <Textarea
                        placeholder="Data Structures, Algorithms, Database Systems, Web Development"
                        className="min-h-24"
                        value={education.coursework}
                        onChange={(e) =>
                          updateEducation(education.id, "coursework", e.target.value)
                        }
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
