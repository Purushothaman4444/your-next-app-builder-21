import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useResumeData = (resumeId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Personal Info
  const { data: personalInfo } = useQuery({
    queryKey: ["personalInfo", resumeId],
    queryFn: async () => {
      if (!resumeId) return null;
      const { data, error } = await supabase
        .from("personal_info")
        .select("*")
        .eq("resume_id", resumeId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Work Experience
  const { data: workExperience = [] } = useQuery({
    queryKey: ["workExperience", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const { data, error } = await supabase
        .from("work_experience")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Education
  const { data: education = [] } = useQuery({
    queryKey: ["education", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Skills
  const { data: skills = [] } = useQuery({
    queryKey: ["skills", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Certifications
  const { data: certifications = [] } = useQuery({
    queryKey: ["certifications", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Projects
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", resumeId],
    queryFn: async () => {
      if (!resumeId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!resumeId,
  });

  // Mutations for personal info
  const createPersonalInfo = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("personal_info").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalInfo", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updatePersonalInfo = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("personal_info").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalInfo", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Mutations for work experience
  const createWorkExperience = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("work_experience").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateWorkExperience = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("work_experience").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteWorkExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("work_experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExperience", resumeId] });
      toast({ title: "Success", description: "Data deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Mutations for education
  const createEducation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("education").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateEducation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("education").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteEducation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", resumeId] });
      toast({ title: "Success", description: "Data deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Mutations for skills
  const createSkill = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("skills").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("skills").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", resumeId] });
      toast({ title: "Success", description: "Data deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Mutations for certifications
  const createCertification = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("certifications").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCertification = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("certifications").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCertification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications", resumeId] });
      toast({ title: "Success", description: "Data deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Mutations for projects
  const createProject = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("projects").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", resumeId] });
      toast({ title: "Success", description: "Data saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("projects").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", resumeId] });
      toast({ title: "Success", description: "Data updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", resumeId] });
      toast({ title: "Success", description: "Data deleted successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    personalInfo,
    workExperience,
    education,
    skills,
    certifications,
    projects,
    mutations: {
      personalInfo: {
        create: createPersonalInfo.mutate,
        update: updatePersonalInfo.mutate,
      },
      workExperience: {
        create: createWorkExperience.mutate,
        update: updateWorkExperience.mutate,
        delete: deleteWorkExperience.mutate,
      },
      education: {
        create: createEducation.mutate,
        update: updateEducation.mutate,
        delete: deleteEducation.mutate,
      },
      skills: {
        create: createSkill.mutate,
        update: updateSkill.mutate,
        delete: deleteSkill.mutate,
      },
      certifications: {
        create: createCertification.mutate,
        update: updateCertification.mutate,
        delete: deleteCertification.mutate,
      },
      projects: {
        create: createProject.mutate,
        update: updateProject.mutate,
        delete: deleteProject.mutate,
      },
    },
  };
};