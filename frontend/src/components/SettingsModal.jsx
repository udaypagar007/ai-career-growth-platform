import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Settings, Key, CheckCircle2, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';

export default function SettingsModal() {
  const { showSettingsModal, setShowSettingsModal, apiKey, setApiKey } = useApp();
  const [inputKey, setInputKey] = useState(apiKey);
  const [statusMsg, setStatusMsg] = useState(null);
  const [testing, setTesting] = useState(false);

  if (!showSettingsModal) return null;

  const verifyKey = async () => {
    if (!inputKey.trim()) {
      setApiKey('');
      setStatusMsg({ type: 'info', text: 'Using Built-in Smart NLP AI Engine (Default).' });
      return;
    }

    setTesting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/settings/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: inputKey })
      });

      const data = await res.json();
      if (data.valid) {
        setApiKey(inputKey);
        setStatusMsg({ type: 'success', text: data.message });
      } else {
        setStatusMsg({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to verify key: ' + err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-app-surface rounded-xl border border-app-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-app-card">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-accent-blue" />
            <h2 className="text-sm font-bold text-white tracking-tight">Platform Settings & AI Engine</h2>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-app-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <div className="p-4 rounded-xl bg-app-card border border-app-border space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <Cpu className="w-4 h-4 text-accent-blue" />
              <span>Dual-Engine AI Architecture</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The platform features an offline heuristic NLP engine that functions out-of-the-box without requiring API keys. Optionally, connect your Google Gemini API key to enable live generative AI responses.
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5 text-xs">
              <Key className="w-3.5 h-3.5 text-accent-amber" />
              <span>Google Gemini API Key (Optional)</span>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste AIzaSy... (leave blank for local engine)"
              className="w-full bg-app-card border border-app-border rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs font-mono ${
              statusMsg.type === 'success'
                ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald'
                : statusMsg.type === 'error'
                ? 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-app-border bg-app-card flex items-center justify-between">
          <button
            onClick={() => {
              setInputKey('');
              setApiKey('');
              setStatusMsg({ type: 'info', text: 'API Key cleared. Using built-in engine.' });
            }}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
          >
            Reset to Local
          </button>

          <button
            disabled={testing}
            onClick={verifyKey}
            className="px-4 py-2 rounded-lg bg-accent-blue text-white font-bold text-xs hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {testing ? 'Testing...' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  );
}
