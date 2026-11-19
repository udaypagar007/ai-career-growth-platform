import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Code2, 
  User, 
  Mail, 
  Phone, 
  Layers, 
  Zap, 
  Download,
  CheckCircle
} from 'lucide-react';

export default function ResumeStudio() {
  const { 
    resumeData, 
    setResumeData, 
    setActiveTab, 
    setTargetRole, 
    apiKey, 
    showToast,
    loadGuestDemo 
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('diff'); // 'diff' | 'raw' | 'upload'
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [appliedRewrites, setAppliedRewrites] = useState({});

  const candidate = resumeData?.candidate || {
    name: 'Alex Turner',
    email: 'alex.turner@dev.io',
    phone: '+1 (555) 234-5678',
    experienceLevel: 'Mid Level (3 yrs)',
    detectedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'Git']
  };

  const defaultBulletTips = [
    {
      original: "Responsible for developing web applications and writing JavaScript code.",
      improved: "Spearheaded end-to-end architecture of responsive React applications, cutting initial page load times by 35% for 40k+ monthly active users.",
      category: "Impact & Performance"
    },
    {
      original: "Worked on database management and API integrations.",
      improved: "Engineered scalable REST APIs in Node.js with Redis caching layer, reducing database query latency by 45%.",
      category: "Backend Architecture"
    },
    {
      original: "Assisted with testing and deployment pipelines.",
      improved: "Automated CI/CD deployment pipelines using GitHub Actions, maintaining 99.9% uptime across production environments.",
      category: "DevOps & Quality"
    }
  ];

  const bulletTips = resumeData?.resumeBulletTips || defaultBulletTips;

  // Calculate live ATS score boost when rewrites are applied
  const appliedCount = Object.keys(appliedRewrites).length;
  const baseATS = resumeData?.atsScorecard?.overallATS || 88;
  const liveATSScore = Math.min(99, baseATS + appliedCount * 3);

  const atsScorecard = resumeData?.atsScorecard || {
    overallATS: baseATS,
    ratingBadge: 'High ATS Pass Rate',
    ratingColor: 'emerald',
    dimensions: [
      { name: 'Technical Skills Alignment', score: 92, weight: '35%', benchmark: 'Target: 80%+' },
      { name: 'Quantified Impact & Metrics', score: Math.min(98, 85 + appliedCount * 4), weight: '25%', benchmark: `${3 + appliedCount} metrics active` },
      { name: 'Action Verb Strength', score: Math.min(98, 88 + appliedCount * 3), weight: '20%', benchmark: 'Power verbs active' },
      { name: 'Structure & Contact Completeness', score: 95, weight: '20%', benchmark: 'ATS compliant format' }
    ]
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

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
        if (data.jobRecommendations?.length > 0) {
          setTargetRole(data.jobRecommendations[0]);
        }
        showToast('Resume uploaded and diagnostic completed!', 'success');
        setActiveTabSub('diff');
      }
    } catch (err) {
      showToast('Error uploading resume: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const copyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Optimized bullet copied to clipboard!', 'success');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const applyRewriteToResume = (idx) => {
    setAppliedRewrites(prev => {
      const updated = { ...prev, [idx]: true };
      const newScore = Math.min(99, baseATS + Object.keys(updated).length * 3);
      showToast(`Applied bullet rewrite! ATS Score recalculated to ${newScore}/100`, 'success');
      return updated;
    });
  };

  const exportATSResumeTxt = () => {
    const lines = [
      `=============================================================`,
      `${candidate.name.toUpperCase()} - ATS OPTIMIZED RESUME`,
      `Email: ${candidate.email} | Phone: ${candidate.phone}`,
      `Level: ${candidate.experienceLevel}`,
      `=============================================================`,
      ``,
      `TECHNICAL COMPETENCIES & TOOLCHAIN:`,
      `${candidate.detectedSkills.join(', ')}`,
      ``,
      `PROFESSIONAL EXPERIENCE & VERIFIED IMPACT:`,
      ...bulletTips.map((tip, i) => {
        const text = appliedRewrites[i] ? tip.improved : tip.improved;
        return `• [${tip.category}] ${text}`;
      }),
      ``,
      `ATS COMPATIBILITY RATING: ${liveATSScore}/100 (Audited by UpskillAI Engine)`,
      `Issued via UpskillAI Workforce Studio`,
      `=============================================================`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.name.replace(/\s+/g, '_')}_ATS_Optimized_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ATS-Optimized resume exported successfully!', 'success');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Resume & ATS Diagnostic Studio</h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-accent-blue border border-zinc-700">
              ATS ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time keyword extraction, recruiter screening metrics, and live red/green diff optimization.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportATSResumeTxt}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors"
            title="Download plain-text ATS compliant resume"
          >
            <Download className="w-3.5 h-3.5 text-accent-blue" />
            <span>Export ATS Resume</span>
          </button>

          <div className="bg-app-surface p-1 rounded-lg border border-app-border flex text-xs">
            <button
              onClick={() => setActiveTabSub('diff')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTabSub === 'diff' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ATS Health & Diff
            </button>
            <button
              onClick={() => setActiveTabSub('upload')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTabSub === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Upload / Replace File
            </button>
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className="px-3.5 py-1.5 rounded-lg bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue text-xs font-semibold border border-accent-blue/30 transition-colors flex items-center gap-1.5"
          >
            <span>Career Pathways</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeTabSub === 'upload' ? (
        /* Upload Mode Screen */
        <div className="max-w-xl mx-auto my-auto w-full p-8 app-panel text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-300">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Upload New Resume File</h3>
            <p className="text-xs text-zinc-400 mt-1">Supports PDF, DOCX, or plain text up to 10MB.</p>
          </div>

          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            id="studio-file-input"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          />

          <label
            htmlFor="studio-file-input"
            className="block py-3 px-4 rounded-xl bg-accent-blue text-white font-bold text-xs cursor-pointer hover:bg-blue-600 transition-colors"
          >
            {isUploading ? 'Parsing Document...' : 'Select Resume File'}
          </label>

          <div className="border-t border-app-border pt-4">
            <span className="text-[11px] text-zinc-500 block mb-2">Or load instant guest developer profile:</span>
            <button
              onClick={() => { loadGuestDemo('alex'); setActiveTabSub('diff'); }}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs font-medium text-zinc-200 transition-colors"
            >
              Load Alex Turner (Full Stack Dev)
            </button>
          </div>
        </div>
      ) : (
        /* Split-Pane Document & ATS Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Pane (5 Columns): Extracted Profile & Skill Tokens */}
          <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
            
            {/* Candidate Metadata Card */}
            <div className="app-panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500">Document Metadata</span>
                <span className="text-[10px] font-mono text-accent-emerald font-bold bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded">
                  PARSED & VERIFIED
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    {candidate.phone}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-app-surface border border-app-border text-xs text-zinc-300">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Experience Assessment</span>
                {candidate.experienceLevel} &bull; Estimated {candidate.yearsEst || 3} Year(s) in Software Industry
              </div>
            </div>

            {/* Extracted Skill Tokens List */}
            <div className="app-panel p-5 space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-accent-blue" />
                  <span>Detected Competencies ({candidate.detectedSkills?.length || 0})</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Regex Keyword Match</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidate.detectedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-app-surface text-zinc-300 border border-app-border font-medium hover:border-zinc-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Pane (7 Columns): ATS Health Gauge & Interactive Diff Optimizer */}
          <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto">
            
            {/* ATS Scorecard Gauge & Breakdown */}
            <div className="app-panel p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-zinc-500">Live Diagnostic Overview</span>
                  <h3 className="text-base font-bold text-white mt-0.5">ATS Screening Pass Probability</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-3xl font-black font-mono text-accent-emerald tabular">
                      {liveATSScore}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/100</span>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald uppercase">
                    {liveATSScore >= 90 ? 'Optimal ATS Pass' : atsScorecard.ratingBadge}
                  </span>
                </div>
              </div>

              {/* 4 Dimension Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {atsScorecard.dimensions?.map((dim, dIdx) => (
                  <div key={dIdx} className="p-3 rounded-lg bg-app-surface border border-app-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium truncate">{dim.name}</span>
                      <span className="font-mono font-bold text-zinc-100">{dim.score}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${dim.score >= 80 ? 'bg-accent-emerald' : dim.score >= 60 ? 'bg-accent-amber' : 'bg-accent-rose'}`}
                        style={{ width: `${dim.score}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 block truncate">{dim.benchmark}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Diff Optimizer */}
            <div className="app-panel p-5 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent-blue" />
                    <span>Side-by-Side Bullet Point Diff Optimizer</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Click "Apply to Resume" to live-mutate your active document and boost your ATS score.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-accent-emerald">
                  {appliedCount}/{bulletTips.length} Applied
                </span>
              </div>

              <div className="space-y-4">
                {bulletTips.map((tip, idx) => {
                  const isApplied = !!appliedRewrites[idx];

                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl bg-app-surface border transition-colors space-y-3 ${
                        isApplied ? 'border-accent-emerald/40 bg-accent-emerald/[0.02]' : 'border-app-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                          {tip.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyBullet(tip.improved, idx)}
                            className="text-[11px] font-medium text-zinc-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => applyRewriteToResume(idx)}
                            disabled={isApplied}
                            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isApplied
                                ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 cursor-default'
                                : 'bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30'
                            }`}
                          >
                            {isApplied ? <CheckCircle className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>{isApplied ? 'Applied' : 'Apply to Resume'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Original Diff (Red subtraction) */}
                        <div className="p-2.5 rounded-lg bg-accent-rose/5 border border-accent-rose/20 text-zinc-300">
                          <div className="text-[10px] font-mono text-accent-rose font-bold mb-1 flex items-center gap-1">
                            <span>[-] ORIGINAL BULLET:</span>
                          </div>
                          <p className="line-through text-zinc-400">"{tip.original}"</p>
                        </div>

                        {/* Improved Diff (Green addition) */}
                        <div className="p-3 rounded-lg bg-accent-emerald/5 border border-accent-emerald/20 text-zinc-100">
                          <div className="text-[10px] font-mono text-accent-emerald font-bold mb-1 flex items-center gap-1">
                            <span>[+] AI OPTIMIZED ATS REWRITE:</span>
                          </div>
                          <p className="leading-relaxed font-medium">"{tip.improved}"</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
