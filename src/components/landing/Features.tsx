import { FileText, Sparkles, Download, Shield, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Choose from dozens of beautiful, ATS-optimized templates designed by experts.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description: "Get intelligent content recommendations to make your resume stand out.",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Download your resume in PDF, Word, or share it with a custom link.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. We never share your information.",
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    description: "Create a complete resume in under 10 minutes with our intuitive builder.",
  },
  {
    icon: Users,
    title: "LinkedIn Integration",
    description: "Import your LinkedIn profile data to get started even faster.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="container py-20 bg-secondary/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need to Succeed
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Powerful features to help you create the perfect resume and land your dream job.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
