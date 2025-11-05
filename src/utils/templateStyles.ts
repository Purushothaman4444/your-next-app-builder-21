import { Template } from "@/constants/templates";

export interface TemplateStyles {
  container: string;
  header: {
    wrapper: string;
    name: string;
    contact: string;
  };
  section: {
    title: string;
    content: string;
  };
  entry: {
    wrapper: string;
    title: string;
    subtitle: string;
    date: string;
  };
  skill: {
    wrapper: string;
    badge: string;
  };
}

export const getTemplateStyles = (templateId: string): TemplateStyles => {
  // Professional Templates
  if (templateId.startsWith('professional')) {
    return {
      container: "space-y-6",
      header: {
        wrapper: "text-center border-b-2 border-blue-900 pb-6",
        name: "text-4xl font-bold mb-2 text-blue-900",
        contact: "flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600"
      },
      section: {
        title: "text-xl font-bold mb-3 text-blue-900 border-b border-gray-300 pb-2",
        content: "space-y-4"
      },
      entry: {
        wrapper: "mb-4",
        title: "font-semibold text-gray-900 text-base",
        subtitle: "text-sm text-gray-600",
        date: "text-sm text-gray-600"
      },
      skill: {
        wrapper: "flex flex-wrap gap-2",
        badge: "px-3 py-1 bg-blue-100 text-blue-900 rounded-md text-sm font-medium"
      }
    };
  }

  // Modern Templates
  if (templateId.startsWith('modern')) {
    return {
      container: "space-y-8",
      header: {
        wrapper: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl -m-8 mb-8",
        name: "text-5xl font-bold mb-3 tracking-tight",
        contact: "flex flex-wrap gap-4 mt-3 text-sm opacity-90"
      },
      section: {
        title: "text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600",
        content: "space-y-5"
      },
      entry: {
        wrapper: "mb-5 pl-4 border-l-4 border-purple-400",
        title: "font-bold text-gray-900 text-lg",
        subtitle: "text-sm text-gray-600 mt-1",
        date: "text-sm text-purple-600 font-medium"
      },
      skill: {
        wrapper: "flex flex-wrap gap-3",
        badge: "px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-semibold shadow-md"
      }
    };
  }

  // Simple Templates
  if (templateId.startsWith('simple')) {
    return {
      container: "space-y-6",
      header: {
        wrapper: "pb-4 border-b border-gray-400",
        name: "text-3xl font-semibold mb-2 text-gray-900",
        contact: "flex flex-wrap gap-3 mt-2 text-sm text-gray-700"
      },
      section: {
        title: "text-lg font-semibold mb-3 text-gray-900 uppercase tracking-wide",
        content: "space-y-3"
      },
      entry: {
        wrapper: "mb-3",
        title: "font-medium text-gray-900",
        subtitle: "text-sm text-gray-600",
        date: "text-sm text-gray-500"
      },
      skill: {
        wrapper: "flex flex-wrap gap-2",
        badge: "px-2 py-1 border border-gray-400 text-gray-800 rounded text-sm"
      }
    };
  }

  // Creative Templates
  if (templateId.startsWith('creative')) {
    return {
      container: "space-y-8",
      header: {
        wrapper: "text-center pb-6 border-b-4 border-orange-500",
        name: "text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500",
        contact: "flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-700"
      },
      section: {
        title: "text-2xl font-bold mb-4 text-orange-600 relative before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-12 before:h-1 before:bg-pink-500 pb-2",
        content: "space-y-5"
      },
      entry: {
        wrapper: "mb-5 bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg",
        title: "font-bold text-gray-900 text-lg",
        subtitle: "text-sm text-gray-600 mt-1",
        date: "text-sm text-orange-600 font-semibold"
      },
      skill: {
        wrapper: "flex flex-wrap gap-3",
        badge: "px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-lg text-sm font-bold shadow-lg transform hover:scale-105 transition-transform"
      }
    };
  }

  // Executive Templates
  if (templateId.startsWith('executive')) {
    return {
      container: "space-y-7",
      header: {
        wrapper: "border-b-4 border-amber-700 pb-6 bg-gradient-to-r from-amber-50 to-slate-50 -m-8 p-8 mb-8",
        name: "text-4xl font-serif font-bold mb-3 text-slate-900 tracking-wide",
        contact: "flex flex-wrap gap-4 mt-3 text-sm text-slate-600"
      },
      section: {
        title: "text-xl font-serif font-bold mb-4 text-amber-900 uppercase tracking-widest border-b-2 border-amber-300 pb-2",
        content: "space-y-5"
      },
      entry: {
        wrapper: "mb-5",
        title: "font-serif font-bold text-slate-900 text-lg",
        subtitle: "text-sm text-slate-600 mt-1",
        date: "text-sm text-amber-700 font-medium"
      },
      skill: {
        wrapper: "flex flex-wrap gap-3",
        badge: "px-4 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-sm font-semibold"
      }
    };
  }

  // Default to professional style
  return getTemplateStyles('professional-classic');
};

