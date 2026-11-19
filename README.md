# ⚡ UpskillAI — Enterprise AI Workforce Upskilling & Credentialing Platform

UpskillAI is a modern, full-stack AI-powered workforce development platform designed to analyze technical resumes, diagnose skill gaps, chart personalized learning roadmaps, evaluate competencies through automated AI examinations, issue verifiable digital credentials, and offer 24/7 AI career mentorship.

---

## 🌟 Key Features

1. **Enterprise SaaS Landing Experience & 1-Click Guest Demo**
   - High-impact dark mode SaaS landing page with live platform statistics and interactive simulation.
   - **Explore as Guest Demo**: Visitors can test the entire platform with pre-analyzed profiles with zero setup.

2. **Smart ATS Resume Compatibility Engine (0–100 Scorecard)**
   - Multi-factor ATS parsing algorithm evaluating:
     - **Technical Skills Alignment** (35% weight)
     - **Quantified Impact & Metrics** (25% weight)
     - **Action Verb Strength** (20% weight)
     - **Contact & Formatting Completeness** (20% weight)
   - Dynamic keyword clouds and actionable resume improvement recommendations.
   - **AI Resume Bullet Optimizer**: Transform typical bullets into high-impact, metrics-driven achievements.

3. **Career Matching & Live Job Integration**
   - Compatibility scoring across high-growth roles (*Full Stack Developer*, *AI/ML Engineer*, *Cloud & DevOps*, *Cybersecurity*, etc.).
   - Direct 1-click **"Apply on LinkedIn"** and **"Search on Indeed"** queries pre-filtered with user competencies.

4. **Personalized AI Learning Roadmaps**
   - Dynamic module-by-module curricula tailored to the candidate's exact skill gaps.
   - Interactive topic checklists, estimated completion times, hands-on capstone exercises, and curated resources.

5. **AI Skill Evaluation Exams & Verifiable Credentials**
   - Dynamic multiple-choice exam engine with instant scoring, feedback, and celebratory confetti.
   - **Downloadable High-Res PDF Certificates** with cryptographic verification hashes and gold seals.
   - **Public Certificate Verification Portal** (`/?verify=CERT-XXXX` or `/api/certificate/:id`) for recruiters and employers to audit credentials.

6. **24/7 Interactive AI Career Coach & Mentor**
   - Slide-over AI Mentor assistant powered by Google Gemini 1.5 and an intelligent local heuristic engine.
   - Provides technical interview questions (STAR method), project architecture suggestions, and code explanations.

7. **Unified Single-Origin Serving (Deployment Ready)**
   - Backend serves both API endpoints and the compiled React frontend from a single port, eliminating CORS issues and enabling 1-click deployment on cloud hosts like Render or Railway.

---

## 🚀 How to Run Locally

### 1. Unified Production Mode (Fastest)
Runs the entire frontend and backend together on `http://localhost:5000`:
```powershell
# From the project root:
npm run start
```
Visit **[http://localhost:5000](http://localhost:5000)** in your browser.

### 2. Full Development Mode (Hot Reloading)
Runs both Vite frontend (port 5173) and backend API (port 5000) concurrently:
```powershell
# From the project root:
npm run dev
```
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 How to Deploy Online for Free

### Option 1: All-in-One Deployment on Render.com (Recommended)
1. Push this folder to a GitHub repository.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository:
   - **Build Command:** `npm run build:all`
   - **Start Command:** `npm run start`
4. That's it! Render gives you a free live public domain: `https://your-platform.onrender.com`.

### Option 2: Decoupled Deployment (Vercel + Render)
- **Frontend on Vercel**: Connect the `frontend/` directory to Vercel (free global CDN).
- **Backend on Render**: Deploy `backend/` as a Node web service and set `VITE_API_URL` to your backend URL.

---

## 📁 Project Architecture

```
e:\B.tech Project\
├── backend\
│   ├── data\
│   │   ├── skillsDatabase.json    # Comprehensive job roles, skills & questions
│   │   └── certificates.json      # Persistent public verification registry
│   ├── services\
│   │   ├── aiEngine.js            # Dual-engine AI, ATS scorecard & AI coach
│   │   ├── examGenerator.js       # Dynamic question generator & grading
│   │   ├── resumeParser.js        # PDF & text parser with regex extraction
│   │   └── roadmapGenerator.js    # Adaptive module roadmap generator
│   └── server.js                  # Express API & Single-Origin static server
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── AICareerCoach.jsx           # Slide-over AI chat mentor
│   │   │   ├── ATSScorecard.jsx            # 0-100 ATS gauge & recommendations
│   │   │   ├── CertificateModal.jsx        # Printable certificate & PDF export
│   │   │   ├── CertificateVerification.jsx # Public credential audit portal
│   │   │   ├── Dashboard.jsx               # Skill radar & analytics overview
│   │   │   ├── ExamQuiz.jsx                # Timed exam quiz with confetti
│   │   │   ├── JobRecommendations.jsx      # Role matching & LinkedIn links
│   │   │   ├── LandingHero.jsx             # SaaS hero & 1-click guest demo
│   │   │   ├── Navbar.jsx                  # Navigation header with mode toggle
│   │   │   ├── ResumeOptimizerModal.jsx    # Bullet point rewrites
│   │   │   ├── ResumeUploader.jsx          # File & text dropzone
│   │   │   ├── RoadmapViewer.jsx           # Module checklist & milestones
│   │   │   ├── SettingsModal.jsx           # Dual AI mode & Gemini API key
│   │   │   ├── SkillRankings.jsx           # Gap skill explorer & filters
│   │   │   └── Toast.jsx                   # Notification alert system
│   │   ├── context\AppContext.jsx          # Central reactive state store
│   │   ├── App.jsx                         # Main view router
│   │   └── main.jsx                        # React root entrypoint
│   ├── package.json
│   └── vite.config.js
└── package.json                            # Root orchestration scripts
```

---

## 🔑 AI Engine Configuration

The platform features a **Dual-Engine Architecture**:
- **Built-in Smart Heuristic Engine:** Works 100% offline out-of-the-box without requiring any API keys.
- **Google Gemini 1.5 Flash:** Optional toggle in **Settings** (or via `GEMINI_API_KEY` in `backend/.env`) for live generative AI response enrichment.
