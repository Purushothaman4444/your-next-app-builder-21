# Testing Guide - Resume Generator

## Overview

This guide provides comprehensive testing instructions for the Resume Generator application. Follow these test cases to ensure all functionality works correctly before deployment.

## Test Environment Setup

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, or Edge)
- Valid email address for testing
- Test files ready:
  - Profile photo (JPEG/PNG, < 5MB)
  - Certificate PDF (< 10MB)
  - Project image (JPEG/PNG, < 5MB)

### Test User Accounts
Create at least 2 test accounts to verify:
- User isolation (users can only see their own data)
- Multi-user scenarios
- Concurrent editing

## 1. Authentication Testing

### 1.1 User Registration
**Steps:**
1. Navigate to `/signup`
2. Enter valid email and password (min 6 characters)
3. Click "Sign Up"
4. Check email for verification

**Expected Results:**
- User redirected to dashboard after signup
- Email verification sent
- Profile automatically created
- Welcome message displayed

**Edge Cases:**
- Invalid email format → Show error
- Weak password → Show strength indicator
- Already registered email → Show appropriate error
- Network timeout → Show retry option

### 1.2 User Login
**Steps:**
1. Navigate to `/login`
2. Enter credentials
3. Click "Login"

**Expected Results:**
- User redirected to dashboard
- Session persisted across page refreshes
- User data loaded correctly

**Edge Cases:**
- Wrong password → Show error
- Unverified email → Show verification prompt
- Non-existent user → Show error

### 1.3 Logout
**Steps:**
1. Click user menu
2. Select "Logout"

**Expected Results:**
- User redirected to home page
- Session cleared
- Protected routes inaccessible
- Local data cleared

## 2. Resume Creation Testing

### 2.1 Create New Resume
**Steps:**
1. Click "Create New Resume" from dashboard
2. Enter resume title
3. Confirm creation

**Expected Results:**
- New resume created with unique ID
- User redirected to resume builder
- Resume appears in "My Resumes" list
- Initial data structure created

### 2.2 Personal Information Section

**Test Case: Basic Information**
**Steps:**
1. Fill in first name, last name
2. Enter email and phone
3. Add address (optional)
4. Add LinkedIn URL (optional)
5. Write professional summary
6. Click "Save & Continue"

**Expected Results:**
- Data saved to database
- Real-time validation on fields
- Preview updates immediately
- Progress indicator advances

**Test Case: Photo Upload**
**Steps:**
1. Click "Upload Photo"
2. Select valid image file (< 5MB)
3. Wait for upload
4. Preview photo

**Expected Results:**
- File uploaded to profile-photos bucket
- Photo URL stored in database
- Thumbnail preview shown
- File size validated
- Image optimized for display

**Negative Tests:**
- File too large → Show size error
- Invalid file type → Show format error
- Network error → Show retry option

### 2.3 Work Experience Section

**Test Case: Add Experience**
**Steps:**
1. Click "Add Work Experience"
2. Fill in job title, company
3. Set start and end dates
4. Check "Currently working here" for current role
5. Write job description
6. Click "Save"

**Expected Results:**
- Entry saved with correct order
- Dates validated (end date after start date)
- Current position shows "Present" for end date
- Entry appears in preview

**Test Case: Multiple Entries**
**Steps:**
1. Add 3+ work experience entries
2. Drag and drop to reorder
3. Edit existing entry
4. Delete one entry

**Expected Results:**
- Multiple entries displayed in order
- Drag-and-drop updates display_order
- Edits saved correctly
- Deletion removes entry and updates order

**Negative Tests:**
- End date before start date → Show validation error
- Empty required fields → Prevent save
- Very long descriptions → Handle gracefully

### 2.4 Education Section

**Test Case: Add Education**
**Steps:**
1. Click "Add Education"
2. Fill in school, degree, field of study
3. Set graduation date
4. Add GPA (optional)
5. Add relevant coursework (optional)
6. Click "Save"

**Expected Results:**
- Education entry saved
- Date validation working
- Multiple degrees supported
- Reordering works

### 2.5 Skills Section

**Test Case: Add Skills**
**Steps:**
1. Select skill category (Technical/Soft/Languages)
2. Enter skill name
3. Set proficiency level (0-100)
4. Click "Add Skill"
5. Add multiple skills across categories

**Expected Results:**
- Skills categorized correctly
- Proficiency level visual indicator shown
- Auto-suggestions appear (if AI enabled)
- Skills grouped by category in preview

