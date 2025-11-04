export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  fontFamily: string;
}

export const TEMPLATE_CATEGORIES = [
  "All",
  "Professional",
  "Modern",
  "Simple",
  "Creative",
  "Executive",
];

export const TEMPLATES: Template[] = [
  // Professional Templates
  {
    id: "professional-classic",
    name: "Classic Professional",
    category: "Professional",
    description: "Clean and ATS-friendly design for corporate roles",
    color: "blue",
    fontFamily: "system-ui",
  },
  {
    id: "professional-formal",
    name: "Formal Professional",
    category: "Professional",
    description: "Traditional layout perfect for conservative industries",
    color: "navy",
    fontFamily: "serif",
  },
  {
    id: "professional-tech",
    name: "Tech Professional",
    category: "Professional",
    description: "Technical layout for IT and engineering roles",
    color: "slate",
    fontFamily: "monospace",
  },
  
  // Modern Templates
  {
    id: "modern-bold",
    name: "Bold Modern",
    category: "Modern",
    description: "Contemporary design with bold typography",
    color: "purple",
    fontFamily: "sans-serif",
  },
  {
    id: "modern-minimal",
    name: "Minimal Modern",
    category: "Modern",
    description: "Sleek and modern with plenty of white space",
    color: "teal",
    fontFamily: "system-ui",
  },
  {
    id: "modern-gradient",
    name: "Gradient Modern",
    category: "Modern",
    description: "Eye-catching with subtle gradient accents",
    color: "indigo",
    fontFamily: "sans-serif",
  },
  
  // Simple Templates
  {
    id: "simple-clean",
    name: "Clean Simple",
    category: "Simple",
    description: "Minimalist layout focusing on content",
    color: "gray",
    fontFamily: "system-ui",
  },
  {
    id: "simple-classic",
    name: "Classic Simple",
    category: "Simple",
    description: "No-frills design that highlights your experience",
    color: "black",
    fontFamily: "serif",
  },
  {
    id: "simple-elegant",
    name: "Elegant Simple",
    category: "Simple",
    description: "Simple yet sophisticated design",
    color: "charcoal",
    fontFamily: "sans-serif",
  },
  
  // Creative Templates
  {
    id: "creative-vibrant",
    name: "Vibrant Creative",
    category: "Creative",
    description: "Bold colors for creative industries",
    color: "orange",
    fontFamily: "sans-serif",
  },
  {
    id: "creative-artistic",
    name: "Artistic Creative",
    category: "Creative",
    description: "Unique layout for designers and artists",
    color: "pink",
    fontFamily: "display",
  },
  {
    id: "creative-modern",
    name: "Modern Creative",
    category: "Creative",
    description: "Contemporary design with creative flair",
    color: "cyan",
    fontFamily: "sans-serif",
  },
  
  // Executive Templates
  {
    id: "executive-premium",
    name: "Premium Executive",
    category: "Executive",
    description: "Sophisticated design for C-level positions",
    color: "gold",
    fontFamily: "serif",
  },
  {
    id: "executive-elegant",
    name: "Elegant Executive",
    category: "Executive",
    description: "Refined layout for senior leadership",
    color: "burgundy",
    fontFamily: "serif",
  },
  {
    id: "executive-professional",
    name: "Executive Professional",
    category: "Executive",
    description: "Authoritative design for executive roles",
    color: "navy",
    fontFamily: "system-ui",
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === "All") return TEMPLATES;
  return TEMPLATES.filter((template) => template.category === category);
};
