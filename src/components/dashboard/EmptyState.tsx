import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyState = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Create your first professional resume in minutes with our easy-to-use builder.
        </p>
        <Button asChild>
          <Link to="/resume/create">
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Resume
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
