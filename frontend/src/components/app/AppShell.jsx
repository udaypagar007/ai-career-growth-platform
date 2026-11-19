import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CommandPalette from './CommandPalette';
import { 
  Zap, 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Award, 
  Bot, 
  Settings, 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  ExternalLink,
  User,
  CheckCircle2,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export default function AppShell({ children }) {
  const { 
    activeTab, 
    setActiveTab, 
    resumeData, 
    targetRole, 
    selectedSkill,
    certificates,
    setShowAICoach,
    setShowSettingsModal,
    setShowVerifyModal,
    setShowOptimizerModal,
    loadGuestDemo,
    apiKey,
    theme,
    setTheme
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const candidateName = resumeData?.candidate?.name || 'Guest Candidate';
  const roleTitle = targetRole?.roleTitle || 'Full Stack Web Developer';
  const candidateInitials = candidateName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CP';

  const navGroups = [
    {
      group: 'STUDIOS',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
        { id: 'resume', label: 'Resume & ATS Studio', icon: FileText, badge: resumeData?.atsScorecard ? `${resumeData.atsScorecard.overallATS}` : null },
        { id: 'jobs', label: 'Career Pathways', icon: Briefcase, badge: resumeData?.jobRecommendations?.length ? `${resumeData.jobRecommendations.length}` : null },
        { id: 'roadmap', label: 'Curriculum IDE', icon: Compass, badge: null },
        { id: 'exam', label: 'Skill Assessments', icon: Award, badge: null },
        { id: 'vault', label: 'Credential Vault', icon: ShieldCheck, badge: certificates?.length ? `${certificates.length}` : '1' },
      ]
    },
    {
      group: 'AI ASSISTANTS',
      items: [
        { id: 'coach_trigger', label: 'Career Mentor AI', icon: Bot, action: () => setShowAICoach(true) },
        { id: 'optimizer_trigger', label: 'Bullet Optimizer', icon: Sparkles, action: () => setShowOptimizerModal(true) },
        { id: 'verify_trigger', label: 'Credential Registry', icon: ShieldCheck, action: () => setShowVerifyModal(true) }
      ]
    }
  ];

  // Map activeTab to breadcrumb title
  const tabTitles = {
    dashboard: 'Overview Dashboard',
    resume: 'Resume & ATS Diagnostic Studio',
    ats: 'ATS Scorecard Analysis',
    jobs: 'Career Pathways & Role Matrix',
    skills: 'Skill Gap Explorer',
    roadmap: `Curriculum IDE / ${selectedSkill}`,
    exam: `Assessment Arena / ${selectedSkill}`,
    vault: 'Credential Vault & Audit Ledger'
  };

  return (
    <div className="flex h-screen bg-app-bg text-zinc-200 overflow-hidden font-sans">
      
      {/* 1. Left Persistent Sidebar */}
      <aside 
        className={`bg-app-sidebar border-r border-app-border flex flex-col justify-between transition-all duration-200 relative select-none z-30 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div>
          {/* App Brand Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-app-border">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 text-accent-blue" />
                </div>
                <div className="leading-none">
                  <span className="font-extrabold text-sm text-white tracking-tight">Upskill<span className="text-accent-blue">AI</span></span>
                  <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">STUDIO v2.4</span>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 text-accent-blue" />
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-app-hover transition-colors"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Workspace / Candidate Context Box */}
          {!isSidebarCollapsed && (
            <div className="p-3 border-b border-app-border relative">
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="w-full p-2 rounded-lg bg-app-surface border border-app-border hover:border-zinc-700 transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/15 border border-accent-blue/30 text-accent-blue font-bold font-mono text-xs flex items-center justify-center flex-shrink-0">
                    {candidateInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-200 truncate">{candidateName}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{roleTitle}</div>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
              </button>

              {/* Workspace Switcher Popover */}
              {showWorkspaceMenu && (
                <div className="absolute top-16 left-3 right-3 bg-app-surface border border-app-border rounded-xl shadow-2xl p-2 z-40 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-1">Switch Workspace Context</div>
                  <button
                    onClick={() => { loadGuestDemo('alex'); setShowWorkspaceMenu(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-app-hover text-xs text-zinc-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent-emerald"></span>
                    <span>Alex Turner (Full Stack Dev)</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('resume'); setShowWorkspaceMenu(false); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-app-hover text-xs text-zinc-300 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Upload New Resume PDF</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Items */}
          <nav className="p-2 space-y-5">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-3 text-[10px] font-mono font-semibold text-zinc-500 tracking-wider">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          setActiveTab(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-accent-blue/15 text-white border border-accent-blue/30 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-app-hover'
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-zinc-400'}`} />
                      {!isSidebarCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & Settings */}
        <div className="p-3 border-t border-app-border space-y-2">
          {!isSidebarCollapsed ? (
            <div className="p-2 rounded-lg bg-app-surface border border-app-border flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-accent-blue animate-pulse' : 'bg-accent-emerald'}`}></span>
                <span className="text-zinc-400">{apiKey ? 'Gemini 1.5 Active' : 'Local NLP Engine'}</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="text-zinc-500 hover:text-zinc-300"
                title="Engine Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex justify-center p-2 rounded-lg hover:bg-app-hover text-zinc-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Work Area: Top Header Bar + Studio Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-14 bg-app-surface border-b border-app-border px-6 flex items-center justify-between flex-shrink-0">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">UpskillAI</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200 font-semibold">{tabTitles[activeTab] || 'Workspace'}</span>
          </div>

          {/* Center Search / Command Palette Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-app-card border border-app-border hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-colors w-72 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search commands, skills...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVerifyModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-accent-amber" />
              <span>Verify Credential</span>
            </button>

            {/* Theme Toggle: Light / Dark / System */}
            <div className="hidden sm:flex items-center bg-app-surface border border-app-border rounded-lg p-0.5 text-xs" title="Toggle theme">
              {[
                { key: 'light',  Icon: Sun,     label: 'Light'  },
                { key: 'dark',   Icon: Moon,    label: 'Dark'   },
                { key: 'system', Icon: Monitor, label: 'System' },
              ].map(({ key, Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  title={`${label} theme`}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all ${
                    theme === key
                      ? 'bg-app-card text-zinc-200 shadow-sm border border-app-border'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAICoach(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue text-xs font-semibold border border-accent-blue/30 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Coach</span>
            </button>
          </div>
        </header>

        {/* Studio View Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-app-bg p-6">
          {children}
        </main>

      </div>

      {/* Global Command Palette Dialog */}
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={(action) => {
          if (action === true) setIsCommandOpen(true);
          else setIsCommandOpen(false);
        }} 
      />

    </div>
  );
}
