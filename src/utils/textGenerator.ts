interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedinUrl?: string;
  professionalSummary?: string;
}

interface WorkExperience {
  jobTitle: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  graduationDate?: string;
  gpa?: string;
}

interface Skill {
  skillName: string;
  category: string;
  proficiencyLevel?: number;
}

interface Certification {
  certificationName: string;
  issuingOrganization: string;
  dateEarned?: string;
}

interface Project {
  projectName: string;
  description?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
}

export const generateResumeText = (data: ResumeData): string => {
  const { personalInfo, workExperience, education, skills, certifications, projects } = data;
  
  let text = '';

  // Header
  text += `${personalInfo.firstName} ${personalInfo.lastName}\n`;
  text += '='.repeat(`${personalInfo.firstName} ${personalInfo.lastName}`.length) + '\n\n';
  
  // Contact Information
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.address,
    personalInfo.linkedinUrl,
  ].filter(Boolean);
  
  text += contactInfo.join(' | ') + '\n\n';

  // Professional Summary
  if (personalInfo.professionalSummary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '-'.repeat(20) + '\n';
    text += personalInfo.professionalSummary + '\n\n';
  }

  // Work Experience
  if (workExperience.length > 0) {
    text += 'WORK EXPERIENCE\n';
    text += '-'.repeat(20) + '\n';
    
    workExperience.forEach((exp) => {
      text += `\n${exp.jobTitle}\n`;
      text += `${exp.company}${exp.location ? ` - ${exp.location}` : ''}\n`;
      const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      const endDate = exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      text += `${startDate} - ${endDate}\n`;
      if (exp.description) {
        text += `\n${exp.description}\n`;
      }
    });
    text += '\n';
  }

  // Education
  if (education.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(20) + '\n';
    
    education.forEach((edu) => {
      text += `\n${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}\n`;
      text += `${edu.school}\n`;
      if (edu.graduationDate) {
        text += `${new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}\n`;
      }
      if (edu.gpa) {
        text += `GPA: ${edu.gpa}\n`;
      }
    });
    text += '\n';
  }

  // Skills
  if (skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(20) + '\n';
    text += skills.map(s => s.skillName).join(', ') + '\n\n';
  }

  // Certifications
  if (certifications.length > 0) {
    text += 'CERTIFICATIONS\n';
    text += '-'.repeat(20) + '\n';
    
    certifications.forEach((cert) => {
      text += `\n${cert.certificationName}\n`;
      text += `${cert.issuingOrganization}`;
      if (cert.dateEarned) {
        text += ` - ${new Date(cert.dateEarned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      }
      text += '\n';
    });
    text += '\n';
  }

  // Projects
  if (projects.length > 0) {
    text += 'PROJECTS\n';
    text += '-'.repeat(20) + '\n';
    
    projects.forEach((proj) => {
      text += `\n${proj.projectName}\n`;
      if (proj.description) {
        text += `${proj.description}\n`;
      }
      if (proj.technologies && proj.technologies.length > 0) {
        text += `Technologies: ${proj.technologies.join(', ')}\n`;
      }
      const links = [];
      if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
      if (proj.githubUrl) links.push(`GitHub: ${proj.githubUrl}`);
      if (links.length > 0) {
        text += links.join(' | ') + '\n';
      }
    });
  }

  return text;
};

export const downloadResumeAsText = (data: ResumeData, fileName: string = "resume") => {
  const text = generateResumeText(data);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
