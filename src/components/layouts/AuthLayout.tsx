import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary-foreground">
          <FileText className="h-8 w-8" />
          <span className="text-2xl font-bold">Resume Generator</span>
        </Link>
        <div className="text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">
            Join thousands of professionals building better careers
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Create ATS-friendly resumes in minutes. Land more interviews. Get hired faster.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Resume Generator</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
