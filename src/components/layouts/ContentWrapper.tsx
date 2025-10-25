import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentWrapper = ({ children, className }: ContentWrapperProps) => {
  return (
    <div className={cn("container py-8 md:py-12", className)}>
      {children}
    </div>
  );
};
