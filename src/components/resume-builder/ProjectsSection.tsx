import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, ExternalLink, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  duration: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl?: string;
}

interface ProjectsSectionProps {
  resumeId: string;
}

export const ProjectsSection = ({ resumeId }: ProjectsSectionProps) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "",
      description: "",
      role: "",
      duration: "",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
    },
  ]);
  const [newTech, setNewTech] = useState("");

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        role: "",
        duration: "",
        technologies: [],
        liveUrl: "",
        githubUrl: "",
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)));
  };

  const addTechnology = (projectId: string) => {
    if (!newTech.trim()) return;
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(projectId, "technologies", [...project.technologies, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        "technologies",
        project.technologies.filter((t) => t !== tech)
      );
    }
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(id, "imageUrl", reader.result as string);
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
          {projects.map((project, index) => (
            <Collapsible key={project.id} defaultOpen={index === 0}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <h4 className="font-semibold">
                          {project.name || `Project ${index + 1}`}
                        </h4>
                      </Button>
                    </CollapsibleTrigger>
                    {projects.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
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
                        value={project.name}
                        onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Project Description</Label>
                      <Textarea
                        placeholder="Describe what the project does, your contributions, and the impact it had..."
                        className="min-h-32"
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Your Role</Label>
                        <Input
                          placeholder="Full Stack Developer"
                          value={project.role}
                          onChange={(e) => updateProject(project.id, "role", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          placeholder="3 months"
                          value={project.duration}
                          onChange={(e) => updateProject(project.id, "duration", e.target.value)}
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
                          onKeyPress={(e) => e.key === "Enter" && addTechnology(project.id)}
                        />
                        <Button type="button" onClick={() => addTechnology(project.id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                              <button
                                onClick={() => removeTechnology(project.id, tech)}
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
                            value={project.liveUrl}
                            onChange={(e) => updateProject(project.id, "liveUrl", e.target.value)}
                          />
                          {project.liveUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(project.liveUrl, "_blank")}
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
                            value={project.githubUrl}
                            onChange={(e) => updateProject(project.id, "githubUrl", e.target.value)}
                          />
                          {project.githubUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(project.githubUrl, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Project Screenshot</Label>
                      {project.imageUrl && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden mb-2">
                          <img
                            src={project.imageUrl}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        id={`project-image-${project.id}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(project.id, e)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          document.getElementById(`project-image-${project.id}`)?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {project.imageUrl ? "Change Screenshot" : "Upload Screenshot"}
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
