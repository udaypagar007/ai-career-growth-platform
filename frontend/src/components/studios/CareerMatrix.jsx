import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  DollarSign, 
  TrendingUp, 
  Compass, 
  Filter
} from 'lucide-react';

export default function CareerMatrix() {
  const { 
    resumeData, 
    targetRole, 
    setTargetRole, 
    setSelectedSkill, 
    setActiveTab, 
    roadmaps, 
    setRoadmaps, 
    apiKey, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loadingRoadmapSkill, setLoadingRoadmapSkill] = useState(null);

  const jobs = resumeData?.jobRecommendations || [];
  const departments = ['All', ...new Set(jobs.map(j => j.category))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || job.category === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleStartRoadmap = async (skillName) => {
    setSelectedSkill(skillName);

    if (roadmaps[skillName]) {
      setActiveTab('roadmap');
      return;
    }

    setLoadingRoadmapSkill(skillName);
    showToast(`Generating personalized curriculum for ${skillName}...`, 'info');

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ skillName, userProfile: resumeData?.candidate })
      });

      const data = await res.json();
      if (data.success) {
        setRoadmaps(prev => ({
          ...prev,
          [skillName]: data.roadmap
        }));
        showToast(`Curriculum generated! Launching IDE...`, 'success');
        setActiveTab('roadmap');
      }
    } catch (err) {
      showToast('Error generating roadmap: ' + err.message, 'error');
    } finally {
      setLoadingRoadmapSkill(null);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Career Pathways & Competency Matrix</h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {jobs.length} ROLES BENCHMARKED
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Role alignment scored by skill gap algorithms with direct compensation benchmarks and live job feeds.
          </p>
        </div>

        {/* Search & Department Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pathways..."
              className="w-full bg-app-surface border border-app-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-1 bg-app-surface p-1 rounded-lg border border-app-border text-xs">
            {departments.slice(0, 4).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedDept === dept ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="app-panel overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-app-surface border-b border-app-border text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Role Title & Category</th>
                <th className="py-3 px-4">Compatibility Score</th>
                <th className="py-3 px-4">Compensation</th>
                <th className="py-3 px-4">Critical Skill Gaps (Priority)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-app-border">
              {filteredJobs.map((job) => {
                const isTargeted = targetRole?.roleId === job.roleId;
                const linkedInQuery = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.roleTitle)}`;
                const indeedQuery = `https://www.indeed.com/jobs?q=${encodeURIComponent(job.roleTitle)}`;

                return (
                  <tr 
                    key={job.roleId}
                    className={`hover:bg-app-hover/60 transition-colors ${
                      isTargeted ? 'bg-accent-blue/[0.04]' : ''
                    }`}
                  >
                    {/* Role Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        {isTargeted && (
                          <span className="w-2 h-2 rounded-full bg-accent-blue" title="Active Target Role"></span>
                        )}
                        <div>
                          <div className="font-bold text-zinc-100 flex items-center gap-2">
                            <span>{job.roleTitle}</span>
                            {isTargeted && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-blue border border-accent-blue/30 uppercase">
                                Target Role
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{job.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Compatibility Score */}
                    <td className="py-4 px-4">
                      <div className="w-36 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-zinc-200">{job.matchScore}%</span>
                          <span className="text-[10px] text-zinc-500">
                            {job.matchScore >= 80 ? 'Optimal' : job.matchScore >= 60 ? 'Competitive' : 'Stretch'}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              job.matchScore >= 80 ? 'bg-accent-emerald' : job.matchScore >= 60 ? 'bg-accent-amber' : 'bg-accent-rose'
                            }`}
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Compensation */}
                    <td className="py-4 px-4 font-mono font-medium text-accent-emerald">
                      {job.avgSalary}
                    </td>

                    {/* Skill Gaps */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {job.missingSkills.slice(0, 3).map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleStartRoadmap(s)}
                            disabled={loadingRoadmapSkill === s}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-app-surface text-zinc-300 border border-app-border hover:border-accent-blue hover:text-white transition-colors flex items-center gap-1 group"
                            title="Click to generate customized curriculum"
                          >
                            <span>{s}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-zinc-500 group-hover:text-accent-blue" />
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={linkedInQuery}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-[10px] text-zinc-300 border border-zinc-700 flex items-center gap-1 transition-colors"
                          title="Search Live LinkedIn Postings"
                        >
                          <span>LinkedIn</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                        </a>

                        <button
                          onClick={() => {
                            setTargetRole(job);
                            showToast(`Active target role updated to ${job.roleTitle}`, 'success');
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isTargeted
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : 'bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30'
                          }`}
                        >
                          {isTargeted ? 'Active Target' : 'Select Target'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
