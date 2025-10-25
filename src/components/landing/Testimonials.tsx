import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "This resume builder helped me land interviews at top tech companies. The ATS-friendly templates made all the difference!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    content: "I created a professional resume in less than 15 minutes. The templates are modern and the AI suggestions were incredibly helpful.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Recent Graduate",
    content: "As a new graduate, I wasn't sure how to structure my resume. This tool guided me through every step and I got my first job offer!",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Trusted by Job Seekers Worldwide
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of professionals who have successfully landed their dream jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