export const getTemplatePDFStyles = (templateId: string): string => {
  // Professional Templates
  if (templateId.startsWith('professional')) {
    return `
      .header { text-align: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 12pt; margin-bottom: 16pt; }
      .header h1 { font-size: 24pt; color: #1E3A8A; margin-bottom: 6pt; }
      .section-title { font-size: 14pt; font-weight: bold; color: #1E3A8A; border-bottom: 1px solid #ddd; padding-bottom: 4pt; margin-bottom: 8pt; }
      .skill-item { background: #DBEAFE; color: #1E3A8A; padding: 4pt 8pt; border-radius: 4pt; display: inline-block; margin: 2pt; }
    `;
  }

  // Modern Templates
  if (templateId.startsWith('modern')) {
    return `
      .header { background: linear-gradient(135deg, #9333EA 0%, #4F46E5 100%); color: white; padding: 20pt; margin: -0.5in -0.5in 16pt -0.5in; }
      .header h1 { font-size: 28pt; font-weight: bold; margin-bottom: 8pt; }
      .section-title { font-size: 16pt; font-weight: bold; color: #9333EA; margin-bottom: 10pt; }
      .entry { border-left: 3pt solid #9333EA; padding-left: 8pt; margin-bottom: 10pt; }
      .skill-item { background: linear-gradient(135deg, #9333EA 0%, #4F46E5 100%); color: white; padding: 6pt 12pt; border-radius: 12pt; display: inline-block; margin: 3pt; font-weight: 600; }
    `;
  }

  // Simple Templates
  if (templateId.startsWith('simple')) {
    return `
      .header { border-bottom: 1px solid #666; padding-bottom: 12pt; margin-bottom: 16pt; }
      .header h1 { font-size: 22pt; color: #111; margin-bottom: 6pt; }
      .section-title { font-size: 13pt; font-weight: 600; color: #111; text-transform: uppercase; letter-spacing: 1pt; margin-bottom: 8pt; }
      .skill-item { border: 1pt solid #666; color: #333; padding: 4pt 8pt; border-radius: 2pt; display: inline-block; margin: 2pt; }
    `;
  }

  // Creative Templates
  if (templateId.startsWith('creative')) {
    return `
      .header { text-align: center; border-bottom: 4pt solid #F97316; padding-bottom: 12pt; margin-bottom: 16pt; }
      .header h1 { font-size: 28pt; font-weight: 800; color: #F97316; margin-bottom: 6pt; }
      .section-title { font-size: 16pt; font-weight: bold; color: #F97316; border-bottom: 2pt solid #EC4899; padding-bottom: 4pt; margin-bottom: 10pt; }
      .entry { background: #FFF7ED; padding: 10pt; border-radius: 6pt; margin-bottom: 10pt; }
      .skill-item { background: linear-gradient(135deg, #FB923C 0%, #F472B6 100%); color: white; padding: 6pt 12pt; border-radius: 6pt; display: inline-block; margin: 3pt; font-weight: 700; }
    `;
  }

  // Executive Templates
  if (templateId.startsWith('executive')) {
    return `
      .header { border-bottom: 3pt solid #92400E; padding-bottom: 12pt; margin-bottom: 16pt; background: #FFFBEB; padding: 16pt; margin: -0.5in -0.5in 16pt -0.5in; }
      .header h1 { font-size: 24pt; font-family: Georgia, serif; font-weight: bold; color: #1E293B; margin-bottom: 8pt; letter-spacing: 1pt; }
      .section-title { font-size: 14pt; font-family: Georgia, serif; font-weight: bold; color: #92400E; text-transform: uppercase; letter-spacing: 2pt; border-bottom: 2pt solid #FCD34D; padding-bottom: 4pt; margin-bottom: 10pt; }
      .skill-item { background: #FEF3C7; color: #92400E; border: 1pt solid #FCD34D; padding: 6pt 12pt; border-radius: 4pt; display: inline-block; margin: 3pt; font-weight: 600; }
    `;
  }

  // Default to professional
  return getTemplatePDFStyles('professional-classic');
};
