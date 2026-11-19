import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Code2, 
  Award, 
  ArrowRight, 
  Bot, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function CurriculumIDE() {
  const { 
    selectedSkill, 
    roadmaps, 
    toggleTopicCompletion, 
    setActiveTab, 
    setShowAICoach,
    showToast 
  } = useApp();

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const roadmap = roadmaps[selectedSkill] || {
    skillName: selectedSkill || 'RAG & Vector Databases',
    category: 'Artificial Intelligence & LLMs',
    level: 'Intermediate to Advanced',
    estimatedHours: 24,
    description: `Master end-to-end architecture, embeddings, dense retrieval, and hybrid vector indexing for production systems.`,
    modules: [
      {
        id: 'mod_1',
        title: '1. Embeddings & Semantic Search Vector Architecture',
        estimatedDays: '3 Days',
        topics: [
          { id: 't_1_1', title: 'Dense vector representations vs sparse keyword tokens', completed: true },
          { id: 't_1_2', title: 'Cosine similarity vs Euclidean distance metrics', completed: true },
          { id: 't_1_3', title: 'Chunking strategies (semantic, recursive, and token window)', completed: false }
        ],
        exercise: 'Implement semantic chunking and index 500 documents into a vector database with metadata filtering.'
      },
      {
        id: 'mod_2',
        title: '2. Hybrid Retrieval & Orchestration Pipelines',
        estimatedDays: '4 Days',
        topics: [
          { id: 't_2_1', title: 'BM25 sparse search combined with dense vector retrieval', completed: false },
          { id: 't_2_2', title: 'Cross-encoder re-ranking algorithms (Cohere / BGE)', completed: false },
          { id: 't_2_3', title: 'Context window compression and prompt grounding', completed: false }
        ],
        exercise: 'Build a full retrieval pipeline with cross-encoder re-ranking stage achieving <150ms latency.'
      },
      {
        id: 'mod_3',
        title: '3. Production Evaluation, Guardrails & Security',
        estimatedDays: '4 Days',
        topics: [
          { id: 't_3_1', title: 'RAG Triad metrics: Faithfulness, Answer Relevance, Context Recall', completed: false },
          { id: 't_3_2', title: 'Handling hallucinations and automated guardrail filters', completed: false },
          { id: 't_3_3', title: 'Multi-tenant RBAC and vector database credential security', completed: false }
        ],
        exercise: 'Set up an automated RAG evaluation benchmark using Ragas and log faithfulness scores.'
      }
    ]
  };

  const currentModule = roadmap.modules[activeModuleIdx] || roadmap.modules[0];

  // Calculate overall progress
  let totalTopics = 0;
  let completedTopics = 0;
  roadmap.modules.forEach(m => {
    m.topics.forEach(t => {
      totalTopics++;
      if (t.completed) completedTopics++;
    });
  });
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const sampleSnippet = `// Production Vector Search & Retrieval Sample (${roadmap.skillName})
import { QdrantClient } from '@qdrant/js-client-rest';
import { pipeline } from '@xenova/transformers';

export async function hybridRetrieve(query: string, topK: number = 5) {
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const queryVector = await extractor(query, { pooling: 'mean', normalize: true });

  const client = new QdrantClient({ url: 'http://localhost:6333' });
  const results = await client.search('tech_documents', {
    vector: Array.from(queryVector.data),
    limit: topK,
    with_payload: true,
  });

  return results.map(hit => ({
    id: hit.id,
    score: hit.score,
    content: hit.payload?.text,
    metadata: hit.payload?.metadata
  }));
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(sampleSnippet);
    setCopiedCode(true);
    showToast('Code snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-app-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{roadmap.skillName}</h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {roadmap.level}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{roadmap.description}</p>
          </div>
        </div>

        {/* Global Progress & Exam Launch Action */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono">Progress:</span>
            <span className="font-mono font-bold text-accent-emerald">{progressPercent}%</span>
            <div className="w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-accent-emerald h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('exam')}
            className="px-3.5 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Launch Certification Exam</span>
          </button>
        </div>
      </div>

      {/* 3-Column IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Column 1: Module & Chapter Tree Explorer (~3 Columns) */}
        <div className="lg:col-span-3 app-panel p-3 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
                Curriculum Modules
              </span>
              <span className="text-[10px] font-mono text-zinc-400">{roadmap.modules.length} Chapters</span>
            </div>

            <div className="space-y-1.5">
              {roadmap.modules.map((mod, idx) => {
                const isActive = activeModuleIdx === idx;
                const doneCount = mod.topics.filter(t => t.completed).length;

                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIdx(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      isActive
                        ? 'bg-app-hover border-accent-blue/40 text-white'
                        : 'bg-app-surface border-app-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate">{mod.title}</span>
                      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-accent-blue' : 'text-zinc-600'}`} />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-500 font-mono">
                      <span>{mod.estimatedDays}</span>
                      <span>{doneCount}/{mod.topics.length} Done</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checklist of current module */}
          <div className="border-t border-app-border pt-3 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block px-1">
              Chapter Checklist
            </span>
            <div className="space-y-1">
              {currentModule.topics.map((topic) => (
                <label
                  key={topic.id}
                  onClick={() => toggleTopicCompletion(selectedSkill, currentModule.id, topic.id)}
                  className={`flex items-start gap-2 p-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                    topic.completed ? 'text-zinc-400 line-through' : 'text-zinc-200 hover:bg-app-hover'
                  }`}
                >
                  {topic.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-tight">{topic.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Technical Reading & Documentation (~5 Columns) */}
        <div className="lg:col-span-5 app-panel p-5 overflow-y-auto space-y-4">
          <div className="border-b border-app-border pb-3">
            <span className="text-[10px] font-mono uppercase font-bold text-accent-blue tracking-wider">
              Technical Syllabus & Architectural Guide
            </span>
            <h2 className="text-base font-bold text-white mt-1">{currentModule.title}</h2>
          </div>

          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <p>
              In this chapter, you master the core mechanisms of <strong className="text-white">{roadmap.skillName}</strong>. Modern enterprise architectures require low-latency indexing, fault-tolerant vector pipelines, and hybrid fallback strategies.
            </p>

            <div className="p-3.5 rounded-lg bg-app-surface border border-app-border space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                Key Architectural Takeaways:
              </span>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-zinc-300">
                <li>Always normalize vector representations prior to calculating cosine distance.</li>
                <li>Implement semantic chunking with overlapping windows to prevent loss of context across section breaks.</li>
                <li>Combine dense similarity with sparse BM25 indexing for domain-specific jargon or serial IDs.</li>
              </ul>
            </div>

            {/* Code Block */}
            <div className="rounded-lg bg-app-surface border border-app-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-app-border text-[10px] font-mono text-zinc-400">
                <span>implementation.ts</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-accent-emerald" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono text-zinc-200 overflow-x-auto leading-normal">
                {sampleSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Column 3: Project Sandbox & Hands-On Lab (~4 Columns) */}
        <div className="lg:col-span-4 app-panel p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-app-border pb-3">
              <span className="text-[10px] font-mono uppercase font-bold text-accent-amber tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Hands-On Milestone Lab</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Exercise</span>
            </div>

            <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Deliverable Requirement:
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {currentModule.exercise}
              </p>
            </div>

            <div className="space-y-2 text-xs text-zinc-400">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Lab Evaluation Checklist:
              </span>
              <div className="p-3 rounded-lg bg-zinc-900/50 border border-app-border space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span>
                  <span>Unit tests covering chunk boundaries</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span>
                  <span>Average search latency benchmark &lt; 150ms</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue"></span>
                  <span>Metadata filter assertions validated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Mentor Assistant Action */}
          <div className="pt-4 border-t border-app-border space-y-2">
            <button
              onClick={() => setShowAICoach(true)}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-accent-blue" />
              <span>Ask AI Coach for Exercise Hints</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className="w-full py-2 px-3 rounded-lg bg-accent-blue/15 hover:bg-accent-blue/25 text-xs font-semibold text-accent-blue border border-accent-blue/30 flex items-center justify-center gap-2 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Take Assessment & Earn Credential</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
