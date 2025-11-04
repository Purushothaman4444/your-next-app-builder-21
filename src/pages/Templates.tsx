import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory } from "@/constants/templates";
import { useResumes } from "@/hooks/useResumes";
import { useToast } from "@/hooks/use-toast";

const Templates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createResume, isCreating } = useResumes();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  const handleSelectTemplate = async (templateId: string) => {
    setCreatingTemplateId(templateId);
    
    // Create a new resume with this template
    try {
      const template = TEMPLATES.find(t => t.id === templateId);
      await createResume(`New ${template?.name || 'Resume'}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
      setCreatingTemplateId(null);
    }
  };

  return (
    <MainLayout>
      <ContentWrapper>
        <PageHeader
          title="Resume Templates"
          description="Choose from our collection of professional templates"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:border-primary/50 transition-colors group"
            >
              <CardContent className="pt-6">
                <div className="aspect-[8.5/11] bg-secondary rounded-md mb-4 flex flex-col items-center justify-center group-hover:bg-primary/5 transition-colors relative overflow-hidden">
                  <FileText className="h-20 w-20 text-muted-foreground mb-2" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Palette className="h-3 w-3" />
                    <span>{template.color}</span>
                  </div>
                  <div className="absolute bottom-2 text-xs text-muted-foreground">
                    {template.fontFamily}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSelectTemplate(template.id)}
                    disabled={isCreating || creatingTemplateId === template.id}
                  >
                    {creatingTemplateId === template.id ? "Creating..." : "Use Template"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentWrapper>
    </MainLayout>
  );
};

export default Templates;
