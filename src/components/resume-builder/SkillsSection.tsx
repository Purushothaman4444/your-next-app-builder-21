import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Plus, X } from "lucide-react";
import { useResumeData } from "@/hooks/useResumeData";

interface SkillsSectionProps {
  resumeId: string;
}

export const SkillsSection = ({ resumeId }: SkillsSectionProps) => {
  const { skills, mutations } = useResumeData(resumeId);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  const technicalSkills = skills.filter((s: any) => s.category === "technical");
  const softSkills = skills.filter((s: any) => s.category === "soft");
  const languages = skills.filter((s: any) => s.category === "languages");

  const addSkill = (category: string) => {
    if (!newSkill.trim()) return;

    const data = {
      resume_id: resumeId,
      skill_name: newSkill.trim(),
      category,
      proficiency_level: 50,
      display_order: 0,
    };

    mutations.skills.create(data);
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    mutations.skills.delete(id);
  };

  const updateSkillLevel = (id: string, level: number) => {
    mutations.skills.update({ id, updates: { proficiency_level: level } });
  };

  const getSkillLevelText = (level: number) => {
    if (level < 25) return "Beginner";
    if (level < 50) return "Intermediate";
    if (level < 75) return "Advanced";
    return "Expert";
  };

  const renderSkillsList = (skillsList: any[], category: string) => (
    <div className="space-y-4">
      {skillsList.map((skill) => (
        <Card key={skill.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{skill.skill_name}</h4>
                <Badge variant="secondary">{getSkillLevelText(skill.proficiency_level)}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(skill.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <Slider
                value={[skill.proficiency_level]}
                onValueChange={(value) => updateSkillLevel(skill.id, value[0])}
                max={100}
                step={1}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add your technical skills, soft skills, and languages. Rate your proficiency for each.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="soft">Soft Skills</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-4 mt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., React, Python, SQL"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill("technical")}
                />
                <Button onClick={() => addSkill("technical")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {technicalSkills.length > 0 ? (
                renderSkillsList(technicalSkills, "technical")
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No technical skills added yet. Add your first skill above.
                </p>
              )}
            </TabsContent>

            <TabsContent value="soft" className="space-y-4 mt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Leadership, Communication, Problem Solving"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill("soft")}
                />
                <Button onClick={() => addSkill("soft")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {softSkills.length > 0 ? (
                renderSkillsList(softSkills, "soft")
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No soft skills added yet. Add your first skill above.
                </p>
              )}
            </TabsContent>

            <TabsContent value="languages" className="space-y-4 mt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., English, Spanish, Mandarin"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill("languages")}
                />
                <Button onClick={() => addSkill("languages")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              {languages.length > 0 ? (
                renderSkillsList(languages, "languages")
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No languages added yet. Add your first language above.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};