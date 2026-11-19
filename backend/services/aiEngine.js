import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load skills database
const dbPath = path.join(__dirname, '../data/skillsDatabase.json');
const rawDb = fs.readFileSync(dbPath, 'utf-8');
const database = JSON.parse(rawDb);

/**
 * Calculates match percentage between candidate skills and role required/keywords
 */
function calculateRoleMatch(detectedSkills, role) {
  const normalizedDetected = detectedSkills.map(s => s.toLowerCase());
  const roleKeywords = role.matchKeywords.map(k => k.toLowerCase());
  const requiredSkills = role.requiredSkills.map(s => s.toLowerCase());

  let matches = 0;
  roleKeywords.forEach(kw => {
    if (normalizedDetected.some(ds => ds.includes(kw) || kw.includes(ds))) {
      matches += 1;
    }
  });

  const keywordScore = Math.min(100, Math.round((matches / Math.max(1, roleKeywords.length)) * 100));
  
  // Missing skills
  const missingSkills = role.requiredSkills.filter(req => {
    const rLower = req.toLowerCase();
    return !normalizedDetected.some(ds => ds.includes(rLower) || rLower.includes(ds));
  });

  const matchingSkills = role.requiredSkills.filter(req => {
    const rLower = req.toLowerCase();
    return normalizedDetected.some(ds => ds.includes(rLower) || rLower.includes(ds));
  });

  const overallScore = Math.max(35, Math.min(98, Math.round(keywordScore * 0.7 + (matchingSkills.length / Math.max(1, requiredSkills.length)) * 30)));

  return {
    roleId: role.id,
    roleTitle: role.title,
    category: role.category,
    matchScore: overallScore,
    avgSalary: role.avgSalary,
    description: role.description,
    matchingSkills,
    missingSkills,
    upSkillPriority: role.upSkillPriority
  };
}

/**
 * Generates resume bullet optimization suggestions
 */
function generateResumeBulletTips(detectedSkills, experienceLevel) {
  const tips = [
    {
      original: "Responsible for developing web applications.",
      improved: `Spearheaded end-to-end development of responsive web applications using ${detectedSkills.slice(0, 3).join(', ') || 'modern frameworks'}, boosting user engagement by 35%.`,
      category: "Impact & Metrics"
    },
    {
      original: "Worked on database management and API integrations.",
      improved: "Engineered scalable REST APIs and optimized database queries, reducing average API response latency by 40%.",
      category: "Technical Depth"
    },
    {
      original: "Assisted in code reviews and deployment.",
      improved: "Automated CI/CD deployment pipelines and led weekly code reviews, maintaining 99.9% uptime and zero-regression releases.",
      category: "DevOps & Quality"
    }
  ];

  if (detectedSkills.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('ai'))) {
    tips.push({
      original: "Built machine learning scripts for data.",
      improved: "Architected Retrieval-Augmented Generation (RAG) pipelines and PyTorch models, elevating text query retrieval accuracy to 92%.",
      category: "AI/ML Focus"
    });
  }

  return tips;
}

/**
 * Computes an ATS Compatibility Scorecard (0-100) with detailed dimensional metrics
 */
export function computeATSScorecard(parsedResume, targetRole = null) {
  const text = (parsedResume.rawText || '').toLowerCase();
  const detected = parsedResume.detectedSkills || [];

  // 1. Technical Skills Match Score (35% weight)
  let skillsScore = Math.min(98, Math.max(30, detected.length * 8));
  if (targetRole && targetRole.matchScore) {
    skillsScore = targetRole.matchScore;
  }

  // 2. Measurable Impact & Metrics Score (25% weight)
  // Check for quantifiable symbols (%, $, numbers, x times, latency, users)
  const metricMatches = text.match(/\b\d+(\.\d+)?%|\$\d+|\b\d+\s*(users|clients|requests|ms|seconds|x|million|k)\b/gi) || [];
  const impactScore = Math.min(95, Math.max(35, metricMatches.length * 18 + (metricMatches.length > 0 ? 30 : 0)));

  // 3. Power Action Verbs Score (20% weight)
  const powerVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'automated', 'implemented', 'designed', 'delivered', 'reduced', 'increased', 'scaled', 'built', 'led'];
  const foundVerbs = powerVerbs.filter(v => text.includes(v));
  const verbsScore = Math.min(95, Math.max(40, foundVerbs.length * 15 + 25));

  // 4. Formatting & Contact Completeness Score (20% weight)
  let completenessScore = 50;
  if (parsedResume.email && parsedResume.email !== 'Not specified') completenessScore += 20;
  if (parsedResume.phone && parsedResume.phone !== 'Not specified') completenessScore += 15;
  if (parsedResume.name && parsedResume.name !== 'Candidate Profile') completenessScore += 15;
  completenessScore = Math.min(100, completenessScore);

  // Overall Weighted ATS Score
  const overallATS = Math.round(
    skillsScore * 0.35 +
    impactScore * 0.25 +
    verbsScore * 0.20 +
    completenessScore * 0.20
  );

  let ratingBadge = "Needs Optimization";
  let ratingColor = "rose";
  if (overallATS >= 80) {
    ratingBadge = "High ATS Pass Rate";
    ratingColor = "emerald";
  } else if (overallATS >= 65) {
    ratingBadge = "Competitive Profile";
    ratingColor = "amber";
  }

  // Specific Actionable Suggestions
  const suggestions = [];
  if (metricMatches.length < 3) {
    suggestions.push({
      type: "Metric Gap",
      text: "Add at least 3-4 quantified outcome metrics (e.g., 'reduced latency by 35%', 'handled 50k+ daily users') to pass recruiter screening filters."
    });
  }
  if (foundVerbs.length < 3) {
    suggestions.push({
      type: "Action Verbs",
      text: "Replace passive phrases ('responsible for', 'worked on') with high-impact power verbs ('Architected', 'Spearheaded', 'Engineered')."
    });
  }
  if (detected.length < 6) {
    suggestions.push({
      type: "Skill Depth",
      text: "Expand your technical toolchain section to include relevant libraries, cloud providers, and databases."
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      type: "Excellence",
      text: "Strong ATS profile! Tailor your primary summary to mirror the exact keywords of your specific target job posting."
    });
  }

  return {
    overallATS,
    ratingBadge,
    ratingColor,
    dimensions: [
      { name: "Technical Skills Alignment", score: skillsScore, weight: "35%", benchmark: "Target: 80%+" },
      { name: "Quantified Impact & Metrics", score: impactScore, weight: "25%", benchmark: `${metricMatches.length} metrics found` },
      { name: "Action Verb Strength", score: verbsScore, weight: "20%", benchmark: `${foundVerbs.length} power verbs found` },
      { name: "Structure & Contact Completeness", score: completenessScore, weight: "20%", benchmark: "ATS friendly format" }
    ],
    suggestions,
    foundMetricsCount: metricMatches.length,
    foundVerbs
  };
}

