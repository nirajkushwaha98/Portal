import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Sparkles,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

export const TestResultPage = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/test-attempts/${attemptId}`);
      if (res.data.success) {
        setAttempt(res.data.attempt);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load test attempt scorecard'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="h-40 bg-slate-200 rounded-3xl animate-pulse"></div>
        <CardSkeleton count={3} />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-sm text-rose-600 font-semibold">{error || 'Scorecard not found'}</p>
        <Link to="/mock-tests" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Mock Tests
        </Link>
      </div>
    );
  }

  const { mockTest, answers, score, totalMarks, percentage, passed, timeTakenSeconds, categoryBreakdown } = attempt;

  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.filter((a) => a.selectedOption && !a.isCorrect).length;
  const unattemptedCount = answers.filter((a) => !a.selectedOption).length;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/mock-tests"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Mock Tests
        </Link>
      </div>

      {/* Hero Scorecard Banner */}
      <div
        className={`rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border ${
          passed
            ? 'bg-gradient-to-tr from-navy-950 via-emerald-950 to-brand-950 border-emerald-500/30'
            : 'bg-gradient-to-tr from-navy-950 via-slate-900 to-rose-950 border-rose-500/30'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Official Diagnostic Scorecard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {mockTest?.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {passed
                ? 'Congratulations! You have satisfied the qualifying cutoff for this campus assessment round.'
                : 'Cutoff not reached. Review the step-by-step solutions below to master these concepts.'}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md min-w-[190px]">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {percentage}%
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-1">
              {score} / {totalMarks} Marks
            </span>
            <span
              className={`mt-2.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {passed ? 'Cutoff Qualified' : 'Cutoff Not Met'}
            </span>
          </div>
        </div>

        {/* Breakdown Pills */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Correct</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{correctCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</p>
            <p className="text-lg font-black text-rose-400 mt-0.5">{incorrectCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Unattempted</p>
            <p className="text-lg font-black text-slate-300 mt-0.5">{unattemptedCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Time Spent</p>
            <p className="text-lg font-black text-slate-200 mt-0.5">
              {mins}m {secs}s
            </p>
          </div>
        </div>
      </div>

      {/* Section-Wise Diagnostic Breakdown */}
      {categoryBreakdown && categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" /> Sectional Accuracy & Pacing Breakdown
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{cat.category}</span>
                  <span className="text-xs font-black text-brand-600">{cat.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{ width: `${cat.accuracy}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500">
                  {cat.correct} of {cat.total} questions correct
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-600" /> Detailed Question Solutions & Explanations
        </h2>

        <div className="space-y-6">
          {answers.map((item, idx) => {
            const q = item.question;
            if (!q) return null;

            const isCorrect = item.isCorrect;
            const isUnattempted = !item.selectedOption;

            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm space-y-5 ${
                  isCorrect
                    ? 'border-emerald-200'
                    : isUnattempted
                    ? 'border-slate-200'
                    : 'border-rose-200'
                }`}
              >
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{q.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">{q.topic}</span>
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : isUnattempted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        Unattempted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Title */}
                <p className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                  {q.title}
                </p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isStudentChoice = item.selectedOption === opt.id;
                    const isRightOption = q.correctOption === opt.id;

                    let optBg = 'bg-slate-50 border-slate-200 text-slate-700';

                    if (isRightOption) {
                      optBg = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isStudentChoice && !isRightOption) {
                      optBg = 'bg-rose-50 border-rose-300 text-rose-950 font-semibold line-through';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${optBg}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-white/80 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {opt.id}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                        {isRightOption && (
                          <span className="text-[10px] font-bold text-emerald-700 uppercase bg-white px-2 py-0.5 rounded-md">
                            Correct
                          </span>
                        )}
                        {isStudentChoice && !isRightOption && (
                          <span className="text-[10px] font-bold text-rose-700 uppercase bg-white px-2 py-0.5 rounded-md">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-brand-600" /> Explanation & Solution Logic
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-line">
                      {q.explanation}
                    </p>
                  </div>

                  {q.formulaTip && (
                    <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Formula / Speed Tip: </span>
                        <span>{q.formulaTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
