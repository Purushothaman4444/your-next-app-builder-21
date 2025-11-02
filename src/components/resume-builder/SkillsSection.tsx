import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Plus, X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface SkillsSectionProps {
  resumeId: string;
}

export const SkillsSection = ({ resumeId }: SkillsSectionProps) => {
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  const addSkill = (category: "technical" | "soft" | "languages") => {
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
      level: 50,
    };

    if (category === "technical") {
      setTechnicalSkills([...technicalSkills, skill]);
    } else if (category === "soft") {
      setSoftSkills([...softSkills, skill]);
    } else {
      setLanguages([...languages, skill]);
    }

    setNewSkill("");
  };

  const removeSkill = (id: string, category: "technical" | "soft" | "languages") => {
    if (category === "technical") {
      setTechnicalSkills(technicalSkills.filter((s) => s.id !== id));
    } else if (category === "soft") {
      setSoftSkills(softSkills.filter((s) => s.id !== id));
    } else {
      setLanguages(languages.filter((s) => s.id !== id));
    }
  };

  const updateSkillLevel = (id: string, level: number, category: "technical" | "soft" | "languages") => {
    if (category === "technical") {
      setTechnicalSkills(technicalSkills.map((s) => (s.id === id ? { ...s, level } : s)));
    } else if (category === "soft") {
      setSoftSkills(softSkills.map((s) => (s.id === id ? { ...s, level } : s)));
    } else {
      setLanguages(languages.map((s) => (s.id === id ? { ...s, level } : s)));
    }
  };

  const getSkillLevelText = (level: number) => {
    if (level < 25) return "Beginner";
    if (level < 50) return "Intermediate";
    if (level < 75) return "Advanced";
    return "Expert";
  };

  const renderSkillsList = (skills: Skill[], category: "technical" | "soft" | "languages") => (
    <div className="space-y-4">
      {skills.map((skill) => (
        <Card key={skill.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{skill.name}</h4>
                <Badge variant="secondary">{getSkillLevelText(skill.level)}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(skill.id, category)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <Slider
                value={[skill.level]}
                onValueChange={(value) => updateSkillLevel(skill.id, value[0], category)}
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
