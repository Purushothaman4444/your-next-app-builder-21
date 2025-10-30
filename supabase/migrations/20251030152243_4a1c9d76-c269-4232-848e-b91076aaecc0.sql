-- Fix critical RLS policy gaps identified in security audit

-- ============================================
-- PROFILES TABLE - Add Missing INSERT and DELETE Policies
-- ============================================

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- FILE_UPLOADS TABLE - Add Missing UPDATE Policy
-- ============================================

-- Allow users to update their own file uploads
CREATE POLICY "Users can update their own file uploads"
ON public.file_uploads
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- ADDITIONAL SECURITY ENHANCEMENTS
-- ============================================

-- Ensure all resume-related tables have proper UPDATE policies
-- (These should already exist but adding for completeness)

-- Personal Info UPDATE policy (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'personal_info' 
    AND policyname = 'Users can update their own resume personal info'
  ) THEN
    CREATE POLICY "Users can update their own resume personal info"
    ON public.personal_info
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.resumes 
        WHERE resumes.id = personal_info.resume_id 
        AND resumes.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Work Experience UPDATE policy (if missing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'work_experience' 
    AND policyname = 'Users can update their own work experience'
  ) THEN
    CREATE POLICY "Users can update their own work experience"
    ON public.work_experience
    FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.resumes 
        WHERE resumes.id = work_experience.resume_id 
        AND resumes.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Add comment for tracking
COMMENT ON TABLE public.profiles IS 'User profiles with complete RLS policies for CRUD operations';
COMMENT ON TABLE public.file_uploads IS 'File upload tracking with complete RLS policies';