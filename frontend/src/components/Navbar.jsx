import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  Compass, 
  Award, 
  LayoutDashboard, 
  Settings, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Layers, 
  Home
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    resumeData, 
    isLandingView,
    setIsLandingView,
    setShowOptimizerModal, 
    setShowSettingsModal,
    setShowAICoach,
    setShowVerifyModal,
    apiKey
  } = useApp();

  const navItems = [
    { id: 'resume', label: '1. Resume', icon: FileText, badge: resumeData ? 'Parsed' : null },
    { id: 'ats', label: '2. ATS Score', icon: ShieldCheck, disabled: !resumeData },
    { id: 'jobs', label: '3. Job Match', icon: Briefcase, disabled: !resumeData },
    { id: 'skills', label: '4. Gap Skills', icon: Layers, disabled: !resumeData },
    { id: 'roadmap', label: '5. AI Roadmap', icon: Compass, disabled: !resumeData },
    { id: 'exam', label: '6. Exam & Cert', icon: Award, disabled: !resumeData },
    { id: 'dashboard', label: '7. Dashboard', icon: LayoutDashboard }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Badge */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setIsLandingView(true);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Upskill<span className="text-sky-400">AI</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Online Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Workforce Upskilling & Credentialing</p>
            </div>
          </div>

          {/* Workflow Steps Nav (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = !isLandingView && activeTab === item.id;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => {
                    setIsLandingView(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isDisabled
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Landing / Workspace Mode Switcher */}
            <button
              onClick={() => setIsLandingView(!isLandingView)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                isLandingView
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
              }`}
              title="Toggle Landing Page / Workspace"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLandingView ? 'Workspace' : 'Overview'}</span>
            </button>

            {/* Public Certificate Verification Link */}
            <button
              onClick={() => setShowVerifyModal(true)}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              title="Verify Any Issued Certificate"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Credential</span>
            </button>

            {/* AI Career Coach Trigger */}
            <button
              onClick={() => setShowAICoach(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors"
              title="Open AI Career Coach"
            >
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">AI Mentor</span>
            </button>

            {/* Settings Modal */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
              title="Settings & AI Mode"
            >
              <Settings className="w-4 h-4" />
              {apiKey && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full"></span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Workflow Nav */}
        <div className="xl:hidden flex items-center overflow-x-auto py-2 border-t border-slate-800/50 gap-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isLandingView && activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => {
                  setIsLandingView(false);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold'
                    : item.disabled
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
