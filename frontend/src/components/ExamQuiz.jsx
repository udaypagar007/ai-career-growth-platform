import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  FileCheck, 
  Clock, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function ExamQuiz() {
  const { selectedSkill, recordExamResult, setViewCertificateModal, setActiveTab, resumeData } = useApp();
  const [examData, setExamData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Fetch Exam Questions on load
  useEffect(() => {
    fetchExamQuestions();
  }, [selectedSkill]);

  const fetchExamQuestions = async () => {
    setLoading(true);
    setEvaluation(null);
    setUserAnswers({});
    setCurrentQuestionIdx(0);

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
      console.error('Failed to fetch exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitExam = async () => {
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
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit exam:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto mb-4"></div>
        <h2 className="text-lg font-bold text-white">Generating AI Skill Exam for {selectedSkill}...</h2>
        <p className="text-xs text-slate-400 mt-1">Preparing customized multiple-choice and scenario questions.</p>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-slate-400">Failed to load exam questions.</p>
        <button onClick={fetchExamQuestions} className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white">
          Retry
        </button>
      </div>
    );
  }

  const { questions } = examData;
  const currentQ = questions[currentQuestionIdx];
  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  // Render Exam Results after submission
  if (evaluation) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        
        {/* Result Header Card */}
        <div className={`glass-card p-8 text-center border-2 ${
          evaluation.passed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
        }`}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/10">
            {evaluation.passed ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-10 h-10" />
              </div>
            )}
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            {evaluation.passed ? 'Skill Certification Passed! 🎉' : 'Needs Practice'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Exam for <span className="text-sky-400 font-semibold">{evaluation.skillName}</span>
          </p>

          {/* Score gauge */}
          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Score</span>
              <span className={`text-4xl font-extrabold ${evaluation.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {evaluation.scorePercent}%
              </span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Updated Skill Level</span>
              <span className="text-sm font-extrabold text-sky-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                {evaluation.newProficiency}
              </span>
            </div>
          </div>

          {/* Certificate Action */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {evaluation.certificate && (
              <button
                onClick={() => setViewCertificateModal(evaluation.certificate)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View & Download Certificate PDF</span>
              </button>
            )}

            <button
              onClick={fetchExamQuestions}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold flex items-center gap-2"
            >
              <span>Go to User Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="glass-card p-6 border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4">Detailed Answers & Explanations</h3>
          <div className="space-y-4">
            {evaluation.detailedResults.map((res, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs ${
                  res.isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {res.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-white">Question {idx + 1}: {res.isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{res.explanation}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      {/* Quiz Progress Header */}
      <div className="glass-card p-6 border-indigo-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
            AI SKILL EVALUATION EXAM
          </span>
          <h2 className="text-xl font-extrabold text-white mt-0.5">{selectedSkill}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-300">
            Question {currentQuestionIdx + 1} of {questions.length}
          </span>
          <div className="w-32 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Question Box */}
      <div className="glass-card p-6 sm:p-8 border-slate-800 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {currentQuestionIdx + 1}. {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, optIdx) => {
            const isSelected = userAnswers[currentQ.id] === optIdx;

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full text-left p-4 rounded-xl text-xs font-semibold transition-all flex items-start gap-3 border ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border ${
                  isSelected ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-relaxed">{optionText}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={currentQuestionIdx === 0}
            onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 text-xs font-bold"
          >
            Previous
          </button>

          {currentQuestionIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={submitting || !isAllAnswered}
              onClick={handleSubmitExam}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Evaluating AI Score...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Submit Exam ({answeredCount}/{questions.length})</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
