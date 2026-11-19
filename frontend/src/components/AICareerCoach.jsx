import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Lightbulb, 
  HelpCircle, 
  Code2, 
  Briefcase,
  ChevronDown
} from 'lucide-react';

const QUICK_PROMPTS = [
  { icon: HelpCircle, text: "Ask me a realistic technical interview question" },
  { icon: Code2, text: "Explain core architecture patterns with a code example" },
  { icon: Briefcase, text: "Suggest a standout portfolio capstone project" },
  { icon: Lightbulb, text: "How should I bulletize this skill for ATS?" }
];

export default function AICareerCoach() {
  const { 
    showAICoach, 
    setShowAICoach, 
    selectedSkill, 
    targetRole, 
    resumeData, 
    apiKey 
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'coach',
      text: `Hello! I'm your **AI Career Coach & Technical Mentor**.\n\nI can help you master **${selectedSkill}**, prepare for **${targetRole ? targetRole.roleTitle : 'Full Stack Developer'}** interviews, or suggest production capstone projects. How can I help you today?`
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showAICoach) {
      scrollToBottom();
    }
  }, [messages, showAICoach]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: query.trim(),
          context: {
            selectedSkill,
            targetRole,
            experienceLevel: resumeData?.candidate?.experienceLevel || 'Intermediate'
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `coach_${Date.now()}`,
            sender: 'coach',
            text: data.reply,
            source: data.source
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sender: 'coach',
            text: "I encountered a hiccup processing your request. Please try again!"
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'coach',
          text: "Network error connecting to AI coach. Make sure the backend server is active."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!showAICoach && (
        <button
          onClick={() => setShowAICoach(true)}
          className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-xl bg-app-card border border-app-border hover:border-zinc-700 text-zinc-200 text-xs font-semibold shadow-xl hover:bg-app-hover transition-all flex items-center gap-2 group"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-accent-blue" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-emerald rounded-full"></span>
          </div>
          <span>AI Career Coach</span>
        </button>
      )}

      {/* Slide-Over Drawer */}
      {showAICoach && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-app-surface border-l border-app-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-4 border-b border-app-border bg-app-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>AI Career Mentor</span>
                    <span className="w-2 h-2 rounded-full bg-accent-emerald"></span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">Context: {selectedSkill}</span>
                </div>
              </div>

              <button
                onClick={() => setShowAICoach(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-app-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Role Pill */}
            <div className="px-4 py-2 bg-app-surface border-b border-app-border text-[10px] font-mono text-zinc-400 flex items-center justify-between">
              <span>TARGET: {targetRole ? targetRole.roleTitle : 'Full Stack Developer'}</span>
              <span className="text-accent-blue font-bold">{selectedSkill}</span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'coach' && (
                    <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 text-accent-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-accent-blue text-white rounded-tr-none shadow-sm'
                        : 'bg-app-card border border-app-border text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                    {m.source && (
                      <span className="text-[9px] text-zinc-500 font-mono block mt-2 pt-1 border-t border-app-border">
                        Engine: {m.source}
                      </span>
                    )}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 border border-zinc-700">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 items-center text-zinc-400">
                  <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-accent-blue" />
                  </div>
                  <div className="p-3 rounded-xl bg-app-card border border-app-border text-[11px] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
                    <span>AI Mentor formulating response...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-3 border-t border-app-border bg-app-surface/60">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider block mb-2">
                Quick Prompts
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.text)}
                    className="p-2 rounded-lg bg-app-card border border-app-border hover:border-zinc-700 text-left text-[10px] text-zinc-300 transition-colors flex items-center gap-1.5 line-clamp-1"
                  >
                    <p.icon className="w-3 h-3 text-accent-blue flex-shrink-0" />
                    <span className="truncate">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-app-border bg-app-surface">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={`Ask anything about ${selectedSkill}...`}
                  className="flex-1 bg-app-card border border-app-border rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                />
                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="p-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
