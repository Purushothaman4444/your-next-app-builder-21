// PDF Generation utility using browser's built-in PDF generation
// This creates a print-friendly view that can be saved as PDF
import { getTemplatePDFStyles } from "./templateStyles";

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    linkedinUrl?: string;
    professionalSummary?: string;
    photoUrl?: string;
  };
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy?: string;
    graduationDate?: string;
    gpa?: string;
  }>;
  skills: Array<{
    skillName: string;
    category: string;
    proficiencyLevel: number;
  }>;
  certifications: Array<{
    certificationName: string;
    issuingOrganization: string;
    dateEarned?: string;
  }>;
  projects: Array<{
    projectName: string;
    description?: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
}

export const generatePDFHtml = (data: ResumeData, template: string = "professional-classic"): string => {
  const { personalInfo, workExperience, education, skills, certifications, projects } = data;
  const templateStyles = getTemplatePDFStyles(template);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${personalInfo.firstName} ${personalInfo.lastName} - Resume</title>
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
          }
          
          .contact-info {
            font-size: 10pt;
            color: #666;
          }
          
          .section {
            margin-bottom: 16pt;
            page-break-inside: avoid;
          }
          
          .entry-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4pt;
          }
          
          .entry-title {
            font-weight: bold;
            font-size: 12pt;
          }
          
          .entry-subtitle {
            color: #666;
            font-size: 10pt;
          }
          
          .entry-date {
            color: #666;
            font-size: 10pt;
          }
          
          .description {
            margin-top: 4pt;
            margin-left: 12pt;
          }
          
          ul {
            margin-left: 20pt;
            margin-top: 4pt;
          }
          
          li {
            margin-bottom: 2pt;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          /* Template-specific styles */
          ${templateStyles}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
          <div class="contact-info">
            ${personalInfo.email} | ${personalInfo.phone}
            ${personalInfo.address ? ` | ${personalInfo.address}` : ''}
            ${personalInfo.linkedinUrl ? ` | ${personalInfo.linkedinUrl}` : ''}
          </div>
        </div>

        ${personalInfo.professionalSummary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${personalInfo.professionalSummary}</p>
          </div>
        ` : ''}

        ${workExperience.length > 0 ? `
          <div class="section">
            <div class="section-title">Work Experience</div>
            ${workExperience.map(exp => `
              <div class="entry">
                <div class="entry-header">
                  <div>
                    <div class="entry-title">${exp.jobTitle}</div>
                    <div class="entry-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                  </div>
                  <div class="entry-date">
                    ${exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - 
                    ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                  </div>
                </div>
                ${exp.description ? `<div class="description">${exp.description.split('\n').map(line => `<p>${line}</p>`).join('')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
              <div class="entry">
                <div class="entry-header">
                  <div>
                    <div class="entry-title">${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                    <div class="entry-subtitle">${edu.school}</div>
                  </div>
                  <div class="entry-date">
                    ${edu.graduationDate ? new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                  </div>
                </div>
                ${edu.gpa ? `<p class="description">GPA: ${edu.gpa}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6pt;">
              ${skills.map(skill => `
                <span class="skill-item">${skill.skillName}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${certifications.length > 0 ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certifications.map(cert => `
              <div class="entry">
                <div class="entry-title">${cert.certificationName}</div>
                <div class="entry-subtitle">${cert.issuingOrganization}${cert.dateEarned ? ` - ${new Date(cert.dateEarned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${projects.length > 0 ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
              <div class="entry">
                <div class="entry-title">${project.projectName}</div>
                ${project.description ? `<p class="description">${project.description}</p>` : ''}
                ${project.technologies.length > 0 ? `<p class="entry-subtitle">Technologies: ${project.technologies.join(', ')}</p>` : ''}
                ${project.liveUrl || project.githubUrl ? `
                  <p class="entry-subtitle">
                    ${project.liveUrl ? `<a href="${project.liveUrl}">Live Demo</a>` : ''}
                    ${project.liveUrl && project.githubUrl ? ' | ' : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}">GitHub</a>` : ''}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </body>
    </html>
  `;
};

export const downloadResumeAsPDF = (data: ResumeData, template: string = "professional-classic") => {
  const htmlContent = generatePDFHtml(data, template);
  
  // Create a blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
  
  // Also try to open print dialog for immediate PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    };
  }
};
