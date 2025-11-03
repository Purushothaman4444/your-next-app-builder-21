import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, ExternalLink, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useResumeData } from "@/hooks/useResumeData";

interface ProjectsSectionProps {
  resumeId: string;
}

export const ProjectsSection = ({ resumeId }: ProjectsSectionProps) => {
  const { projects, mutations } = useResumeData(resumeId);
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    if (projects && projects.length > 0) {
      setLocalProjects(projects);
    } else {
      setLocalProjects([{
        id: null,
        project_name: "",
        description: "",
        role: "",
        duration: "",
        technologies: [],
        live_url: "",
        github_url: "",
        image_url: "",
      }]);
    }
  }, [projects]);

  const handleSave = async (project: any) => {
    const data = {
      resume_id: resumeId,
      project_name: project.project_name,
      description: project.description || null,
      role: project.role || null,
      duration: project.duration || null,
      technologies: project.technologies || [],
      live_url: project.live_url || null,
      github_url: project.github_url || null,
      image_url: project.image_url || null,
      display_order: project.display_order || 0,
    };

    if (project.id) {
      mutations.projects.update({ id: project.id, updates: data });
    } else {
      mutations.projects.create(data);
    }
  };

  const addProject = () => {
    setLocalProjects([
      ...localProjects,
      {
        id: null,
        project_name: "",
        description: "",
        role: "",
        duration: "",
        technologies: [],
        live_url: "",
        github_url: "",
        image_url: "",
      },
    ]);
  };

  const removeProject = (project: any) => {
    if (project.id) {
      mutations.projects.delete(project.id);
    } else {
      setLocalProjects(localProjects.filter((p) => p !== project));
    }
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...localProjects];
    updated[index] = { ...updated[index], [field]: value };
    setLocalProjects(updated);
  };

  const addTechnology = (index: number) => {
    if (!newTech.trim()) return;
    const project = localProjects[index];
    const technologies = [...(project.technologies || []), newTech.trim()];
    updateProject(index, "technologies", technologies);
    setNewTech("");
  };

  const removeTechnology = (index: number, tech: string) => {
    const project = localProjects[index];
    const technologies = (project.technologies || []).filter((t: string) => t !== tech);
    updateProject(index, "technologies", technologies);
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(index, "image_url", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Showcase your portfolio projects, personal work, or significant contributions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {localProjects.map((project, index) => (
            <Collapsible key={project.id || index} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <h4 className="font-semibold">
                          {project.project_name || `Project ${index + 1}`}
                        </h4>
                      </Button>
                    </CollapsibleTrigger>
                    {localProjects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project)}
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
                        Project Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="E-commerce Platform"
                        value={project.project_name || ""}
                        onChange={(e) => updateProject(index, "project_name", e.target.value)}
                        onBlur={() => handleSave(project)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Project Description</Label>
                      <Textarea
                        placeholder="Describe what the project does, your contributions, and the impact it had..."
                        className="min-h-32"
                        value={project.description || ""}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        onBlur={() => handleSave(project)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Your Role</Label>
                        <Input
                          placeholder="Full Stack Developer"
                          value={project.role || ""}
                          onChange={(e) => updateProject(index, "role", e.target.value)}
                          onBlur={() => handleSave(project)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          placeholder="3 months"
                          value={project.duration || ""}
                          onChange={(e) => updateProject(index, "duration", e.target.value)}
                          onBlur={() => handleSave(project)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Technologies Used</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="React, Node.js, PostgreSQL"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addTechnology(index);
                              handleSave(project);
                            }
                          }}
                        />
                        <Button type="button" onClick={() => {
                          addTechnology(index);
                          handleSave(project);
                        }}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech: string) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                              <button
                                onClick={() => {
                                  removeTechnology(index, tech);
                                  handleSave(project);
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Live Demo URL</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com"
                            value={project.live_url || ""}
                            onChange={(e) => updateProject(index, "live_url", e.target.value)}
                            onBlur={() => handleSave(project)}
                          />
                          {project.live_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(project.live_url, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>GitHub Repository</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://github.com/username/repo"
                            value={project.github_url || ""}
                            onChange={(e) => updateProject(index, "github_url", e.target.value)}
                            onBlur={() => handleSave(project)}
                          />
                          {project.github_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(project.github_url, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Project Screenshot</Label>
                      {project.image_url && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden mb-2">
                          <img
                            src={project.image_url}
                            alt={project.project_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        id={`project-image-${index}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          document.getElementById(`project-image-${index}`)?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {project.image_url ? "Change Screenshot" : "Upload Screenshot"}
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};