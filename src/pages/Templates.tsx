import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ContentWrapper } from "@/components/layouts/ContentWrapper";
import { PageHeader } from "@/components/layouts/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  {
    id: "professional",
    name: "Professional",
    category: "Professional",
    description: "Clean and ATS-friendly design for corporate roles",
  },
  {
    id: "modern",
    name: "Modern",
    category: "Creative",
    description: "Contemporary design with bold typography",
  },
  {
    id: "simple",
    name: "Simple",
    category: "Simple",
    description: "Minimalist layout focusing on content",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Eye-catching design for creative industries",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    description: "Sophisticated design for senior positions",
  },
  {
    id: "tech",
    name: "Tech",
    category: "Professional",
    description: "Technical layout for IT and engineering roles",
  },
];

const categories = ["All", "Professional", "Creative", "Simple"];

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <MainLayout>
      <ContentWrapper>
        <PageHeader
          title="Resume Templates"
          description="Choose from our collection of professional templates"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
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
              className="hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <CardContent className="pt-6">
                <div className="aspect-[8.5/11] bg-secondary rounded-md mb-4 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  <FileText className="h-20 w-20 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <Button className="w-full" asChild>
                    <Link to={`/resume/create?template=${template.id}`}>
                      Use Template
                    </Link>
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
