import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Target, 
  ShieldCheck, 
  Compass, 
  Award, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function OverviewDashboard() {
  const { 
    resumeData, 
    targetRole, 
    roadmaps, 
    certificates, 
    skillRatings, 
    setActiveTab, 
    setSelectedSkill, 
    setViewCertificateModal 
  } = useApp();

  const candidate = resumeData?.candidate || {
    name: 'Alex Turner',
    email: 'alex.turner@dev.io',
    experienceLevel: 'Mid Level (3 yrs)',
    detectedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'Git']
  };

  const atsScore = resumeData?.atsScorecard?.overallATS || 88;
  const matchScore = targetRole?.matchScore || 94;
  const roleTitle = targetRole?.roleTitle || 'Full Stack Web Developer';

  const chartData = [
    { skill: 'React / Frontend', score: candidate.detectedSkills?.some(s => ['React', 'HTML', 'CSS', 'JavaScript'].includes(s)) ? 85 : 40 },
    { skill: 'Node / Backend', score: candidate.detectedSkills?.some(s => ['Node.js', 'Express', 'Python'].includes(s)) ? 80 : 35 },
    { skill: 'AI & Machine Learning', score: skillRatings['RAG & Vector Databases'] || (candidate.detectedSkills?.some(s => ['Python', 'AI', 'TensorFlow'].includes(s)) ? 75 : 30) },
    { skill: 'TypeScript', score: skillRatings['TypeScript'] || (candidate.detectedSkills?.includes('TypeScript') ? 90 : 30) },
    { skill: 'Cloud & DevOps', score: skillRatings['Kubernetes'] || (candidate.detectedSkills?.some(s => ['Docker', 'AWS', 'Kubernetes'].includes(s)) ? 85 : 25) },
    { skill: 'Database & SQL', score: candidate.detectedSkills?.some(s => ['SQL', 'PostgreSQL', 'MongoDB'].includes(s)) ? 80 : 40 }
  ];

  const activeRoadmapsList = Object.keys(roadmaps).map(skillName => {
    const rm = roadmaps[skillName];
    let total = 0;
    let done = 0;
    rm.modules?.forEach(m => {
      m.topics?.forEach(t => {
        total++;
        if (t.completed) done++;
      });
    });
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { skillName, percent, totalTopics: total, doneTopics: done };
  });

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      
      {/* KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="app-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>TARGET ROLE FIT</span>
            <Target className="w-3.5 h-3.5 text-accent-blue" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular">
            {matchScore}%
          </div>
          <span className="text-[10px] text-zinc-400 truncate block">
            {roleTitle}
          </span>
        </div>

        <div className="app-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>ATS SCREENING SCORE</span>
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
          </div>
          <div className="text-2xl font-black font-mono text-accent-emerald tabular">
            {atsScore}<span className="text-xs text-zinc-500">/100</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">
            High ATS Pass Probability
          </span>
        </div>

        <div className="app-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>ACTIVE ROADMAPS</span>
            <Compass className="w-3.5 h-3.5 text-accent-indigo" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular">
            {Math.max(1, activeRoadmapsList.length)}
          </div>
          <span className="text-[10px] text-zinc-400 block">
            Personalized Curricula
          </span>
        </div>

        <div className="app-panel p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>VERIFIED CREDENTIALS</span>
            <Award className="w-3.5 h-3.5 text-accent-amber" />
          </div>
          <div className="text-2xl font-black font-mono text-accent-amber tabular">
            {Math.max(1, certificates.length)}
          </div>
          <span className="text-[10px] text-zinc-400 block">
            Publicly Auditable
          </span>
        </div>

      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Radar Matrix (7 Columns) */}
        <div className="lg:col-span-7 app-panel p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-app-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent-blue" />
                <span>Multi-Disciplinary Competency Radar</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Calculated from resume document parsing and passed proctored examinations.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              RADAR v1.2
            </span>
          </div>

          <div className="h-72 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#232A3B" />
                <PolarAngleAxis dataKey="skill" stroke="#94A3B8" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#232A3B" />
                <Radar name="Proficiency" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-app-border text-xs">
            <span className="text-zinc-500 font-mono text-[11px]">Primary Strength: TypeScript & Web Architecture</span>
            <button
              onClick={() => setActiveTab('resume')}
              className="text-accent-blue hover:underline text-xs font-semibold flex items-center gap-1"
            >
              <span>Inspect ATS Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Learning Milestones & Quick Actions (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Active Roadmaps */}
          <div className="app-panel p-5 space-y-3 flex-1">
            <div className="flex items-center justify-between border-b border-app-border pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-accent-indigo" />
                <span>Active Learning Curricula</span>
              </h3>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-[11px] font-medium text-accent-blue hover:underline"
              >
                + Add Skill
              </button>
            </div>

            <div className="space-y-2.5">
              {(activeRoadmapsList.length > 0 ? activeRoadmapsList : [{ skillName: 'RAG & Vector Databases', percent: 45, totalTopics: 9, doneTopics: 4 }]).map((item) => (
                <div
                  key={item.skillName}
                  onClick={() => {
                    setSelectedSkill(item.skillName);
                    setActiveTab('roadmap');
                  }}
                  className="p-3 rounded-lg bg-app-surface border border-app-border hover:border-zinc-700 cursor-pointer transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-100 group-hover:text-accent-blue transition-colors">
                      {item.skillName}
                    </span>
                    <span className="font-mono font-bold text-accent-emerald">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent-emerald h-full transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>{item.doneTopics} of {item.totalTopics} Topics Completed</span>
                    <span className="text-accent-blue flex items-center gap-0.5">
                      Open IDE &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issued Credential Quick Card */}
          <div className="app-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-accent-amber" />
                <span>Latest Verified Credential</span>
              </span>
              <span className="text-[10px] font-mono text-accent-emerald font-bold">VERIFIED</span>
            </div>

            <div className="p-3 rounded-lg bg-app-surface border border-app-border flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-200">TypeScript Certified Professional</div>
                <div className="text-[10px] font-mono text-zinc-500">ID: CERT-DEMO-TS99 &bull; Score: 100%</div>
              </div>
              <button
                onClick={() => setViewCertificateModal({
                  id: 'CERT-DEMO-TS99',
                  skillName: 'TypeScript',
                  issuedDate: 'November 19, 2026',
                  scorePercent: 100,
                  verificationCode: 'VERIFIED-982341'
                })}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-xs font-medium text-zinc-200 border border-zinc-700 transition-colors"
              >
                Inspect
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
