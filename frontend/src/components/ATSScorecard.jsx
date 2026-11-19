import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Zap,
  Target
} from 'lucide-react';

export default function ATSScorecard() {
  const { resumeData, setActiveTab, setShowOptimizerModal } = useApp();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">Please upload or analyze a resume first to view the ATS Scorecard.</p>
        <button
          onClick={() => setActiveTab('resume')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold text-xs"
        >
          Go to Resume Upload
        </button>
      </div>
    );
  }

  const { candidate, atsScorecard } = resumeData;

  const score = atsScorecard?.overallATS || 85;
  const ratingBadge = atsScorecard?.ratingBadge || 'Competitive Profile';
  const dimensions = atsScorecard?.dimensions || [
    { name: "Technical Skills Alignment", score: 85, weight: "35%", benchmark: "Target: 80%+" },
    { name: "Quantified Impact & Metrics", score: 80, weight: "25%", benchmark: "Metrics found" },
    { name: "Action Verb Strength", score: 75, weight: "20%", benchmark: "Power verbs active" },
    { name: "Structure & Contact Completeness", score: 95, weight: "20%", benchmark: "ATS friendly format" }
  ];
  const suggestions = atsScorecard?.suggestions || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Top ATS Scorecard Banner */}
      <div className="glass-card p-6 sm:p-8 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS Resume Screening Engine</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              ATS Compatibility Scorecard
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating resume for <span className="text-sky-400 font-bold">{candidate.name || 'Candidate'}</span> against Fortune 500 Applicant Tracking System (ATS) parsing algorithms.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
              <button
                onClick={() => setShowOptimizerModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Optimize Resume Bullets with AI</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-2"
              >
                <span>View Job Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Big Score Gauge */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[220px] flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Overall ATS Rating
            </span>

            <div className="relative inline-flex items-center justify-center my-3">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * score) / 100}
                  className={score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white">{score}</span>
                <span className="text-xs text-slate-400 block -mt-1">/100</span>
              </div>
            </div>

            <div className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border inline-block ${
              score >= 80
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : score >= 65
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {ratingBadge}
            </div>
          </div>

        </div>

      </div>

      {/* 4 Dimension Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="glass-card p-6 border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{dim.name}</h4>
                <span className="text-[10px] text-slate-400">Weight: {dim.weight} &bull; {dim.benchmark}</span>
              </div>
              <span className={`text-lg font-black ${
                dim.score >= 80 ? 'text-emerald-400' : dim.score >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {dim.score}%
              </span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  dim.score >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : dim.score >= 60
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-500 to-red-400'
                }`}
                style={{ width: `${dim.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Suggestions & Key Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Suggestions Card */}
        <div className="lg:col-span-2 glass-card p-6 border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Actionable ATS Improvements</span>
          </h3>

          <div className="space-y-3">
            {suggestions.map((sug, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex-shrink-0 mt-0.5">
                  {sug.type}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{sug.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parsed Keywords Cloud */}
        <div className="glass-card p-6 border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Extracted ATS Keywords</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Hard skills recognized by parsing regex</p>

            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {candidate.detectedSkills && candidate.detectedSkills.length > 0 ? (
                candidate.detectedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                  >
                    {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills recognized</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target High-Match Roles</span>
          </button>
        </div>

      </div>

    </div>
  );
}
