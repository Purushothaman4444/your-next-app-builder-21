import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface ExportHistory {
  id: string;
  user_id: string;
  resume_id: string;
  resume_title: string;
  export_format: string;
  file_name: string;
  created_at: string;
}

export const useExportHistory = (resumeId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exportHistory, isLoading } = useQuery({
    queryKey: ["export-history", resumeId],
    queryFn: async () => {
      let query = supabase
        .from("export_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (resumeId) {
        query = query.eq("resume_id", resumeId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ExportHistory[];
    },
  });

  const logExport = useMutation({
    mutationFn: async ({
      resumeId,
      resumeTitle,
      exportFormat,
      fileName,
    }: {
      resumeId: string;
      resumeTitle: string;
      exportFormat: string;
      fileName: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("export_history").insert({
        user_id: user.id,
        resume_id: resumeId,
        resume_title: resumeTitle,
        export_format: exportFormat,
        file_name: fileName,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["export-history"] });
    },
    onError: (error) => {
      console.error("Error logging export:", error);
    },
  });

  return {
    exportHistory,
    isLoading,
    logExport: logExport.mutate,
  };
};
