import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, Layout, Download } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: FileText,
    title: "Create Resume",
    description: "Start from scratch",
    href: "/resume/create",
  },
  {
    icon: Upload,
    title: "Import LinkedIn",
    description: "Import profile data",
    href: "/import/linkedin",
  },
  {
    icon: Layout,
    title: "Browse Templates",
    description: "Explore designs",
    href: "/templates",
  },
  {
    icon: Download,
    title: "Export History",
    description: "View downloads",
    href: "/exports",
  },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.title} to={action.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
