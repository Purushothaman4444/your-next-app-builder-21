import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Create Your Perfect Resume in{" "}
          <span className="text-primary">Minutes</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Build professional, ATS-friendly resumes with our easy-to-use builder. 
          Stand out from the crowd and land your dream job.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="#templates">View Templates</Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span>ATS-friendly templates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span>Export to PDF & Word</span>
          </div>
        </div>
      </div>
    </section>
  );
};