**Test Case: AI Skill Suggestions**
**Steps:**
1. Click "Get AI Suggestions"
2. Provide job role context
3. Review suggested skills
4. Accept or modify suggestions

**Expected Results:**
- AI returns relevant skills
- Skills can be added with one click
- Rate limiting handled gracefully
- Loading state shown during API call

### 2.6 Certifications Section

**Test Case: Add Certification**
**Steps:**
1. Click "Add Certification"
2. Fill in certification name
3. Enter issuing organization
4. Set earned date and expiration date
5. Upload certificate document
6. Click "Save"

**Expected Results:**
- Certification saved
- Document uploaded to certificates bucket
- Document marked as private (RLS enforced)
- Verification status indicator shown

**Test Case: Document Upload**
**Steps:**
1. Upload PDF certificate (< 10MB)
2. Verify file appears in storage
3. Attempt to access from different user account

**Expected Results:**
- File uploaded successfully
- Only owner can access file
- File URL stored securely
- Download works correctly

**Negative Tests:**
- File too large → Show size error
- Non-PDF/image → Show format error
- Missing required fields → Prevent save

### 2.7 Projects Section

**Test Case: Add Project**
**Steps:**
1. Click "Add Project"
2. Enter project name and description
3. Add technologies used (array)
4. Upload project image
5. Add live URL and GitHub URL
6. Set role and duration
7. Click "Save"

**Expected Results:**
- Project saved with all details
- Image uploaded to project-images bucket
- URLs validated for correct format
- Technologies stored as array
- Project appears in preview

**Test Case: Multiple Projects**
**Steps:**
1. Add 3+ projects
2. Reorder using drag-and-drop
3. Edit existing project
4. Delete one project

**Expected Results:**
- All projects display correctly
- Reordering updates display_order
- Edits save without issues
- Deletion works properly

## 3. Resume Management Testing

### 3.1 View All Resumes
**Steps:**
1. Navigate to "My Resumes"
2. View resume list

**Expected Results:**
- All user's resumes displayed
- Resumes sorted by last updated
- Resume cards show title and preview
- Actions menu available

### 3.2 Edit Resume
**Steps:**
1. Click "Edit" on a resume
2. Make changes to any section
3. Save changes

**Expected Results:**
- User redirected to builder
- Existing data loaded
- Changes saved correctly
- updated_at timestamp updated

### 3.3 Duplicate Resume
**Steps:**
1. Click "Duplicate" on a resume
2. Confirm duplication

**Expected Results:**
- New resume created with same data
- New unique ID assigned
- Title includes "Copy of" prefix
- All sections duplicated
- Files referenced (not duplicated)

### 3.4 Delete Resume
**Steps:**
1. Click "Delete" on a resume
2. Confirm deletion

**Expected Results:**
- Resume removed from database
- Related data cascaded (personal_info, work_experience, etc.)
- File references removed
- User redirected to resume list
- Deletion cannot be undone (show warning)

## 4. Preview & Export Testing

### 4.1 Real-time Preview
**Steps:**
1. Make changes in any section
2. Observe preview panel

**Expected Results:**
- Preview updates immediately
- Changes reflect current data
- No page refresh needed
- Preview scrolls to edited section

### 4.2 Template Selection
**Steps:**
1. Navigate to preview page
2. Select different template
3. Observe changes

**Expected Results:**
- Template applied to preview
- Data formatted correctly
- Template choice saved
- Print preview matches selected template

### 4.3 PDF Export
**Steps:**
1. Click "Export as PDF"
2. Wait for generation
3. Download PDF
4. Open and verify

**Expected Results:**
- PDF generated with correct template
- All sections included
- Formatting preserved
- Links clickable (if supported)
- File named appropriately

**Test Across Templates:**
- Professional template
- Creative template (if available)
- Simple template (if available)

### 4.4 Print Resume
**Steps:**
1. Click "Print"
2. Use browser print dialog
3. Preview print layout

**Expected Results:**
- Print-optimized CSS applied
- Page breaks appropriate
- Colors preserved
- No UI elements in print

## 5. File Upload Testing

### 5.1 Profile Photo Upload
**Test Cases:**
- Valid JPEG (2MB) → Success
- Valid PNG (4MB) → Success
- File too large (6MB) → Error
- Invalid type (.txt) → Error
- Very small image (10KB) → Success
- Corrupt image → Error

