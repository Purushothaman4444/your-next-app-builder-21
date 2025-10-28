import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type BucketType = "profile-photos" | "certificates" | "project-images";

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: BucketType,
    resumeId?: string
  ): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Record upload in file_uploads table
      const { error: recordError } = await supabase.from("file_uploads").insert({
        user_id: user.id,
        resume_id: resumeId,
        file_name: file.name,
        file_path: filePath,
        file_type: bucket === "profile-photos" ? "photo" : bucket === "certificates" ? "certificate" : "project_image",
        file_size: file.size,
        mime_type: file.type,
      });

      if (recordError) throw recordError;

      setProgress(100);
      
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded successfully.",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (filePath: string, bucket: BucketType): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) throw error;

      // Delete record from file_uploads table
      await supabase.from("file_uploads").delete().eq("file_path", filePath);

      toast({
        title: "File Deleted",
        description: "Your file has been deleted successfully.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
  };
};
