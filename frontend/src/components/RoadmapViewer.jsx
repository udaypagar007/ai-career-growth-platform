import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  FileCheck
} from 'lucide-react';

export default function RoadmapViewer() {
  const { 
    selectedSkill, 
    roadmaps, 
    toggleTopicCompletion, 
    setActiveTab, 
    skillRatings 
  } = useApp();

  const roadmap = roadmaps[selectedSkill];

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">No Roadmap Generated Yet</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">Please select a skill from the recommendations list to generate an AI roadmap.</p>
        <button
          onClick={() => setActiveTab('skills')}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-white font-semibold text-xs"
        >
          Select Skill & Generate Roadmap
        </button>
      </div>
    );
  }

  // Calculate overall roadmap progress percentage
  let totalTopics = 0;
  let completedTopics = 0;

  roadmap.modules.forEach(mod => {
    mod.topics.forEach(t => {
      totalTopics += 1;
      if (t.completed) completedTopics += 1;
    });
  });

  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const existingScore = skillRatings[selectedSkill] || null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Step 4 of 5: Personalized AI Learning Roadmap</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{roadmap.skillName}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{roadmap.description}</p>
            
            {/* Meta Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-sky-400" />
                Est. {roadmap.estimatedHours} Hours
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Layers className="w-4 h-4 text-indigo-400" />
                {roadmap.modules.length} Modules
              </span>
              {existingScore !== null && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Award className="w-4 h-4" />
                  Exam Score: {existingScore}%
                </span>
              )}
            </div>
          </div>

          {/* Progress gauge card */}
          <div className="glass-card p-4 border-slate-800 text-center min-w-[200px] flex-shrink-0">
            <div className="text-xs font-semibold text-slate-400 mb-1">Roadmap Completion</div>
            <div className="text-3xl font-extrabold text-white">{progressPercent}%</div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">{completedTopics} of {totalTopics} topics completed</p>
          </div>

        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>Curriculum Modules & Topics</span>
          </h2>
          <span className="text-xs text-slate-400">Click checkboxes to track your progress</span>
        </div>

        {roadmap.modules.map((module, modIdx) => (
          <div
            key={module.id}
            className={`glass-card p-6 border-slate-800/80 transition-all ${
              module.completed ? 'border-emerald-500/40 bg-emerald-950/10' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border ${
                  module.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                  0{modIdx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{module.title}</h3>
                  <span className="text-xs text-slate-400">Est. Duration: {module.estimatedDays}</span>
                </div>
              </div>
            </div>

            {/* Topics Checklist */}
            <div className="space-y-2 mb-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              {module.topics.map((topic) => (
                <label
                  key={topic.id}
                  onClick={() => toggleTopicCompletion(selectedSkill, module.id, topic.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    topic.completed ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-slate-900 text-slate-200'
                  }`}
                >
                  {topic.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs font-medium leading-normal ${topic.completed ? 'line-through opacity-80' : ''}`}>
                    {topic.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Hands-on Exercise */}
            {module.exercise && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-start gap-3">
                <Code2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block">
                    Practical Hands-on Project Exercise:
                  </span>
                  <p className="text-slate-300 mt-0.5">{module.exercise}</p>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Recommended Resources */}
      {roadmap.recommendedResources && (
        <div className="glass-card p-6 border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>AI Recommended Resources</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roadmap.recommendedResources.map((res, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-indigo-400 uppercase block">{res.type}</span>
                <span className="font-semibold text-slate-200 mt-1 block">{res.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Certification Exam Banner */}
      <div className="glass-card p-6 border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Ready to Validate Your Mastery?</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Take the AI Certification Exam for <span className="text-sky-400 font-semibold">{roadmap.skillName}</span> to earn a verifiable digital badge!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('exam')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Take AI Exam & Earn Certificate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
