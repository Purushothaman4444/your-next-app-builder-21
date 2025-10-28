import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Check } from "lucide-react";
import { useAISuggestions, SuggestionType } from "@/hooks/useAISuggestions";
import { LoadingSpinner } from "./LoadingSpinner";

interface AIContentSuggestionProps {
  type: SuggestionType;
  context: any;
  onApply?: (suggestion: string) => void;
  title: string;
  description: string;
}

export const AIContentSuggestion = ({
  type,
  context,
  onApply,
  title,
  description,
}: AIContentSuggestionProps) => {
  const { suggestion, loading, getSuggestion, clearSuggestion } = useAISuggestions();
  const [copied, setCopied] = useState(false);

  const handleGetSuggestion = async () => {
    await getSuggestion(type, context);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply && suggestion) {
      onApply(suggestion);
      clearSuggestion();
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            onClick={handleGetSuggestion}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <>
                <LoadingSpinner className="h-4 w-4 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Suggestion
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {suggestion && (
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{suggestion}</p>
          </div>
          <div className="flex gap-2 mt-4">
            {onApply && (
              <Button onClick={handleApply} size="sm">
                Apply Suggestion
              </Button>
            )}
            <Button onClick={handleCopy} size="sm" variant="outline">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
