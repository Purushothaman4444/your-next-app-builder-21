import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRealtimeResumes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("resumes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resumes",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate resumes query when any change occurs
          queryClient.invalidateQueries({ queryKey: ["resumes", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};