### 5.2 Certificate Upload
**Test Cases:**
- Valid PDF (5MB) → Success
- Valid JPEG certificate scan → Success
- File too large (12MB) → Error
- Invalid type (.docx) → Error
- Password-protected PDF → Test behavior

### 5.3 Project Image Upload
**Test Cases:**
- Valid JPEG (3MB) → Success
- Valid PNG (2MB) → Success
- Valid WebP → Success
- Animated GIF → Test behavior
- File too large (6MB) → Error
- Invalid type (.svg) → Error

### 5.4 Storage Security
**Steps:**
1. Upload file as User A
2. Note the file URL
3. Logout and login as User B
4. Attempt to access User A's file URL

**Expected Results:**
- Profile photos (public bucket) → Accessible
- Certificates (private bucket) → Access denied for User B
- Project images (public bucket) → Accessible
- RLS policies enforced

## 6. AI Features Testing

### 6.1 Professional Summary Suggestion
**Steps:**
1. Navigate to Personal Info section
2. Click "Get AI Suggestion"
3. Provide job title and experience context
4. Review suggestion

**Expected Results:**
- AI returns relevant summary
- Suggestion can be edited before accepting
- Rate limiting handled
- Error handling for API failures

### 6.2 Job Description Enhancement
**Steps:**
1. Add work experience entry
2. Write basic description
3. Click "Enhance with AI"
4. Review enhanced version

**Expected Results:**
- Description improved with better wording
- Key achievements highlighted
- Action verbs suggested
- ATS-friendly format

### 6.3 Skill Recommendations
**Steps:**
1. Navigate to Skills section
2. Provide job role context
3. Click "Get Skill Suggestions"
4. Review suggested skills

**Expected Results:**
- Relevant skills for role suggested
- Skills categorized appropriately
- Can add skills individually or all at once
- Existing skills not duplicated

### 6.4 Resume Optimization
**Steps:**
1. Complete resume with all sections
2. Click "Optimize Resume"
3. Review optimization suggestions

**Expected Results:**
- Actionable improvement suggestions
- ATS compatibility tips
- Keyword recommendations
- Formatting suggestions

### 6.5 Rate Limiting
**Steps:**
1. Make 5+ rapid AI requests
2. Observe behavior

**Expected Results:**
- Rate limit message after threshold
- Countdown timer before next request
- Graceful error handling
- User not blocked permanently

## 7. PWA Testing

### 7.1 Installation
**Steps (Mobile):**
1. Open app in browser
2. Look for install prompt
3. Click "Install"
4. Verify app icon on home screen

**Steps (Desktop):**
1. Open app in Chrome
2. Look for install icon in address bar
3. Click "Install"
4. Verify standalone window opens

**Expected Results:**
- Install prompt appears
- App installs successfully
- Icon and splash screen correct
- Standalone mode works

### 7.2 Offline Functionality
**Steps:**
1. Load app while online
2. Enable airplane mode or disconnect network
3. Navigate between pages
4. Try to edit resume
5. Make changes
6. Reconnect network

**Expected Results:**
- App loads from cache
- Basic navigation works offline
- Offline indicator shown
- Changes queued for sync
- Sync occurs when back online
- No data loss

### 7.3 Background Sync
**Steps:**
1. Make changes while online
2. Quickly go offline
3. Wait for sync to queue
4. Come back online

**Expected Results:**
- Changes saved locally
- Sync queue indicator shown
- Automatic sync when online
- Success notification shown

### 7.4 Push Notifications (if implemented)
**Steps:**
1. Grant notification permission
2. Trigger notification event
3. Verify notification appears

**Expected Results:**
- Permission requested once
- Notifications appear correctly
- Click opens relevant page
- Can be disabled in settings

## 8. Performance Testing

### 8.1 Load Time
**Metrics to Check:**
- Initial page load < 3 seconds
- Time to interactive < 5 seconds
- First contentful paint < 1.5 seconds
- Largest contentful paint < 2.5 seconds

**Tools:**
- Chrome DevTools Lighthouse
- WebPageTest.org
- GTmetrix

### 8.2 Bundle Size
**Check:**
- Main bundle < 500KB (gzipped)
- Vendor bundles properly split
- Lazy loading working
- Unused code eliminated

### 8.3 Database Query Performance
**Test:**
- Loading resume list
- Loading single resume with all sections
- Searching/filtering resumes
- Real-time subscription updates

