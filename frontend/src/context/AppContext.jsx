import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Resume analysis state
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_resume_data');
    return saved ? JSON.parse(saved) : null;
  });

  // Landing page view toggle vs workspace view
  const [isLandingView, setIsLandingView] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_resume_data');
    return !saved;
  });

  // Navigation active tab: 'resume' | 'ats' | 'jobs' | 'skills' | 'roadmap' | 'exam' | 'dashboard'
  const [activeTab, setActiveTab] = useState('resume');

  // Selected Target Job Role
  const [targetRole, setTargetRole] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_target_role');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Selected Skill for Roadmap/Exam
  const [selectedSkill, setSelectedSkill] = useState(() => {
    return localStorage.getItem('ai_upskill_selected_skill') || 'RAG & Vector Databases';
  });

  // Active AI Roadmaps map: { [skillName]: roadmapObject }
  const [roadmaps, setRoadmaps] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_roadmaps');
    return saved ? JSON.parse(saved) : {};
  });

  // Earned Certificates gallery
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  // User Skill Ratings/Scores: { [skillName]: number (e.g. 85) }
  const [skillRatings, setSkillRatings] = useState(() => {
    const saved = localStorage.getItem('ai_upskill_skill_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  // Optional Gemini API Key
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ai_upskill_api_key') || '';
  });

  // ─── Theme Management ───────────────────────────────────────────────────────
  // 'light' | 'dark' | 'system'  (light is the default)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ai_upskill_theme') || 'light';
  });

  // Apply/remove the .dark class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (prefersDark) => {
      if (theme === 'dark' || (theme === 'system' && prefersDark)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);
      const handler = (e) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(false);
    }

    localStorage.setItem('ai_upskill_theme', theme);
  }, [theme]);


  // Modals & Panels state
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [viewCertificateModal, setViewCertificateModal] = useState(null);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCertId, setVerifyCertId] = useState('');

  // Toast Notification System
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  // Check URL query on mount for public certificate verification ?verify=CERT-XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (verifyId) {
      setVerifyCertId(verifyId);
      setShowVerifyModal(true);
      setIsLandingView(false);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (resumeData) localStorage.setItem('ai_upskill_resume_data', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    if (targetRole) localStorage.setItem('ai_upskill_target_role', JSON.stringify(targetRole));
  }, [targetRole]);

  useEffect(() => {
    localStorage.setItem('ai_upskill_selected_skill', selectedSkill);
  }, [selectedSkill]);

  useEffect(() => {
    localStorage.setItem('ai_upskill_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('ai_upskill_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('ai_upskill_skill_ratings', JSON.stringify(skillRatings));
  }, [skillRatings]);

  useEffect(() => {
    localStorage.setItem('ai_upskill_api_key', apiKey);
  }, [apiKey]);

  // Update topic completion status in roadmap
  const toggleTopicCompletion = (skillName, moduleId, topicId) => {
    setRoadmaps(prev => {
      const currentRoadmap = prev[skillName];
      if (!currentRoadmap) return prev;

      const updatedModules = currentRoadmap.modules.map(mod => {
        if (mod.id !== moduleId) return mod;

        const updatedTopics = mod.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t);
        const allTopicsDone = updatedTopics.every(t => t.completed);

        return {
          ...mod,
          topics: updatedTopics,
          completed: allTopicsDone
        };
      });

      return {
        ...prev,
        [skillName]: {
          ...currentRoadmap,
          modules: updatedModules
        }
      };
    });
  };

  // Add earned certificate and update skill score
  const recordExamResult = (evaluation) => {
    const { skillName, scorePercent, certificate } = evaluation;

    setSkillRatings(prev => ({
      ...prev,
      [skillName]: Math.max(prev[skillName] || 0, scorePercent)
    }));

    if (certificate) {
      setCertificates(prev => {
        const filtered = prev.filter(c => c.skillName !== skillName);
        return [certificate, ...filtered];
      });
      setViewCertificateModal(certificate);
      showToast(`🎉 Congratulations! You earned ${certificate.badgeTitle}!`, 'success');
    }
  };

  // 1-Click Instant Guest Demo Loader
  const loadGuestDemo = async (demoKey = 'alex') => {
    showToast('Loading interactive guest profile...', 'info');
    setIsLandingView(false);

    const demoAlexText = `Alex Turner
Email: alex.turner@dev.io | Phone: +1 (555) 234-5678
Full Stack Developer with 3+ years of experience building modern cloud applications.
Proficient in React, TypeScript, JavaScript, Node.js, Express, HTML, CSS, SQL, PostgreSQL, and Git.
Spearheaded frontend migration to React 18, reducing initial page load by 35% across 40,000+ monthly active users.
Engineered resilient REST APIs in Node.js with Redis caching layer, cutting database query latency by 45%.
Automated CI/CD deployment pipelines using GitHub Actions, ensuring 99.9% uptime.`;

    try {
      const res = await fetch('/api/resume/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: demoAlexText })
      });
      const data = await res.json();
      if (data.success) {
        setResumeData(data);
        if (data.jobRecommendations && data.jobRecommendations.length > 0) {
          setTargetRole(data.jobRecommendations[0]);
        }
        setActiveTab('jobs');
        showToast('Guest profile active! Explore job matches & AI roadmaps.', 'success');
      }
    } catch (err) {
      console.error('Demo load error:', err);
      showToast('Error loading guest demo: ' + err.message, 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLandingView,
        setIsLandingView,
        activeTab,
        setActiveTab,
        resumeData,
        setResumeData,
        targetRole,
        setTargetRole,
        selectedSkill,
        setSelectedSkill,
        roadmaps,
        setRoadmaps,
        certificates,
        setCertificates,
        skillRatings,
        setSkillRatings,
        apiKey,
        setApiKey,
        theme,
        setTheme,
        showOptimizerModal,
        setShowOptimizerModal,
        showSettingsModal,
        setShowSettingsModal,
        viewCertificateModal,
        setViewCertificateModal,
        showAICoach,
        setShowAICoach,
        showVerifyModal,
        setShowVerifyModal,
        verifyCertId,
        setVerifyCertId,
        toast,
        showToast,
        toggleTopicCompletion,
        recordExamResult,
        loadGuestDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
