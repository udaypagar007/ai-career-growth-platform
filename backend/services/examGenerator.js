import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/skillsDatabase.json');
const rawDb = fs.readFileSync(dbPath, 'utf-8');
const database = JSON.parse(rawDb);

/**
 * Generates an exam question set for a target skill
 */
export function generateSkillExam(skillName) {
  const master = database.skillsMaster[skillName];
  if (master && master.examQuestions && master.examQuestions.length > 0) {
    return {
      skillName,
      totalQuestions: master.examQuestions.length,
      passingScorePercent: 70,
      questions: master.examQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      }))
    };
  }

  // Fallback dynamic questions for any custom skill
  const fallbackQuestions = [
    {
      id: `${skillName.toLowerCase()}_q1`,
      question: `What is the primary architectural purpose of using ${skillName} in modern enterprise software?`,
      options: [
        `To enhance modularity, scalability, and code maintainability in production systems.`,
        `To replace physical server hardware.`,
        `To eliminate the need for databases completely.`,
        `To bypass computer network firewalls.`
      ],
      correctIndex: 0,
      explanation: `${skillName} provides structured patterns and capabilities that improve software modularity and performance.`
    },
    {
      id: `${skillName.toLowerCase()}_q2`,
      question: `Which of the following is considered a core industry best practice when configuring ${skillName}?`,
      options: [
        `Isolating environment configurations, managing error boundaries, and writing automated unit tests.`,
        `Hardcoding passwords directly in source files.`,
        `Disabling all logging in production environments.`,
        `Ignoring API response status codes.`
      ],
      correctIndex: 0,
      explanation: `Environment isolation, robust error boundaries, and automated testing are universal software engineering standards.`
    },
    {
      id: `${skillName.toLowerCase()}_q3`,
      question: `How does mastering ${skillName} impact performance and user experience?`,
      options: [
        `By reducing runtime latency, preventing system bottlenecks, and ensuring reliable data execution.`,
        `By automatically generating marketing emails.`,
        `By doubling monitor resolution.`,
        `By reducing memory usage to zero.`
      ],
      correctIndex: 0,
      explanation: `Proper execution of ${skillName} minimizes bottlenecks and provides reliable application delivery.`
    },
    {
      id: `${skillName.toLowerCase()}_q4`,
      question: `When deploying solutions built with ${skillName}, what is the recommended security posture?`,
      options: [
        `Implement Principle of Least Privilege (PoLP), input sanitization, and secure credential secrets management.`,
        `Grant administrator root access to all users.`,
        `Store database connections in public GitHub repos.`,
        `Avoid SSL/TLS encryption to save CPU cycles.`
      ],
      correctIndex: 0,
      explanation: `Security best practices require minimum required permissions, proper input sanitization, and secrets management.`
    }
  ];

  return {
    skillName,
    totalQuestions: fallbackQuestions.length,
    passingScorePercent: 70,
    questions: fallbackQuestions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }))
  };
}

/**
 * Evaluates exam submission answers and computes updated skill rating & certificate eligibility
 */
export function evaluateExamSubmission(skillName, userAnswers) {
  const master = database.skillsMaster[skillName];
  let questionBank = master && master.examQuestions && master.examQuestions.length > 0
    ? master.examQuestions
    : [
        {
          id: `${skillName.toLowerCase()}_q1`,
          correctIndex: 0,
          explanation: `${skillName} enhances system modularity and maintainability.`
        },
        {
          id: `${skillName.toLowerCase()}_q2`,
          correctIndex: 0,
          explanation: `Isolating environment configurations and automated testing are best practices.`
        },
        {
          id: `${skillName.toLowerCase()}_q3`,
          correctIndex: 0,
          explanation: `Optimizing code prevents system bottlenecks and improves latency.`
        },
        {
          id: `${skillName.toLowerCase()}_q4`,
          correctIndex: 0,
          explanation: `Least privilege principle and input sanitization safeguard security.`
        }
      ];

  let correctCount = 0;
  const detailedResults = questionBank.map(q => {
    const userSelected = userAnswers[q.id];
    const isCorrect = userSelected === q.correctIndex;
    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      userSelectedIndex: userSelected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const percentage = Math.round((correctCount / questionBank.length) * 100);
  const passed = percentage >= 70;

  // Compute skill level improvement
  let newProficiency = "Beginner (30%)";
  if (percentage >= 90) newProficiency = "Expert / Master (95%)";
  else if (percentage >= 75) newProficiency = "Advanced (82%)";
  else if (percentage >= 60) newProficiency = "Intermediate (65%)";

  const certificate = passed ? {
    id: `CERT-${Date.now().toString(36).toUpperCase()}`,
    skillName,
    issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    scorePercent: percentage,
    verificationCode: `VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
    badgeTitle: `${skillName} Certified Professional`
  } : null;

  return {
    skillName,
    scorePercent: percentage,
    correctCount,
    totalQuestions: questionBank.length,
    passed,
    newProficiency,
    detailedResults,
    certificate
  };
}
