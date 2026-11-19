import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractResumeText, analyzeResumeContent } from './services/resumeParser.js';
import { analyzeResumeWithAI, rankRecommendedSkills, getAICoachResponse } from './services/aiEngine.js';
import { generatePersonalizedRoadmap } from './services/roadmapGenerator.js';
import { generateSkillExam, evaluateExamSubmission } from './services/examGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Multer in-memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Persistent Certificates storage file
const certsPath = path.join(__dirname, 'data/certificates.json');
function loadCertificates() {
  try {
    if (fs.existsSync(certsPath)) {
      return JSON.parse(fs.readFileSync(certsPath, 'utf-8'));
    }
  } catch (err) {
    console.warn('Error reading certificates database:', err.message);
  }
  return [];
}

function saveCertificateRecord(cert) {
  try {
    const certs = loadCertificates();
    const updated = [cert, ...certs.filter(c => c.id !== cert.id)];
    fs.writeFileSync(certsPath, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving certificate:', err.message);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    message: 'AI Workforce Upskilling Platform Backend Active'
  });
});

/**
 * 1. Upload & Parse Resume File (PDF/TXT)
 */
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;
    const extractedText = await extractResumeText(req.file.buffer, req.file.mimetype);
    const parsedData = analyzeResumeContent(extractedText);
    const aiAnalysis = await analyzeResumeWithAI(parsedData, apiKey);

    res.json({
      success: true,
      filename: req.file.originalname,
      ...aiAnalysis
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to process resume: ' + err.message });
  }
});

/**
 * 1b. Analyze Pasted Resume Text
 */
app.post('/api/resume/analyze-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Resume text must be at least 20 characters' });
    }

    const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;
    const parsedData = analyzeResumeContent(text);
    const aiAnalysis = await analyzeResumeWithAI(parsedData, apiKey);

    res.json({
      success: true,
      filename: 'Pasted Text Resume',
      ...aiAnalysis
    });
  } catch (err) {
    console.error('Resume text analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze text: ' + err.message });
  }
});

/**
 * 2. Get Ranked Skill Recommendations
 */
app.get('/api/skills/recommendations', (req, res) => {
  try {
    const sampleProfile = { detectedSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'] };
    const rankings = rankRecommendedSkills(sampleProfile);
    res.json({ success: true, recommendedSkills: rankings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 4. Generate Personalized AI Learning Roadmap
 */
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { skillName, userProfile } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'skillName is required' });
    }

    const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;
    const roadmap = await generatePersonalizedRoadmap(skillName, userProfile, apiKey);

    res.json({ success: true, roadmap });
  } catch (err) {
    console.error('Roadmap error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap: ' + err.message });
  }
});

/**
 * 5a. Generate Exam for Selected Skill
 */
app.post('/api/exam/generate', (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'skillName is required' });
    }

    const examData = generateSkillExam(skillName);
    res.json({ success: true, exam: examData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate exam: ' + err.message });
  }
});

/**
 * 5b. Evaluate Exam Submission & Skill Rating Improvement
 */
app.post('/api/exam/evaluate', (req, res) => {
  try {
    const { skillName, userAnswers, candidateName } = req.body;
    if (!skillName || !userAnswers) {
      return res.status(400).json({ error: 'skillName and userAnswers are required' });
    }

    const evaluation = evaluateExamSubmission(skillName, userAnswers);

    if (evaluation.passed && evaluation.certificate) {
      const fullCert = {
        ...evaluation.certificate,
        recipientName: candidateName || 'Candidate Professional',
        status: 'Officially Verified',
        issuer: 'UpskillAI Workforce Authority',
        verifiedAt: new Date().toISOString()
      };
      evaluation.certificate = fullCert;
      saveCertificateRecord(fullCert);
    }

    res.json({ success: true, evaluation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate exam: ' + err.message });
  }
});

/**
 * 6. Public Certificate Verification Endpoint
 */
app.get('/api/certificate/:id', (req, res) => {
  try {
    const { id } = req.params;
    const certs = loadCertificates();
    const found = certs.find(c => c.id.toUpperCase() === id.toUpperCase());

    if (!found) {
      return res.status(404).json({ success: false, error: 'Certificate record not found or expired.' });
    }

    res.json({ success: true, certificate: found });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed: ' + err.message });
  }
});

/**
 * 7. AI Career Coach & Mentor Assistant
 */
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = req.headers['x-api-key'] || process.env.GEMINI_API_KEY;
    const coachResponse = await getAICoachResponse(message, context, apiKey);

    res.json({ success: true, ...coachResponse });
  } catch (err) {
    console.error('AI Coach error:', err);
    res.status(500).json({ error: 'Failed to get coach response: ' + err.message });
  }
});

/**
 * Verify Optional Gemini API Key
 */
app.post('/api/settings/verify-key', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.json({ valid: false, message: 'No API key supplied' });
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    await model.generateContent('ping');
    res.json({ valid: true, message: 'Google Gemini API key verified successfully!' });
  } catch (err) {
    res.json({ valid: false, message: 'API key validation failed: ' + err.message });
  }
});

// Single-Origin Production Serving: Serve built frontend from Express
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 UpskillAI Production Backend Running`);
  console.log(`📍 Server Port: ${PORT}`);
  console.log(`🌍 Single-Origin Serving: ${fs.existsSync(frontendDist) ? 'Active (frontend/dist)' : 'Development Mode'}`);
  console.log(`====================================================`);
});
