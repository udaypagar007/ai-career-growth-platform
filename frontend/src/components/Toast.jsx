import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast || !toast.visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-md ${
        toast.type === 'success'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : toast.type === 'error'
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : 'bg-slate-900/90 border-sky-500/40 text-sky-200'
      }`}>
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
