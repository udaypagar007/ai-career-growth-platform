import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Target,
  DollarSign,
  Layers,
  UserCheck,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function JobRecommendations() {
  const { resumeData, targetRole, setTargetRole, setActiveTab, setShowOptimizerModal } = useApp();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">No resume analyzed yet. Please upload a resume first.</p>
        <button
          onClick={() => setActiveTab('resume')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold text-xs"
        >
          Go to Resume Upload
        </button>
      </div>
    );
  }

  const { candidate, jobRecommendations, executiveSummary, atsScorecard } = resumeData;
  const atsScore = atsScorecard?.overallATS || 85;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Top Profile & AI Executive Summary Banner */}
      <div className="glass-card p-6 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <UserCheck className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{candidate.name || 'Candidate Profile'}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">{candidate.experienceLevel} &bull; {candidate.yearsEst} Year(s) Est. Experience</p>
              </div>
            </div>

            {/* Detected Skills Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 self-center">Detected Skills:</span>
              {candidate.detectedSkills && candidate.detectedSkills.length > 0 ? (
                candidate.detectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">General tech background</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* ATS Scorecard Pill */}
            <button
              onClick={() => setActiveTab('ats')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-colors text-xs"
              title="View ATS Scorecard"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">ATS Score:</span>
              <span className="font-extrabold text-emerald-400">{atsScore}/100</span>
            </button>

            <button
              onClick={() => setShowOptimizerModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Resume Optimizer</span>
            </button>
          </div>

        </div>

        {/* Executive AI Summary Box */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 bg-slate-950/40 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI EXECUTIVE CAREER ANALYSIS</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {executiveSummary}
          </p>
        </div>
      </div>

      {/* Recommended Jobs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Recommended Job Roles</h2>
          <p className="text-xs text-slate-400 mt-0.5">Ranked based on your current resume skills & market demand alignment</p>
        </div>
        <button
          onClick={() => setActiveTab('skills')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity self-start sm:self-auto"
        >
          <span>View Skill Gap Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobRecommendations.map((job) => {
          const isTargeted = targetRole?.roleId === job.roleId;
          const linkedInQuery = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.roleTitle)}`;
          const indeedQuery = `https://www.indeed.com/jobs?q=${encodeURIComponent(job.roleTitle)}`;

          return (
            <div
              key={job.roleId}
              className={`glass-card p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isTargeted
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-2xl shadow-indigo-500/10'
                  : 'hover:border-slate-700'
              }`}
            >
              {isTargeted && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-sky-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Target className="w-3 h-3" />
                  Target Role
                </div>
              )}

              <div className="space-y-4">
                {/* Header & Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {job.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{job.roleTitle}</h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.avgSalary}</span>
                    </div>
                  </div>

                  <div className="text-center flex-shrink-0">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-14 h-14 transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-slate-800"
                          fill="transparent"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={138}
                          strokeDashoffset={138 - (138 * job.matchScore) / 100}
                          className={job.matchScore >= 80 ? 'text-emerald-400' : job.matchScore >= 60 ? 'text-amber-400' : 'text-sky-400'}
                          fill="transparent"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute font-extrabold text-xs text-white">{job.matchScore}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Match</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>

                {/* Skill Match Breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Matching Skills ({job.matchingSkills.length}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.matchingSkills.length > 0 ? (
                        job.matchingSkills.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">None detected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Recommended Skill Gaps ({job.missingSkills.length}):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.missingSkills.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Live Job Search */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => {
                    setTargetRole(job);
                    setActiveTab('skills');
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isTargeted
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{isTargeted ? 'Targeted Role (View Skills)' : 'Select as Target Role'}</span>
                </button>

                {/* Direct Live Job Application Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={linkedInQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-950 hover:bg-sky-950/40 text-[10px] text-slate-400 hover:text-sky-300 border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>LinkedIn Jobs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={indeedQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/40 text-[10px] text-slate-400 hover:text-indigo-300 border border-slate-800 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Indeed Jobs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