/**
 * Rank skill recommendations based on resume gap analysis & market demand
 */
export function rankRecommendedSkills(parsedResume) {
  const detected = parsedResume.detectedSkills || [];
  const detectedLower = detected.map(s => s.toLowerCase());

  // Aggregate missing skills across all job roles
  const skillScoresMap = new Map();

  database.jobRoles.forEach(role => {
    const matchRes = calculateRoleMatch(detected, role);
    const missing = matchRes.missingSkills;

    missing.forEach(skillName => {
      const existing = skillScoresMap.get(skillName) || {
        name: skillName,
        frequency: 0,
        demandScore: role.demandScore,
        category: role.category,
        relatedRoles: []
      };
      existing.frequency += 1;
      existing.relatedRoles.push(role.title);
      skillScoresMap.set(skillName, existing);
    });
  });

  // Also include skills from database master if not already present
  Object.keys(database.skillsMaster).forEach(skillName => {
    if (!detectedLower.some(d => d.includes(skillName.toLowerCase()))) {
      if (!skillScoresMap.has(skillName)) {
        const info = database.skillsMaster[skillName];
        skillScoresMap.set(skillName, {
          name: skillName,
          frequency: 1,
          demandScore: 85,
          category: info.category,
          relatedRoles: ["General Upskilling"]
        });
      }
    }
  });

  // Convert map to array & rank
  const ranked = Array.from(skillScoresMap.values()).map(item => {
    const dbInfo = database.skillsMaster[item.name] || {
      category: item.category,
      level: "Intermediate",
      marketDemand: "High Demand",
      estimatedHours: 16,
      description: `High-impact industry skill to elevate your technical capability in ${item.category}.`
    };

    // Calculate priority score
    const priorityScore = Math.min(99, Math.round(item.frequency * 20 + item.demandScore * 0.5));
    let priorityBadge = "High Impact";
    if (priorityScore >= 85) priorityBadge = "Must Learn Gap";
    else if (priorityScore >= 70) priorityBadge = "High Demand";

    return {
      name: item.name,
      priorityScore,
      priorityBadge,
      category: dbInfo.category,
      level: dbInfo.level,
      marketDemand: dbInfo.marketDemand,
      estimatedHours: dbInfo.estimatedHours,
      description: dbInfo.description,
      targetRoles: item.relatedRoles
    };
  });

  // Sort descending by priority score
  ranked.sort((a, b) => b.priorityScore - a.priorityScore);

  return ranked;
}

/**
 * Perform comprehensive resume analysis
 */
