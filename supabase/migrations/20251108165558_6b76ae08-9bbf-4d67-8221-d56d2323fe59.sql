-- Create activities table to track user actions
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('created', 'updated', 'downloaded', 'deleted', 'duplicated')),
  resume_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own activities"
ON public.activities
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
ON public.activities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_activities_user_created ON public.activities(user_id, created_at DESC);

-- Enable realtime for activities
ALTER TABLE public.activities REPLICA IDENTITY FULL;

-- Add trigger to automatically update updated_at on resumes table when activities happen
CREATE OR REPLACE FUNCTION public.update_resume_access_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.resume_id IS NOT NULL THEN
    UPDATE public.resumes 
    SET last_accessed_at = now() 
    WHERE id = NEW.resume_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_resume_access
AFTER INSERT ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_resume_access_time();