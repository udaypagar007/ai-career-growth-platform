import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Cpu, 
  Check, 
  UserCheck, 
  Briefcase,
  Zap,
  Code2
} from 'lucide-react';

const SAMPLE_RESUMES = [
  {
    title: "Full Stack Web Developer",
    skills: ["React", "JavaScript", "Node.js", "Express", "HTML", "CSS", "SQL", "Git"],
    exp: "Mid Level (3 yrs)",
    text: `Alex Turner
Email: alex.turner@dev.io | Phone: +1 555-0192
Full Stack Developer with 3 years of experience building modern web applications using React, Node.js, Express, JavaScript, HTML, CSS, and PostgreSQL. Experienced in REST APIs and Git version control.`
  },
  {
    title: "Python & Machine Learning Specialist",
    skills: ["Python", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "SQL", "Data Analysis"],
    exp: "Mid Level (2 yrs)",
    text: `Sarah Lin
Email: sarah.lin@ai-labs.org | Phone: +1 555-8821
Data & ML Specialist passionate about predictive models and data analytics. Proficient in Python, Pandas, NumPy, Scikit-Learn, TensorFlow, SQL, and data visualization.`
  }
];

export default function ResumeUploader() {
  const { setResumeData, setActiveTab, setTargetRole, apiKey, showToast } = useApp();
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'text'
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const processUpload = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const headers = {};
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (data.success) {
        setResumeData(data);
        if (data.jobRecommendations && data.jobRecommendations.length > 0) {
          setTargetRole(data.jobRecommendations[0]);
        }
        showToast('Resume analyzed! ATS score & career matches calculated.', 'success');
        setActiveTab('ats');
      } else {
        setErrorMsg(data.error || 'Failed to process resume');
      }
    } catch (err) {
      setErrorMsg('Error connecting to backend server: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processTextAnalysis = async (textToAnalyze) => {
    const text = textToAnalyze || pastedText;
    if (!text || text.trim().length < 20) {
      setErrorMsg('Please enter or paste at least 20 characters of resume text.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('/api/resume/analyze-text', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (data.success) {
        setResumeData(data);
        if (data.jobRecommendations && data.jobRecommendations.length > 0) {
          setTargetRole(data.jobRecommendations[0]);
        }
        showToast('Resume analyzed! ATS score & career matches calculated.', 'success');
        setActiveTab('ats');
      } else {
        setErrorMsg(data.error || 'Failed to analyze text.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to backend server: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 5: AI Resume Analysis & Job Matching</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Accelerate Your Career with <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Upskilling</span>
        </h1>
        <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Upload your resume or paste your experience. Our AI engine will extract your core skills, identify ideal career paths, and rank high-impact skills to acquire next.
        </p>
      </div>

      {/* Mode Switcher Pills */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
          <button
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'upload'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload PDF / Document
          </button>
          <button
            onClick={() => setActiveMode('text')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'text'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste Resume Text
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border-indigo-500/20">
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              <Cpu className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-white">Analyzing Resume with AI...</h3>
              <p className="text-xs text-slate-400 mt-1">Extracting skills, mapping target roles & building skill gap matrix</p>
            </div>
          </div>
        )}

        {activeMode === 'upload' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              className="hidden"
              id="resume-file-input"
              onChange={(e) => e.target.files && processUpload(e.target.files[0])}
            />
            <label htmlFor="resume-file-input" className="cursor-pointer block">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Drop your resume PDF here, or <span className="text-sky-400 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Supports PDF, TXT or Word formats up to 10MB.
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume contents, work experience, or technical summary here..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            ></textarea>
            <button
              onClick={() => processTextAnalysis()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume Text with AI</span>
            </button>
          </div>
        )}

        {/* Quick Sample Selector */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or Try Quick 1-Click Sample Resumes:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_RESUMES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => processTextAnalysis(sample.text)}
                className="text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Skills: {sample.skills.slice(0, 4).join(', ')}...
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
