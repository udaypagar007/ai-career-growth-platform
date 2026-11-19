import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  User, 
  Briefcase, 
  Target, 
  Award, 
  Compass, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function Dashboard() {
  const { 
    resumeData, 
    targetRole, 
    roadmaps, 
    certificates, 
    skillRatings, 
    setViewCertificateModal, 
    setActiveTab,
    setSelectedSkill
  } = useApp();

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">No profile data available yet.</p>
        <button
          onClick={() => setActiveTab('resume')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold text-xs"
        >
          Upload Resume to Unlock Dashboard
        </button>
      </div>
    );
  }

  const { candidate } = resumeData;

  // Build data for radar chart from candidate skills + completed exams
  const chartData = [
    { skill: 'React / Frontend', score: candidate.detectedSkills.some(s => ['React', 'HTML', 'CSS', 'JavaScript'].includes(s)) ? 85 : 40 },
    { skill: 'Node / Backend', score: candidate.detectedSkills.some(s => ['Node.js', 'Express', 'Python'].includes(s)) ? 80 : 35 },
    { skill: 'AI & Machine Learning', score: skillRatings['RAG & Vector Databases'] || (candidate.detectedSkills.some(s => ['Python', 'AI', 'TensorFlow'].includes(s)) ? 75 : 30) },
    { skill: 'TypeScript', score: skillRatings['TypeScript'] || (candidate.detectedSkills.includes('TypeScript') ? 90 : 30) },
    { skill: 'Cloud & DevOps', score: skillRatings['Kubernetes'] || (candidate.detectedSkills.some(s => ['Docker', 'AWS', 'Kubernetes'].includes(s)) ? 85 : 25) },
    { skill: 'Database & SQL', score: candidate.detectedSkills.some(s => ['SQL', 'PostgreSQL', 'MongoDB'].includes(s)) ? 80 : 40 }
  ];

  // Calculate active roadmaps list
  const activeRoadmapsList = Object.keys(roadmaps).map(skillName => {
    const rm = roadmaps[skillName];
    let total = 0;
    let done = 0;
    rm.modules.forEach(m => {
      m.topics.forEach(t => {
        total += 1;
        if (t.completed) done += 1;
      });
    });
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { skillName, percent, totalTopics: total, doneTopics: done };
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      
      {/* Top Banner Profile Summary */}
      <div className="glass-card p-6 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
              {candidate.name ? candidate.name.charAt(0) : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{candidate.name || 'User Profile'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{candidate.email} • {candidate.experienceLevel}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target Role: {targetRole ? targetRole.roleTitle : 'Full Stack Developer'}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Job Match: {targetRole ? targetRole.matchScore : 88}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('skills')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore New Skills</span>
            </button>
          </div>

        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Target Job Fit</span>
            <Target className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{targetRole ? targetRole.matchScore : 88}%</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">High Match</span>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Roadmaps</span>
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{activeRoadmapsList.length}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">In Progress</span>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Badges Earned</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{certificates.length}</div>
          <span className="text-[10px] text-amber-400 font-semibold mt-1 block">Verifiable PDF Badges</span>
        </div>

        <div className="glass-card p-5 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Learning Streak</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">5 Days</div>
          <span className="text-[10px] text-purple-400 font-semibold mt-1 block">Keep it up! 🔥</span>
        </div>
      </div>

      {/* Main Charts & Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Chart: Skill Matrix */}
        <div className="glass-card p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Skill Proficiency Radar Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Evaluated from resume & passed skill exams</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Proficiency" dataKey="score" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Learning Roadmaps */}
        <div className="glass-card p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Active AI Learning Roadmaps</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Track progress per module topic</p>
          </div>

          <div className="space-y-4 my-auto">
            {activeRoadmapsList.length > 0 ? (
              activeRoadmapsList.map((item) => (
                <div
                  key={item.skillName}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 cursor-pointer hover:border-indigo-500/40 transition-colors"
                  onClick={() => {
                    setSelectedSkill(item.skillName);
                    setActiveTab('roadmap');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.skillName}</span>
                    <span className="text-xs font-extrabold text-sky-400">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{item.doneTopics} of {item.totalTopics} Topics Completed</span>
                    <span className="text-indigo-400 font-semibold hover:underline">Continue &rarr;</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No active roadmaps yet. Select a skill to get started!
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('skills')}
            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            + Add New Skill Roadmap
          </button>
        </div>

      </div>

      {/* Earned Certificates Gallery */}
      <div className="glass-card p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Skill Certification Badges ({certificates.length})</span>
          </h3>
        </div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cert.skillName}</h4>
                      <span className="text-[10px] text-slate-400">{cert.issuedDate}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {cert.scorePercent}%
                  </span>
                </div>

                <button
                  onClick={() => setViewCertificateModal(cert)}
                  className="w-full py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors"
                >
                  View & Download PDF Certificate
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
            No certificates earned yet. Pass a skill exam to unlock your first digital badge!
          </div>
        )}
      </div>

    </div>
  );
}
