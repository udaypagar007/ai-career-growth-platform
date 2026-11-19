import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Compass, 
  Award, 
  Zap, 
  ChevronRight,
  Target,
  Layers,
  Terminal,
  Code2
} from 'lucide-react';

export default function LandingHero() {
  const { setIsLandingView, setActiveTab, loadGuestDemo } = useApp();

  return (
    <div className="relative overflow-hidden pt-12 pb-24 bg-app-bg">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-app-surface border border-app-border text-zinc-300 text-xs font-mono font-medium hover:border-zinc-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-accent-emerald"></span>
            <span className="text-zinc-400">STUDIO v2.5:</span>
            <span className="text-zinc-200">Real-Time ATS Screening & Curricula IDE</span>
            <ChevronRight className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Upskill Your Technical Career with Precision AI Roadmaps.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            The multi-studio engineering environment designed to diagnose ATS skill gaps, benchmark candidate compatibility, follow adaptive curricula, and issue verifiable credentials.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setIsLandingView(false);
                setActiveTab('resume');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <FileText className="w-4 h-4" />
              <span>Open Resume & ATS Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => loadGuestDemo('alex')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-app-surface hover:bg-app-hover text-zinc-200 border border-app-border hover:border-zinc-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
              <span>Launch Live Workspace (1-Click Demo)</span>
            </button>
          </div>

          {/* Trust Metrics Row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-zinc-400 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
              <span>Offline Dual-Engine Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
              <span>4-Factor ATS Parsing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-accent-amber" />
              <span>Cryptographic Audit Hashes</span>
            </div>
          </div>
        </div>

        {/* Live Studio Workspace Mockup */}
        <div className="mt-14 max-w-5xl mx-auto rounded-xl bg-app-surface border border-app-border shadow-2xl overflow-hidden">
          
          {/* Mockup Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-app-card border-b border-app-border text-xs">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">upskill-ai/workspace/alex-turner</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded">
              ENVIRONMENT READY
            </span>
          </div>

          {/* Mockup Body Content */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-app-bg">
            
            {/* ATS Scorecard Block */}
            <div className="app-panel p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>ATS SCORECARD</span>
                <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
              </div>
              <div className="text-3xl font-black font-mono text-white tabular">
                88<span className="text-xs text-zinc-500">/100</span>
              </div>
              <span className="text-xs font-bold text-accent-emerald block">
                High ATS Pass Probability
              </span>
              <p className="text-[11px] text-zinc-400 border-t border-app-border pt-2 leading-relaxed">
                Extracted: React, TypeScript, Node.js, REST APIs, SQL, Docker.
              </p>
            </div>

            {/* Target Role Block */}
            <div className="app-panel p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>BENCHMARK MATCH</span>
                <Target className="w-3.5 h-3.5 text-accent-blue" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Full Stack Web Developer</h4>
                <span className="text-xs font-mono font-semibold text-accent-emerald mt-0.5 block">$115,000 / yr avg.</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-accent-blue h-full w-[94%]"></div>
              </div>
              <p className="text-[11px] text-zinc-400 border-t border-app-border pt-2">
                Gap Recommendation: RAG & Vector Databases
              </p>
            </div>

            {/* Verifiable Credential Block */}
            <div className="app-panel p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>VERIFIABLE CREDENTIAL</span>
                <Award className="w-3.5 h-3.5 text-accent-amber" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">TypeScript Certified</h4>
                <span className="text-[10px] font-mono text-zinc-500 block">ID: CERT-DEMO-TS99</span>
              </div>
              <span className="text-xs font-mono font-bold text-accent-emerald flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Score: 100% &bull; Officially Verified
              </span>
              <p className="text-[11px] text-zinc-400 border-t border-app-border pt-2 flex items-center justify-between">
                <span>Cryptographic Hash</span>
                <span className="text-accent-blue font-semibold hover:underline">Verify &rarr;</span>
              </p>
            </div>

          </div>

        </div>

        {/* 4 Multi-Studio Modules Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="app-panel p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">1. Resume & ATS Studio</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Side-by-side red/green diff optimizer to transform duties into metrics matching recruiter filters.
            </p>
          </div>

          <div className="app-panel p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">2. Career Pathways Matrix</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Data table sorting salary deltas, priority gaps, and direct search queries on LinkedIn and Indeed.
            </p>
          </div>

          <div className="app-panel p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">3. Curriculum IDE</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              3-column learning studio with chapter trees, technical code guides, and milestone lab projects.
            </p>
          </div>

          <div className="app-panel p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white">4. Assessment Arena</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Proctored exam environment with hotkeys, instant scoring, and public verification hashes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
