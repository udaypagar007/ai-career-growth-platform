import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Copy, Check, ArrowRight, Lightbulb } from 'lucide-react';

export default function ResumeOptimizerModal() {
  const { showOptimizerModal, setShowOptimizerModal, resumeData, showToast } = useApp();
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!showOptimizerModal || !resumeData) return null;

  const { resumeBulletTips } = resumeData;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Optimized bullet copied to clipboard!', 'success');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-app-surface rounded-xl border border-app-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-app-card">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <h2 className="text-sm font-bold text-white tracking-tight">AI Resume Bullet Point Optimizer</h2>
          </div>
          <button
            onClick={() => setShowOptimizerModal(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-app-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          <p className="text-zinc-400">
            Transform generic duties into quantified achievements matching fortune 500 ATS keyword filters.
          </p>

          <div className="space-y-4">
            {resumeBulletTips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-app-card border border-app-border space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2 py-0.5 rounded">
                  {tip.category}
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-accent-rose/5 border border-accent-rose/20 text-zinc-300">
                    <span className="font-mono font-bold text-[10px] text-accent-rose uppercase block mb-1">Original Bullet:</span>
                    <p className="line-through text-zinc-400">"{tip.original}"</p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent-emerald/5 border border-accent-emerald/20 text-zinc-100 relative group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[10px] text-accent-emerald uppercase block">AI Recommended Rewrite:</span>
                      <button
                        onClick={() => copyToClipboard(tip.improved, idx)}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-[10px] font-mono font-bold text-zinc-300 flex items-center gap-1 transition-colors border border-zinc-700"
                      >
                        {copiedIdx === idx ? <Check className="w-3 h-3 text-accent-emerald" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="pr-12 text-xs leading-relaxed font-medium">"{tip.improved}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-app-border bg-app-card text-right">
          <button
            onClick={() => setShowOptimizerModal(false)}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs border border-zinc-700"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
