import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Clock, 
  TrendingUp, 
  Compass, 
  CheckCircle, 
  Flame, 
  Target,
  BookOpen,
  Filter
} from 'lucide-react';

export default function SkillRankings() {
  const { 
    resumeData, 
    targetRole, 
    setSelectedSkill, 
    setActiveTab, 
    roadmaps, 
    setRoadmaps, 
    apiKey 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingSkill, setLoadingSkill] = useState(null);

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">Please upload a resume first to view personalized skill recommendations.</p>
        <button
          onClick={() => setActiveTab('resume')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white font-semibold text-xs"
        >
          Go to Resume Upload
        </button>
      </div>
    );
  }

  const { recommendedSkills } = resumeData;

  // Filter categories
  const categories = ['All', ...new Set(recommendedSkills.map(s => s.category))];

  // Filter skills by search query and category
  const filteredSkills = recommendedSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectSkill = async (skillName) => {
    setSelectedSkill(skillName);
    
    // Check if roadmap already exists in state/localStorage
    if (roadmaps[skillName]) {
      setActiveTab('roadmap');
      return;
    }

    setLoadingSkill(skillName);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ skillName, userProfile: resumeData.candidate })
      });

      const data = await res.json();
      if (data.success) {
        setRoadmaps(prev => ({
          ...prev,
          [skillName]: data.roadmap
        }));
        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    } finally {
      setLoadingSkill(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2 & 3: Ranked Skill Recommendations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recommended Skills for You</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ranked based on gap analysis for {targetRole ? <span className="text-sky-400 font-semibold">{targetRole.roleTitle}</span> : 'your profile'} and tech industry demand
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, rankIdx) => {
          const isRoadmapLoaded = !!roadmaps[skill.name];
          const isLoading = loadingSkill === skill.name;

          return (
            <div
              key={skill.name}
              className="glass-card p-6 flex flex-col justify-between glass-card-hover border-slate-800/80 hover:border-indigo-500/40 relative"
            >
              <div className="space-y-4">
                
                {/* Top Row: Rank & Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 font-extrabold text-sm flex items-center justify-center">
                      #{rankIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{skill.name}</span>
                        {isRoadmapLoaded && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        )}
                      </h3>
                      <span className="text-[11px] text-slate-400">{skill.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    skill.priorityBadge === 'Must Learn Gap'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                      : skill.priorityBadge === 'High Demand'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  }`}>
                    {skill.priorityBadge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">{skill.description}</p>

                {/* Meta details */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Est. Time</span>
                    <span className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-sky-400" />
                      {skill.estimatedHours} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Level</span>
                    <span className="text-xs font-bold text-slate-200 block mt-0.5">
                      {skill.level}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Demand</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      High
                    </span>
                  </div>
                </div>

                {/* Target roles list */}
                {skill.targetRoles && skill.targetRoles.length > 0 && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-400" />
                    <span>Relevant for: {skill.targetRoles.slice(0, 2).join(', ')}</span>
                  </div>
                )}

              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  disabled={isLoading}
                  onClick={() => handleSelectSkill(skill.name)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isRoadmapLoaded
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90'
                      : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white hover:opacity-95 shadow-indigo-500/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Generating AI Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>{isRoadmapLoaded ? 'Open AI Roadmap' : 'Generate AI Learning Roadmap'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