**Expected:**
- Queries complete < 500ms
- No N+1 query problems
- Proper indexing utilized
- Pagination for large lists

## 9. Security Testing

### 9.1 Authentication Security
**Tests:**
- Cannot access protected routes without login
- Session expires after timeout
- Logout clears all session data
- Password requirements enforced
- Cannot register with weak password

### 9.2 Authorization Testing
**Tests:**
- User A cannot access User B's resumes
- User A cannot modify User B's data
- User A cannot delete User B's files
- API endpoints enforce user ownership
- RLS policies properly enforced

### 9.3 Input Validation
**Tests:**
- XSS attempt in text fields → Sanitized
- SQL injection attempt → Blocked by RLS
- File upload bypass → Validated
- URL validation → Properly checked
- Large input handling → Limited appropriately

### 9.4 Storage Security
**Tests:**
- Private files not accessible without auth
- Public files accessible as expected
- File upload size limits enforced
- File type restrictions enforced
- Malicious file upload → Rejected

## 10. Cross-Browser Testing

### Required Browsers

#### Desktop
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

#### Mobile
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)
- ✅ Samsung Internet

### Key Areas to Test
1. Layout and responsive design
2. Form interactions
3. File uploads
4. PDF generation/print
5. PWA installation
6. Offline functionality
7. Service worker registration

## 11. Accessibility Testing

### Keyboard Navigation
**Tests:**
- All interactive elements reachable via Tab
- Form inputs navigable
- Buttons activatable with Enter/Space
- No keyboard traps
- Focus indicators visible
- Skip navigation links work

### Screen Reader Testing
**Tools:** NVDA (Windows), VoiceOver (Mac/iOS), TalkBack (Android)

**Tests:**
- All images have alt text
- Form labels properly associated
- ARIA labels on dynamic content
- Error messages announced
- Success notifications announced
- Button purposes clear

### Color Contrast
**Requirements:**
- Text contrast ratio ≥ 4.5:1
- Large text contrast ratio ≥ 3:1
- UI component contrast ≥ 3:1
- Focus indicators visible

**Tool:** Chrome DevTools Lighthouse Accessibility audit

### Visual Accessibility
**Tests:**
- Content readable at 200% zoom
- No horizontal scrolling at zoom levels
- Text remains readable with custom colors
- Icons have text alternatives
- Motion can be disabled (if animations present)

## 12. Edge Cases & Error Scenarios

### Network Errors
- Lost connection during save
- Timeout during API call
- Slow 3G connection
- Intermittent connectivity

### Data Edge Cases
- Very long text inputs (10,000+ characters)
- Special characters in all fields
- Empty resume (no sections filled)
- Resume with 50+ work experiences
- 1000+ skills added

### Concurrency
- Edit same resume on two devices simultaneously
- Delete resume while editing on another device
- Upload same file twice quickly
- Multiple rapid API calls

### Browser Storage
- Local storage full
- Cookies disabled
- Session storage cleared
- IndexedDB errors

## 13. Regression Testing

After each deployment, verify:
- [ ] Login still works
- [ ] Resume creation works
- [ ] File uploads work
- [ ] PDF export works
- [ ] AI features work
- [ ] Real-time sync works
- [ ] Offline mode works

## Test Reporting

### Bug Report Template
```
**Title:** Brief description
**Severity:** Critical / High / Medium / Low
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. ...

**Expected Result:** What should happen
**Actual Result:** What actually happened
**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- Network: WiFi

**Screenshots/Video:** [Attach if available]
**Console Errors:** [Paste relevant logs]
```

### Test Results Template
```
**Test Date:** YYYY-MM-DD
**Tester:** Name
**Build Version:** vX.X.X
**Environment:** Production / Staging

| Test Case | Status | Notes |
|-----------|--------|-------|
| User Registration | ✅ Pass | |
| Resume Creation | ✅ Pass | |
| PDF Export | ❌ Fail | Issue #123 |
```

## Automated Testing (Future)

### Recommended Tools
- **E2E Testing:** Playwright or Cypress
- **Unit Testing:** Vitest
- **Component Testing:** React Testing Library
- **API Testing:** Postman / Insomnia
- **Load Testing:** k6 or Artillery

### Priority Test Cases for Automation
1. User authentication flow
2. Resume CRUD operations
3. File upload and validation
4. PDF generation
5. API endpoint security
6. Database RLS policies

---

**Last Updated:** Phase 8 Completion
**Next Review:** Before each major deployment
**Contact:** Development Team