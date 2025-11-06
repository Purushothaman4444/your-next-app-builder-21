-- Add custom_styles column to resumes table
ALTER TABLE public.resumes 
ADD COLUMN custom_styles JSONB DEFAULT NULL;