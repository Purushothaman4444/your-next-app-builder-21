-- Create resumes table
CREATE TABLE public.resumes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'professional',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create personal_info table
CREATE TABLE public.personal_info (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  linkedin_url TEXT,
  professional_summary TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work_experience table
CREATE TABLE public.work_experience (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  graduation_date DATE,
  gpa TEXT,
  relevant_coursework TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technical', 'soft', 'languages'
  proficiency_level INTEGER DEFAULT 50, -- 0-100
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  date_earned DATE,
  expiration_date DATE,
  credential_id TEXT,
  certificate_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  role TEXT,
  duration TEXT,
  technologies TEXT[], -- Array of technology names
  live_url TEXT,
  github_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file_uploads table for tracking uploaded files
CREATE TABLE public.file_uploads (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'photo', 'certificate', 'project_image'
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resumes
CREATE POLICY "Users can view their own resumes"
ON public.resumes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own resumes"
ON public.resumes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own resumes"
ON public.resumes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own resumes"
ON public.resumes FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for personal_info
CREATE POLICY "Users can view their own personal info"
ON public.personal_info FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = personal_info.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own personal info"
ON public.personal_info FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = personal_info.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own personal info"
ON public.personal_info FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = personal_info.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own personal info"
ON public.personal_info FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = personal_info.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for work_experience
CREATE POLICY "Users can view their own work experience"
ON public.work_experience FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = work_experience.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own work experience"
ON public.work_experience FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = work_experience.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own work experience"
ON public.work_experience FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = work_experience.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own work experience"
ON public.work_experience FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = work_experience.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for education
CREATE POLICY "Users can view their own education"
ON public.education FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = education.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own education"
ON public.education FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = education.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own education"
ON public.education FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = education.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own education"
ON public.education FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = education.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for skills
CREATE POLICY "Users can view their own skills"
ON public.skills FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = skills.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own skills"
ON public.skills FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = skills.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own skills"
ON public.skills FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = skills.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own skills"
ON public.skills FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = skills.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for certifications
CREATE POLICY "Users can view their own certifications"
ON public.certifications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = certifications.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own certifications"
ON public.certifications FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = certifications.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own certifications"
ON public.certifications FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = certifications.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own certifications"
ON public.certifications FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = certifications.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = projects.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own projects"
ON public.projects FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = projects.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = projects.resume_id
  AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.resumes
  WHERE resumes.id = projects.resume_id
  AND resumes.user_id = auth.uid()
));

-- RLS Policies for file_uploads
CREATE POLICY "Users can view their own file uploads"
ON public.file_uploads FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own file uploads"
ON public.file_uploads FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own file uploads"
ON public.file_uploads FOR DELETE
USING (user_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_personal_info_resume_id ON public.personal_info(resume_id);
CREATE INDEX idx_work_experience_resume_id ON public.work_experience(resume_id);
CREATE INDEX idx_education_resume_id ON public.education(resume_id);
CREATE INDEX idx_skills_resume_id ON public.skills(resume_id);
CREATE INDEX idx_certifications_resume_id ON public.certifications(resume_id);
CREATE INDEX idx_projects_resume_id ON public.projects(resume_id);
CREATE INDEX idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX idx_file_uploads_resume_id ON public.file_uploads(resume_id);

-- Create trigger for updating updated_at on resumes
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_personal_info_updated_at
  BEFORE UPDATE ON public.personal_info
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_work_experience_updated_at
  BEFORE UPDATE ON public.work_experience
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']),
  ('certificates', 'certificates', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']),
  ('project-images', 'project-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);

-- Storage policies for profile-photos bucket
CREATE POLICY "Users can view all profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for certificates bucket
CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own certificates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own certificates"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificates' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for project-images bucket
CREATE POLICY "Users can view all project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Users can upload their own project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);