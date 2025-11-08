import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export interface Activity {
  id: string;
  user_id: string;
  resume_id: string | null;
  activity_type: 'created' | 'updated' | 'downloaded' | 'deleted' | 'duplicated';
  resume_title: string;
  created_at: string;
}

export const useActivities = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!user,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["activities", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const logActivity = useMutation({
    mutationFn: async ({ 
      activityType, 
      resumeTitle, 
      resumeId 
    }: { 
      activityType: Activity['activity_type']; 
      resumeTitle: string; 
      resumeId?: string | null;
    }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("activities")
        .insert({
          user_id: user.id,
          activity_type: activityType,
          resume_title: resumeTitle,
          resume_id: resumeId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  return {
    activities,
    isLoading,
    logActivity: logActivity.mutate,
    isLogging: logActivity.isPending,
  };
};