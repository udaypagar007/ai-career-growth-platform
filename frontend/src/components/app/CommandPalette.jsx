import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Award, 
  LayoutDashboard, 
  Bot, 
  Settings, 
  Zap, 
  X,
  User,
  ArrowRight
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const { 
    setActiveTab, 
    setIsLandingView, 
    setShowAICoach, 
    setShowSettingsModal, 
    setShowVerifyModal,
    loadGuestDemo,
    showToast
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', label: 'Go to Overview Dashboard', icon: LayoutDashboard, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('dashboard'); onClose(); } },
    { id: 'resume', label: 'Open Resume & ATS Studio', icon: FileText, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('resume'); onClose(); } },
    { id: 'ats', label: 'View ATS Diagnostic Scorecard', icon: ShieldCheck, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('ats'); onClose(); } },
    { id: 'jobs', label: 'Open Career Pathways & Job Matrix', icon: Briefcase, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('jobs'); onClose(); } },
    { id: 'roadmap', label: 'Open Curriculum IDE & Roadmaps', icon: Compass, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('roadmap'); onClose(); } },
    { id: 'exam', label: 'Take Skill Assessment Exam', icon: Award, category: 'Navigation', action: () => { setIsLandingView(false); setActiveTab('exam'); onClose(); } },
    { id: 'coach', label: 'Ask AI Career Coach / Mentor', icon: Bot, category: 'Actions', action: () => { setShowAICoach(true); onClose(); } },
    { id: 'verify', label: 'Verify Public Credential Hash', icon: ShieldCheck, category: 'Actions', action: () => { setShowVerifyModal(true); onClose(); } },
    { id: 'demo_alex', label: 'Switch Workspace: Alex Turner (Full Stack)', icon: User, category: 'Workspaces', action: () => { loadGuestDemo('alex'); onClose(); } },
    { id: 'settings', label: 'Open Platform Settings & API Keys', icon: Settings, category: 'System', action: () => { setShowSettingsModal(true); onClose(); } },
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-app-surface border border-app-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-app-border gap-3">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to workspace..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-app-card text-zinc-400 px-2 py-0.5 rounded border border-app-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs text-zinc-300 hover:text-white hover:bg-app-hover transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-zinc-400 group-hover:text-accent-blue transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{item.category}</span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching commands or studios found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
