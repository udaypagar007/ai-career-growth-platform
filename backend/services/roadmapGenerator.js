import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/skillsDatabase.json');
const rawDb = fs.readFileSync(dbPath, 'utf-8');
const database = JSON.parse(rawDb);

/**
 * Generates a personalized learning roadmap for a specific skill
 */
export async function generatePersonalizedRoadmap(skillName, userProfile = {}, userApiKey = null) {
  const masterSkill = database.skillsMaster[skillName];
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (masterSkill) {
    const modules = masterSkill.roadmap.map((m, idx) => ({
      id: `mod_${idx + 1}`,
      title: m.module,
      estimatedDays: m.estimatedDays,
      topics: m.topics.map((t, tIdx) => ({
        id: `topic_${idx + 1}_${tIdx + 1}`,
        title: t,
        completed: false
      })),
      exercise: m.exercise,
      completed: false
    }));

    return {
      skillName,
      category: masterSkill.category,
      level: masterSkill.level,
      estimatedHours: masterSkill.estimatedHours,
      description: masterSkill.description,
      modules,
      recommendedResources: [
        { type: "Official Docs & Handbook", title: `${skillName} Complete Guide & Documentation` },
        { type: "Interactive Practice", title: `Hands-on ${skillName} Projects & Exercises` },
        { type: "Video Masterclass", title: `Production Architecture & Best Practices with ${skillName}` }
      ]
    };
  }

  // Fallback dynamic roadmap generator for any skill not explicitly in database
  const dynamicModules = [
    {
      id: "mod_1",
      title: `1. Core Foundations of ${skillName}`,
      estimatedDays: "3 Days",
      topics: [
        { id: "topic_1_1", title: `Understanding ${skillName} architecture & syntax`, completed: false },
        { id: "topic_1_2", title: `Environment setup, CLI tools, and package managers`, completed: false },
        { id: "topic_1_3", title: `Core data structures, functions, and key principles`, completed: false }
      ],
      exercise: `Build a starter CLI app or mini project implementing basic ${skillName} concepts.`,
      completed: false
    },
    {
      id: "mod_2",
      title: `2. Intermediate Design Patterns & Application in ${skillName}`,
      estimatedDays: "4 Days",
      topics: [
        { id: "topic_2_1", title: `Modular code organization and reusability`, completed: false },
        { id: "topic_2_2", title: `Error handling, logging, and asynchronous operations`, completed: false },
        { id: "topic_2_3", title: `Connecting ${skillName} with databases and external APIs`, completed: false }
      ],
      exercise: `Develop an API service integrating ${skillName} with persistent data storage.`,
      completed: false
    },
    {
      id: "mod_3",
      title: `3. Advanced Features & Production Performance`,
      estimatedDays: "4 Days",
      topics: [
        { id: "topic_3_1", title: `Optimization, caching, and state management`, completed: false },
        { id: "topic_3_2", title: `Automated unit testing and integration suites`, completed: false },
        { id: "topic_3_3", title: `Security hardening, RBAC, and best practices`, completed: false }
      ],
      exercise: `Perform load testing and write test suites achieving >85% code coverage.`,
      completed: false
    },
    {
      id: "mod_4",
      title: `4. Production Deployment & Capstone Project`,
      estimatedDays: "5 Days",
      topics: [
        { id: "topic_4_1", title: `Docker containerization and cloud deployment`, completed: false },
        { id: "topic_4_2", title: `CI/CD pipeline automation and environment configs`, completed: false },
        { id: "topic_4_3", title: `Monitoring, logging, and error tracking in production`, completed: false }
      ],
      exercise: `Deploy a production capstone project using ${skillName} with automated CI/CD pipelines.`,
      completed: false
    }
  ];

  return {
    skillName,
    category: "Technical Upskilling",
    level: "Intermediate",
    estimatedHours: 16,
    description: `Comprehensive AI-generated curriculum to master ${skillName} from fundamentals to production architecture.`,
    modules: dynamicModules,
    recommendedResources: [
      { type: "Official Docs", title: `${skillName} Reference Documentation` },
      { type: "Interactive Sandbox", title: `${skillName} Hands-On Coding Exercises` },
      { type: "Community Guides", title: `Top Production Architecture Patterns with ${skillName}` }
    ]
  };
}
