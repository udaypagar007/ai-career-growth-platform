import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Comprehensive dictionary of common skills for keyword extraction
const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'React Native', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
  'Express', 'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Redux', 'GraphQL', 'REST API',
  'Python', 'Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow',
  'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Generative AI',
  'LLM', 'Prompt Engineering', 'RAG', 'Vector Databases', 'LangChain', 'LlamaIndex',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Snowflake', 'BigQuery',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Git', 'GitHub',
  'Linux', 'Bash', 'System Design', 'Microservices', 'Agile', 'Scrum', 'Jira', 'Figma',
  'Java', 'Spring Boot', 'C++', 'C#', '.NET', 'Go', 'Rust', 'PHP', 'Laravel', 'Swift', 'Kotlin'
];

/**
 * Extracts raw text from a PDF buffer or returns plain text string
 */
export async function extractResumeText(fileBuffer, mimeType) {
  if (mimeType === 'application/pdf' || fileBuffer instanceof Buffer) {
    try {
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    } catch (err) {
      console.warn('PDF parsing fallback to raw text reading:', err.message);
      return fileBuffer.toString('utf-8');
    }
  }
  return fileBuffer.toString('utf-8');
}

/**
 * Parses resume text and extracts candidate metadata & skill list
 */
export function analyzeResumeContent(text) {
  const cleanText = text.replace(/\s+/g, ' ');

  // Extract Email
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'Not specified';

  // Extract Phone
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : 'Not specified';

  // Extract Name (heuristic based on first non-empty lines)
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let name = 'Candidate Profile';
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes('@')) {
    name = lines[0];
  }

  // Detect Skills
  const detectedSkillsSet = new Set();
  const lowerText = cleanText.toLowerCase();

  KNOWN_SKILLS.forEach(skill => {
    // Regex matching exact word boundary for skills
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(cleanText) || lowerText.includes(skill.toLowerCase())) {
      detectedSkillsSet.add(skill);
    }
  });

  const detectedSkills = Array.from(detectedSkillsSet);

  // Estimate experience level
  let yearsEst = 1;
  const yearsMatches = cleanText.match(/(\d+)\+?\s*years?\s*(of)?\s*experience/i);
  if (yearsMatches) {
    yearsEst = parseInt(yearsMatches[1], 10) || 1;
  } else if (detectedSkills.length > 10) {
    yearsEst = 4;
  } else if (detectedSkills.length > 5) {
    yearsEst = 2;
  }

  let experienceLevel = 'Entry Level (0-2 yrs)';
  if (yearsEst >= 5) experienceLevel = 'Senior Level (5+ yrs)';
  else if (yearsEst >= 2) experienceLevel = 'Mid Level (2-5 yrs)';

  // Generate resume summary
  const summarySnippet = lines.slice(0, 5).join(' ').substring(0, 300) + '...';

  return {
    name,
    email,
    phone,
    experienceLevel,
    yearsEst,
    detectedSkills,
    summarySnippet,
    rawText: cleanText
  };
}
