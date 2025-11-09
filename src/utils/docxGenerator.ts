import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from "docx";

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

export const generateResumeDocx = async (data: ResumeData): Promise<Blob> => {
  const { personalInfo, workExperience, education, skills, certifications, projects } = data;

  const children: Paragraph[] = [];

  // Header - Name and Contact
  children.push(
    new Paragraph({
      text: `${personalInfo.firstName} ${personalInfo.lastName}`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.address,
    personalInfo.linkedinUrl,
  ].filter(Boolean).join(" | ");

  children.push(
    new Paragraph({
      text: contactInfo,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Professional Summary
  if (personalInfo.professionalSummary) {
    children.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: personalInfo.professionalSummary,
        spacing: { after: 200 },
      })
    );
  }

  // Work Experience
  if (workExperience.length > 0) {
    children.push(
      new Paragraph({
        text: "Work Experience",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    workExperience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: exp.company + (exp.location ? ` - ${exp.location}` : ''),
        }),
        new Paragraph({
          text: `${exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}`,
          spacing: { after: 50 },
        })
      );

      if (exp.description) {
        children.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Education
  if (education.length > 0) {
    children.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`, bold: true }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: edu.school,
        }),
        new Paragraph({
          text: edu.graduationDate ? new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
          spacing: { after: edu.gpa ? 0 : 100 },
        })
      );

      if (edu.gpa) {
        children.push(
          new Paragraph({
            text: `GPA: ${edu.gpa}`,
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Skills
  if (skills.length > 0) {
    children.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        text: skills.map(s => s.skillName).join(", "),
        spacing: { after: 200 },
      })
    );
  }

  // Certifications
  if (certifications.length > 0) {
    children.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.certificationName, bold: true }),
          ],
          spacing: { before: 100 },
        }),
        new Paragraph({
          text: `${cert.issuingOrganization}${cert.dateEarned ? ` - ${new Date(cert.dateEarned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}`,
          spacing: { after: 100 },
        })
      );
    });
  }

  // Projects
  if (projects.length > 0) {
    children.push(
      new Paragraph({
        text: "Projects",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.projectName, bold: true }),
          ],
          spacing: { before: 100 },
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            text: proj.description,
          })
        );
      }

      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            text: `Technologies: ${proj.technologies.join(', ')}`,
          })
        );
      }

      const links = [];
      if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
      if (proj.githubUrl) links.push(`GitHub: ${proj.githubUrl}`);
      
      if (links.length > 0) {
        children.push(
          new Paragraph({
            text: links.join(' | '),
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};

export const downloadResumeAsDocx = async (data: ResumeData, fileName: string = "resume") => {
  const blob = await generateResumeDocx(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