export async function analyzeResumeWithAI(parsedResume, userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  // Build job recommendations
  const jobRecommendations = database.jobRoles.map(role => calculateRoleMatch(parsedResume.detectedSkills, role))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topSkillRankings = rankRecommendedSkills(parsedResume);
  const bulletTips = generateResumeBulletTips(parsedResume.detectedSkills, parsedResume.experienceLevel);
  const atsScorecard = computeATSScorecard(parsedResume, jobRecommendations[0]);

  let aiExecutiveSummary = `Based on your resume analysis, your profile demonstrates strong foundational experience in ${parsedResume.detectedSkills.slice(0, 4).join(', ') || 'software development'}. You are best positioned for **${jobRecommendations[0]?.roleTitle || 'Full Stack Developer'}** with a **${jobRecommendations[0]?.matchScore || 85}% job match score** and an **ATS Score of ${atsScorecard.overallATS}/100**. Upskilling in key gaps like **${topSkillRankings.slice(0, 2).map(s => s.name).join(' & ')}** will significantly increase your market value.`;

  // If Gemini API Key is available, enrich executive summary
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this candidate resume:
Skills: ${parsedResume.detectedSkills.join(', ')}
Experience Level: ${parsedResume.experienceLevel}
Top Job Role Match: ${jobRecommendations[0]?.roleTitle}
ATS Score: ${atsScorecard.overallATS}/100

Provide a 3-sentence professional, encouraging executive career analysis highlighting strengths and top priority skill to acquire next.`;

      const result = await model.generateContent(prompt);
      if (result && result.response) {
        aiExecutiveSummary = result.response.text();
      }
    } catch (err) {
      console.warn('Gemini API call skipped or failed, using built-in engine:', err.message);
    }
  }

  return {
    candidate: {
      name: parsedResume.name,
      email: parsedResume.email,
      phone: parsedResume.phone,
      experienceLevel: parsedResume.experienceLevel,
      yearsEst: parsedResume.yearsEst,
      detectedSkills: parsedResume.detectedSkills,
      summarySnippet: parsedResume.summarySnippet
    },
    jobRecommendations,
    recommendedSkills: topSkillRankings,
    resumeBulletTips: bulletTips,
    executiveSummary: aiExecutiveSummary,
    atsScorecard
  };
}

/**
 * Interactive AI Career Coach & Mentor Response Generator
 */
export async function getAICoachResponse(userMessage, context = {}, userApiKey = null) {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;
  const currentSkill = context.selectedSkill || 'Software Engineering';
  const targetRole = context.targetRole?.roleTitle || 'Full Stack Developer';

  // If Gemini API Key is available, use live LLM
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a supportive, world-class Senior Technical Career Coach and Mentor on an AI Workforce Upskilling Platform.
Context:
- User is learning: ${currentSkill}
- Target Job Role: ${targetRole}
- User experience level: ${context.experienceLevel || 'Intermediate'}

User Question: "${userMessage}"

Respond in a warm, concise, and highly actionable tone (max 2-3 short paragraphs). Include code snippets, bullet steps, or sample interview answers when helpful.`;

      const result = await model.generateContent(prompt);
      if (result && result.response) {
        return {
          reply: result.response.text(),
          source: 'Google Gemini 1.5'
        };
      }
    } catch (err) {
      console.warn('Gemini Coach error, falling back to smart local coach:', err.message);
    }
  }

  // Heuristic Smart Local Coach
  const msg = (userMessage || '').toLowerCase();

  if (msg.includes('interview') || msg.includes('question') || msg.includes('ask me')) {
    return {
      reply: `Here is a high-frequency technical interview question for **${currentSkill}**:\n\n**"Can you explain how you would handle performance bottlenecks and state synchronization in a production system using ${currentSkill}?"**\n\n💡 **Pro Tip for Answering:**\nUse the **STAR technique** (Situation, Task, Action, Result). State the architecture decision, mention the trade-offs (e.g. caching vs DB load), and conclude with a measurable outcome (e.g. *"reduced response latency by 40%"*).`,
      source: 'AI Career Coach Engine'
    };
  }

  if (msg.includes('project') || msg.includes('build') || msg.includes('portfolio')) {
    return {
      reply: `To showcase **${currentSkill}** on your resume for a **${targetRole}** position, build this standout portfolio project:\n\n🚀 **Capstone Idea:** Build an End-to-End Enterprise Microservice / Pipeline using ${currentSkill}.\n- **Key Features:** Implement authentication, automated test coverage (>80%), Docker containerization, and a GitHub Actions CI/CD pipeline.\n- **Impact on Resume:** Demonstrates production readiness, cloud deployment, and architectural depth rather than just a tutorial clone.`,
      source: 'AI Career Coach Engine'
    };
  }

  if (msg.includes('resume') || msg.includes('bullet') || msg.includes('ats')) {
    return {
      reply: `To make your **${currentSkill}** experience stand out to ATS filters:\n\n1. Always lead with an active power verb: *Architected*, *Engineered*, or *Spearheaded*.\n2. Include the tech stack in parentheses: *(TypeScript, React, PostgreSQL)*.\n3. Always attach a quantifiable metric: *"Engineered automated data ingestion pipeline using ${currentSkill}, accelerating processing time by 45% for 20k+ daily records."*`,
      source: 'AI Career Coach Engine'
    };
  }

  return {
    reply: `Mastering **${currentSkill}** is one of the highest ROI investments for landing a **${targetRole}** role right now.\n\nMy recommendation:\n1. Focus on the core architectural patterns in your customized roadmap.\n2. Complete each hands-on code exercise at the end of each module.\n3. Take the AI Skill Certification exam to generate a verifiable digital badge to link directly on your LinkedIn profile!`,
    source: 'AI Career Coach Engine'
  };
}
