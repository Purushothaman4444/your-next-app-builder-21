import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  type?: "input" | "textarea";
  inputProps?: React.ComponentProps<typeof Input>;
  textareaProps?: React.ComponentProps<typeof Textarea>;
}

export const FormField = ({
  label,
  error,
  required,
  className,
  type = "input",
  inputProps,
  textareaProps,
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {type === "input" ? (
        <Input {...inputProps} className={cn(error && "border-destructive", inputProps?.className)} />
      ) : (
        <Textarea {...textareaProps} className={cn(error && "border-destructive", textareaProps?.className)} />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
