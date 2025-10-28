import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SuggestionType = 
  | "professional_summary"
  | "job_description"
  | "skill_suggestions"
  | "optimize_resume";

interface SuggestionContext {
  jobTitle?: string;
  company?: string;
  description?: string;
  experience?: string;
  skills?: string[];
  industry?: string;
  existingSkills?: string[];
  [key: string]: any;
}

export const useAISuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const { toast } = useToast();

  const getSuggestion = async (type: SuggestionType, context: SuggestionContext) => {
    setLoading(true);
    setSuggestion("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-suggest-content", {
        body: { type, context },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        // Handle rate limiting and payment errors
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Rate Limit Exceeded",
            description: "Please wait a moment before requesting more suggestions.",
            variant: "destructive",
          });
        } else if (data.error.includes('credits')) {
          toast({
            title: "AI Credits Exhausted",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return null;
      }

      setSuggestion(data.suggestion);
      return data.suggestion;

    } catch (error: any) {
      console.error("Error getting AI suggestion:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI suggestion. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSuggestion = () => {
    setSuggestion("");
  };

  return {
    suggestion,
    loading,
    getSuggestion,
    clearSuggestion,
  };
};
