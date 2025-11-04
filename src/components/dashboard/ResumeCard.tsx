import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Edit, Copy, Trash2, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useResumes, Resume } from "@/hooks/useResumes";
import { downloadResumeAsPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ResumeCardProps {
  resume: Resume;
}

export const ResumeCard = ({ resume }: ResumeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteResume, duplicateResume, isDeleting, isDuplicating } = useResumes();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDownload = () => {
    navigate(`/resume/preview?resumeId=${resume.id}`);
  };

  const handleDuplicate = () => {
    duplicateResume(resume.id);
  };

  const handleDelete = () => {
    deleteResume(resume.id);
    setShowDeleteDialog(false);
  };
  return (
    <>
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
              <DropdownMenuItem asChild>
                <Link to={`/resume/create?resumeId=${resume.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
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
            Updated {new Date(resume.updated_at).toLocaleDateString()}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/resume/create?resumeId=${resume.id}`}>Edit Resume</Link>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{resume.title}" and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
