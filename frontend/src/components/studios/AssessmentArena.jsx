import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Share2, 
  Check, 
  FileCheck,
  AlertCircle
} from 'lucide-react';

export default function AssessmentArena() {
  const { 
    selectedSkill, 
    recordExamResult, 
    setViewCertificateModal, 
    setActiveTab, 
    resumeData,
    showToast 
  } = useApp();

  const [examData, setExamData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins

  useEffect(() => {
    if (evaluation || loading) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [evaluation, loading]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchExam();
  }, [selectedSkill]);

  const fetchExam = async () => {
    setLoading(true);
    setEvaluation(null);
    setUserAnswers({});
    setCurrentIdx(0);

    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName: selectedSkill })
      });
      const data = await res.json();
      if (data.success) {
        setExamData(data.exam);
      }
    } catch (err) {
      console.error('Failed to load exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Keyboard shortcut listener for options A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!examData || evaluation) return;
      const key = e.key.toUpperCase();
      const currentQ = examData.questions[currentIdx];
      if (!currentQ) return;

      if (['A', 'B', 'C', 'D'].includes(key)) {
        const optIdx = key.charCodeAt(0) - 65;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examData, currentIdx, evaluation]);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const res = await fetch('/api/exam/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: selectedSkill,
          userAnswers,
          candidateName: resumeData?.candidate?.name || 'Candidate Professional'
        })
      });

      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        recordExamResult(data.evaluation);

        if (data.evaluation.passed) {
          confetti({
            particleCount: 90,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      showToast('Error evaluating exam: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyVerificationLink = () => {
    if (!evaluation?.certificate) return;
    const url = `${window.location.origin}/?verify=${evaluation.certificate.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Public credential verification link copied!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-accent-blue animate-spin"></div>
        <div className="text-xs font-mono text-zinc-400">Loading Proctored Skill Assessment for {selectedSkill}...</div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-zinc-500" />
        <div className="text-sm font-bold text-white">No active exam found for {selectedSkill}</div>
        <button onClick={fetchExam} className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-medium text-white">
          Retry Generation
        </button>
      </div>
    );
  }

  const { questions } = examData;
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  /* Evaluation Results Screen */
  if (evaluation) {
    return (
      <div className="max-w-4xl mx-auto h-full overflow-y-auto space-y-6 py-4">
        
        {/* Result Header Panel */}
        <div className="app-panel p-6 text-center space-y-4 border-t-4 border-t-accent-emerald">
          <div className="flex items-center justify-center gap-2 text-accent-emerald text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Examination Audit Report</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {evaluation.passed ? 'Skill Mastery Certified' : 'Assessment Threshold Unreached'}
          </h2>

          <div className="flex items-center justify-center gap-8 py-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Score Achieved</span>
              <span className="text-4xl font-black font-mono text-white tabular">
                {evaluation.scorePercent}%
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Passing Threshold</span>
              <span className="text-4xl font-black font-mono text-zinc-400 tabular">70%</span>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Updated Proficiency</span>
              <span className="text-sm font-bold text-accent-blue font-mono mt-1 block">
                {evaluation.newProficiency}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {evaluation.certificate && (
              <>
                <button
                  onClick={() => setViewCertificateModal(evaluation.certificate)}
                  className="px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Inspect & Download PDF Certificate</span>
                </button>

                <button
                  onClick={copyVerificationLink}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-2 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-accent-emerald" /> : <Share2 className="w-4 h-4 text-zinc-400" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
                </button>
              </>
            )}

            <button
              onClick={fetchExam}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Explanations */}
        <div className="app-panel p-5 space-y-3">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            Question Explanations & Key Technical Standards
          </span>

          <div className="space-y-3">
            {evaluation.detailedResults?.map((res, i) => (
              <div 
                key={i}
                className={`p-3.5 rounded-lg border text-xs ${
                  res.isCorrect ? 'bg-app-surface border-app-border' : 'bg-accent-rose/[0.04] border-accent-rose/20'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {res.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                  ) : (
                    <XCircle className="w-4 h-4 text-accent-rose" />
                  )}
                  <span className="text-white">Question {i + 1}: {res.isCorrect ? 'Passed' : 'Missed'}</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed mt-1">{res.explanation}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  /* Active Question Proctored Arena */
  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col justify-between py-2">
      
      {/* Top Test Banner */}
      <div className="app-panel p-4 flex items-center justify-between border-b border-app-border">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-accent-blue font-bold text-xs">
            {currentIdx + 1}
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight">{selectedSkill} Assessment</div>
            <div className="text-[10px] text-zinc-500 font-mono">Passing Standard: 70% Correct</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
            secondsRemaining < 120 
              ? 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose animate-pulse' 
              : 'bg-zinc-800 border-zinc-700 text-accent-amber font-bold'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
          <span className="text-zinc-400">
            {currentIdx + 1}/{questions.length} Qs
          </span>
          <div className="w-20 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-accent-blue h-full transition-all duration-200"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Center Question Box */}
      <div className="app-panel p-6 my-auto space-y-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
            Question Scenario
          </span>
          <h2 className="text-base font-bold text-white leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Options with Hotkey Indicators */}
        <div className="space-y-2.5">
          {currentQ.options.map((optText, optIdx) => {
            const isSelected = userAnswers[currentQ.id] === optIdx;
            const letter = String.fromCharCode(65 + optIdx);

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full text-left p-3.5 rounded-xl text-xs font-medium transition-all flex items-start gap-3 border ${
                  isSelected
                    ? 'bg-accent-blue/15 border-accent-blue text-white shadow-sm ring-1 ring-accent-blue/50'
                    : 'bg-app-surface border-app-border text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <kbd className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 border ${
                  isSelected
                    ? 'bg-accent-blue text-white border-accent-blue'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {letter}
                </kbd>
                <span className="leading-relaxed">{optText}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-zinc-500 text-center">
          Pro-tip: Press keys <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">A</kbd>, <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">B</kbd>, <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">C</kbd>, <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700">D</kbd> on your keyboard to select options instantly.
        </div>
      </div>

      {/* Navigation Controls Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 disabled:opacity-40 text-xs font-medium transition-colors"
        >
          Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="px-5 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled={submitting || !isAllAnswered}
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-accent-emerald hover:bg-emerald-600 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
          >
            {submitting ? 'Evaluating Standard...' : `Submit Assessment (${answeredCount}/${questions.length})`}
          </button>
        )}
      </div>

    </div>
  );
}
