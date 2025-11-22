/**
 * Career to CIP Code Mapping
 * Maps common career titles to their relevant CIP (Classification of Instructional Programs) codes
 * This ensures accurate program recommendations based on career goals
 */

export interface CareerMapping {
  career: string;
  cipCodes: string[];
  keywords: string[];
}

export const CAREER_TO_CIP_MAPPINGS: CareerMapping[] = [
  // Technology & Computer Science Careers
  {
    career: "Web Developer",
    cipCodes: ["11.0101", "11.0201", "11.0701", "11.0801"],
    keywords: ["web", "developer", "software", "programming", "frontend", "backend", "fullstack", "javascript", "html", "css"]
  },
  {
    career: "Software Engineer",
    cipCodes: ["11.0101", "11.0701"],
    keywords: ["software", "engineer", "programming", "developer", "coding", "application", "systems"]
  },
  {
    career: "Data Scientist",
    cipCodes: ["11.0101", "11.0701"],
    keywords: ["data", "scientist", "analytics", "machine learning", "statistics", "python", "analysis"]
  },
  {
    career: "Cybersecurity Specialist",
    cipCodes: ["11.0101", "11.0103", "11.0901"],
    keywords: ["security", "cybersecurity", "network", "information security", "encryption", "protection"]
  },
  {
    career: "Network Administrator",
    cipCodes: ["11.0101", "11.0901"],
    keywords: ["network", "administrator", "systems", "infrastructure", "servers", "IT"]
  },
  {
    career: "Database Administrator",
    cipCodes: ["11.0101", "11.0802"],
    keywords: ["database", "administrator", "SQL", "data management", "DBA"]
  },
  {
    career: "Mobile Developer",
    cipCodes: ["11.0101", "11.0701"],
    keywords: ["mobile", "developer", "iOS", "Android", "app development", "smartphone"]
  },
  {
    career: "IT Support Specialist",
    cipCodes: ["11.0101", "11.0103"],
    keywords: ["IT", "support", "help desk", "technical support", "troubleshooting", "customer service"]
  },
  
  // Healthcare Careers
  {
    career: "Registered Nurse",
    cipCodes: ["51.1601", "51.3801"],
    keywords: ["nurse", "nursing", "RN", "healthcare", "patient care", "medical"]
  },
  {
    career: "Medical Assistant",
    cipCodes: ["51.0801"],
    keywords: ["medical assistant", "clinical", "healthcare", "patient", "medical office"]
  },
  {
    career: "Dental Hygienist",
    cipCodes: ["51.0602"],
    keywords: ["dental", "hygienist", "oral health", "teeth", "dentistry"]
  },
  {
    career: "Physical Therapist",
    cipCodes: ["51.2308"],
    keywords: ["physical therapy", "PT", "rehabilitation", "movement", "injury recovery"]
  },
  
  // Business Careers
  {
    career: "Accountant",
    cipCodes: ["52.0301"],
    keywords: ["accounting", "accountant", "CPA", "finance", "bookkeeping", "tax"]
  },
  {
    career: "Marketing Manager",
    cipCodes: ["52.1401"],
    keywords: ["marketing", "manager", "advertising", "branding", "promotion", "social media"]
  },
  {
    career: "Business Analyst",
    cipCodes: ["52.0201"],
    keywords: ["business", "analyst", "data analysis", "strategy", "operations", "consulting"]
  },
  {
    career: "Human Resources Manager",
    cipCodes: ["52.1001"],
    keywords: ["human resources", "HR", "personnel", "recruiting", "employee", "benefits"]
  },
  
  // Engineering Careers
  {
    career: "Electrical Engineer",
    cipCodes: ["14.1001"],
    keywords: ["electrical", "engineer", "circuits", "electronics", "power", "systems"]
  },
  {
    career: "Mechanical Engineer",
    cipCodes: ["14.1901"],
    keywords: ["mechanical", "engineer", "machines", "design", "manufacturing", "CAD"]
  },
  {
    career: "Civil Engineer",
    cipCodes: ["14.0801"],
    keywords: ["civil", "engineer", "construction", "infrastructure", "buildings", "roads"]
  },
  
  // Education Careers
  {
    career: "Teacher",
    cipCodes: ["13.1202", "13.1210", "13.1301"],
    keywords: ["teacher", "education", "classroom", "instruction", "students", "curriculum"]
  },
  {
    career: "School Counselor",
    cipCodes: ["13.1101"],
    keywords: ["counselor", "guidance", "school", "student services", "academic advising"]
  },
  
  // Arts & Media Careers
  {
    career: "Graphic Designer",
    cipCodes: ["50.0401", "10.0303"],
    keywords: ["graphic", "designer", "visual design", "adobe", "creative", "branding"]
  },
  {
    career: "Digital Media Artist",
    cipCodes: ["11.0801", "50.0401"],
    keywords: ["digital media", "artist", "animation", "video", "multimedia", "content creation"]
  },
  
  // Hospitality & Tourism Careers
  {
    career: "Hotel Manager",
    cipCodes: ["52.0901"],
    keywords: ["hotel", "hospitality", "manager", "tourism", "lodging", "guest services"]
  },
  {
    career: "Chef",
    cipCodes: ["12.0500"],
    keywords: ["chef", "culinary", "cooking", "cuisine", "kitchen", "food service"]
  },
  
  // Science Careers
  {
    career: "Biologist",
    cipCodes: ["26.0101"],
    keywords: ["biology", "biologist", "life science", "research", "laboratory", "organisms"]
  },
  {
    career: "Environmental Scientist",
    cipCodes: ["03.0103"],
    keywords: ["environmental", "scientist", "ecology", "conservation", "sustainability", "nature"]
  },
];

/**
 * Get CIP codes for a given career title
 * @param career - The career title (e.g., "Web Developer")
 * @returns Array of CIP codes relevant to that career
 */
export function getCIPCodesForCareer(career: string): string[] {
  const careerLower = career.toLowerCase().trim();
  
  // Direct match
  const directMatch = CAREER_TO_CIP_MAPPINGS.find(
    mapping => mapping.career.toLowerCase() === careerLower
  );
  
  if (directMatch) {
    return directMatch.cipCodes;
  }
  
  // Partial match (if career contains keywords)
  const partialMatches = CAREER_TO_CIP_MAPPINGS.filter(mapping => {
    const careerWords = mapping.career.toLowerCase().split(/\s+/);
    return careerWords.some(word => careerLower.includes(word));
  });
  
  if (partialMatches.length > 0) {
    return [...new Set(partialMatches.flatMap(m => m.cipCodes))];
  }
  
  return [];
}

/**
 * Get enhanced keywords for a career (original career words + related keywords)
 * @param career - The career title
 * @returns Array of keywords to use in searches
 */
export function getEnhancedKeywordsForCareer(career: string): string[] {
  const careerLower = career.toLowerCase().trim();
  const careerWords = careerLower.split(/\s+/);
  
  // Find matching career mapping
  const mapping = CAREER_TO_CIP_MAPPINGS.find(
    m => m.career.toLowerCase() === careerLower ||
         m.career.toLowerCase().includes(careerLower) ||
         careerLower.includes(m.career.toLowerCase())
  );
  
  if (mapping) {
    return [...careerWords, ...mapping.keywords];
  }
  
  return careerWords;
}

/**
 * Check if a career has a known CIP mapping
 * @param career - The career title
 * @returns True if the career has a known mapping
 */
export function hasCareerMapping(career: string): boolean {
  return getCIPCodesForCareer(career).length > 0;
}
