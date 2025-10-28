import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
}

export const useResumes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ["resumes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Resume[];
    },
    enabled: !!user,
  });

  const createResume = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title,
          template_id: "professional",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Created",
        description: "Your new resume has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateResume = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Resume> }) => {
      const { data, error } = await supabase
        .from("resumes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Updated",
        description: "Your resume has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteResume = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resumes").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const duplicateResume = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      // Get the original resume
      const { data: originalResume, error: fetchError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create a copy
      const { data: newResume, error: createError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${originalResume.title} (Copy)`,
          template_id: originalResume.template_id,
        })
        .select()
        .single();

      if (createError) throw createError;
      return newResume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast({
        title: "Resume Duplicated",
        description: "Your resume has been duplicated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    resumes,
    isLoading,
    error,
    createResume: createResume.mutate,
    updateResume: updateResume.mutate,
    deleteResume: deleteResume.mutate,
    duplicateResume: duplicateResume.mutate,
    isCreating: createResume.isPending,
    isUpdating: updateResume.isPending,
    isDeleting: deleteResume.isPending,
    isDuplicating: duplicateResume.isPending,
  };
};
