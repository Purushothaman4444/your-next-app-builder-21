# Resume Generator - Database Schema

## Overview
Complete database schema for the Resume Generator application with RLS policies and storage buckets.

## Tables

### profiles
User profile information (created in Phase 4)
- `id` (UUID, PK) - References auth.users
- `email` (TEXT)
- `display_name` (TEXT)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### resumes
Main resume records
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `title` (TEXT)
- `template_id` (TEXT) - Default: 'professional'
- `created_at`, `updated_at`, `last_accessed_at` (TIMESTAMP)

### personal_info
One-to-one relationship with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes, UNIQUE)
- `first_name`, `last_name`, `email`, `phone` (TEXT)
- `address`, `linkedin_url` (TEXT)
- `professional_summary` (TEXT)
- `photo_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### work_experience
One-to-many with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes)
- `job_title`, `company`, `location` (TEXT)
- `start_date`, `end_date` (DATE)
- `is_current` (BOOLEAN)
- `description` (TEXT)
- `display_order` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### education
One-to-many with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes)
- `school`, `degree`, `field_of_study` (TEXT)
- `graduation_date` (DATE)
- `gpa`, `relevant_coursework` (TEXT)
- `display_order` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### skills
One-to-many with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes)
- `skill_name` (TEXT)
- `category` (TEXT) - 'technical', 'soft', 'languages'
- `proficiency_level` (INTEGER) - 0-100
- `display_order` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### certifications
One-to-many with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes)
- `certification_name`, `issuing_organization` (TEXT)
- `date_earned`, `expiration_date` (DATE)
- `credential_id`, `certificate_url` (TEXT)
- `is_verified` (BOOLEAN)
- `display_order` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### projects
One-to-many with resumes
- `id` (UUID, PK)
- `resume_id` (UUID, FK → resumes)
- `project_name`, `description`, `role`, `duration` (TEXT)
- `technologies` (TEXT[]) - Array
- `live_url`, `github_url`, `image_url` (TEXT)
- `display_order` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### file_uploads
Track uploaded files
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `resume_id` (UUID, FK → resumes, nullable)
- `file_name`, `file_path` (TEXT)
- `file_type` (TEXT) - 'photo', 'certificate', 'project_image'
- `file_size` (INTEGER)
- `mime_type` (TEXT)
- `created_at` (TIMESTAMP)

## Storage Buckets

### profile-photos
- **Public**: Yes
- **Max Size**: 5MB
- **Allowed Types**: image/jpeg, image/png, image/jpg, image/webp
- **Path Structure**: `{user_id}/{filename}`

### certificates
- **Public**: No (private)
- **Max Size**: 10MB
- **Allowed Types**: application/pdf, image/jpeg, image/png, image/jpg
- **Path Structure**: `{user_id}/{filename}`

### project-images
- **Public**: Yes
- **Max Size**: 5MB
- **Allowed Types**: image/jpeg, image/png, image/jpg, image/webp
- **Path Structure**: `{user_id}/{filename}`

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only view/edit their own data
- Access is controlled via `auth.uid()` and relationships to `user_id`
- Storage buckets enforce user-based access control

## Custom Hooks

### useResumes()
Manage resume CRUD operations
- `resumes` - List of user's resumes
- `createResume(title)` - Create new resume
- `updateResume({id, updates})` - Update resume
- `deleteResume(id)` - Delete resume
- `duplicateResume(id)` - Duplicate existing resume

### useResumeData(resumeId)
Access all sections of a resume
- `personalInfo`, `workExperience`, `education`, `skills`, `certifications`, `projects`
- `mutations` - Create/update/delete operations for each section

### useFileUpload()
Handle file uploads
- `uploadFile(file, bucket, resumeId?)` - Upload to storage
- `deleteFile(filePath, bucket)` - Remove from storage
- `uploading`, `progress` - Upload state

### useRealtimeResumes()
Real-time updates for resume changes
- Automatically invalidates queries when data changes
- Works across multiple tabs/devices

## Indexes

Performance indexes on foreign keys:
- `idx_resumes_user_id`
- `idx_personal_info_resume_id`
- `idx_work_experience_resume_id`
- `idx_education_resume_id`
- `idx_skills_resume_id`
- `idx_certifications_resume_id`
- `idx_projects_resume_id`
- `idx_file_uploads_user_id`
- `idx_file_uploads_resume_id`

## Triggers

Automatic `updated_at` timestamp updates on:
- resumes
- personal_info
- work_experience
- education
- skills
- certifications
- projects

## Usage Example

```typescript
import { useResumes } from "@/hooks/useResumes";
import { useResumeData } from "@/hooks/useResumeData";
import { useFileUpload } from "@/hooks/useFileUpload";

function MyComponent() {
  const { resumes, createResume, deleteResume } = useResumes();
  const { personalInfo, mutations } = useResumeData(resumeId);
  const { uploadFile } = useFileUpload();

  // Create a new resume
  createResume("My Resume");

  // Update personal info
  mutations.personalInfo.update({
    id: personalInfo.id,
    updates: { first_name: "John" }
  });

  // Upload a photo
  uploadFile(file, "profile-photos", resumeId);
}
```
