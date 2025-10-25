import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Edit, Copy, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface Resume {
  id: string;
  title: string;
  updatedAt: string;
  template: string;
}

interface ResumeCardProps {
  resume: Resume;
}

export const ResumeCard = ({ resume }: ResumeCardProps) => {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-lg">{resume.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="aspect-[8.5/11] bg-secondary rounded-md mb-4 flex items-center justify-center">
          <FileText className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          Updated {new Date(resume.updatedAt).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/resume/edit/${resume.id}`}>Edit Resume</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
