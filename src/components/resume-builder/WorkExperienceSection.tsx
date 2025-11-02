import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface WorkExperienceSectionProps {
  resumeId: string;
}

export const WorkExperienceSection = ({ resumeId }: WorkExperienceSectionProps) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([
    {
      id: "1",
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
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
          {experiences.map((experience, index) => (
            <Collapsible key={experience.id} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <h4 className="font-semibold">
                            {experience.jobTitle || `Experience ${index + 1}`}
                          </h4>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(experience.id)}
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
                          value={experience.jobTitle}
                          onChange={(e) =>
                            updateExperience(experience.id, "jobTitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Company <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          placeholder="Tech Corp"
                          value={experience.company}
                          onChange={(e) =>
                            updateExperience(experience.id, "company", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="San Francisco, CA"
                        value={experience.location}
                        onChange={(e) =>
                          updateExperience(experience.id, "location", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={experience.startDate}
                          onChange={(e) =>
                            updateExperience(experience.id, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={experience.endDate}
                          onChange={(e) =>
                            updateExperience(experience.id, "endDate", e.target.value)
                          }
                          disabled={experience.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${experience.id}`}
                        checked={experience.current}
                        onCheckedChange={(checked) =>
                          updateExperience(experience.id, "current", checked)
                        }
                      />
                      <Label htmlFor={`current-${experience.id}`} className="cursor-pointer">
                        I currently work here
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Description</Label>
                      <Textarea
                        placeholder="• Developed and maintained web applications&#10;• Collaborated with cross-functional teams&#10;• Implemented new features and bug fixes"
                        className="min-h-32"
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(experience.id, "description", e.target.value)
                        }
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
