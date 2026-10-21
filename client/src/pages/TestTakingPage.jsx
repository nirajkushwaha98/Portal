import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import {
  Timer,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Send,
  Loader2,
  HelpCircle,
} from 'lucide-react';

export const TestTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError, warning } = useToast();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers map: questionId -> selectedOption
  const [answers, setAnswers] = useState({});
  // Set of flagged questionIds
  const [flagged, setFlagged] = useState(new Set());

  // Timer in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestDetails();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/mock-tests/${id}`);
      if (res.data.success) {
        const testData = res.data.test;
        setTest(testData);

        // Initialize timer (e.g. 25 mins = 1500 seconds)
        const durationSec = (testData.durationMinutes || 25) * 60;
        setTimeLeft(durationSec);
        setTotalTime(durationSec);
        startTimeRef.current = Date.now();

        // Start countdown
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleAutoSubmit();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to initialize mock test'));
      navigate('/mock-tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  const handleClearAnswer = (qId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const toggleFlag = (qId) => {
    setFlagged((prev) => {
      const copy = new Set(prev);
      if (copy.has(qId)) {
        copy.delete(qId);
      } else {
        copy.add(qId);
      }
      return copy;
    });
  };

  const handleAutoSubmit = () => {
    warning('Time has expired! Submitting your mock exam automatically...');
    handleSubmitFinal();
  };

  const handleSubmitFinal = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const timeTakenSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

      const formattedAnswers = test.questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] || null,
        timeSpentSeconds: 0,
      }));

      const res = await api.post('/test-attempts/submit', {
        mockTestId: test._id,
        answers: formattedAnswers,
        timeTakenSeconds,
      });

      if (res.data.success) {
        success('Test submitted successfully! Generating scorecard...');
        navigate(`/test-result/${res.data.attempt._id}`, { replace: true });
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Submission error. Please try again.'));
      setSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading || !test) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-sm font-medium text-slate-500">Preparing secure test environment...</p>
      </div>
    );
  }

  const currentQ = test.questions[currentIndex];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flagged.size;

  const isTimeCritical = timeLeft < 120; // under 2 mins

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Fixed Bar with Timer and Progress */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30">
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-base font-black text-slate-900 truncate max-w-md">
            {test.title}
          </h2>
          <p className="text-xs text-slate-500">
            Question {currentIndex + 1} of {totalQuestions} • Section: <span className="font-semibold text-brand-600">{currentQ?.category}</span>
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-black transition-all ${
              isTimeCritical
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-brand-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Exam
          </button>
        </div>
      </div>

      {/* Main Test Layout: Question Canvas & Palette Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Question Canvas (Left 3 columns) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentQ.topic} ({currentQ.difficulty})
            </span>

            <button
              onClick={() => toggleFlag(currentQ._id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                flagged.has(currentQ._id)
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {flagged.has(currentQ._id) ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          {/* Statement */}
          <div className="space-y-4">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-black">
              Q{currentIndex + 1}
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
              {currentQ.title}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ._id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQ._id, opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-950 font-bold shadow-sm shadow-brand-500/10'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="mt-0.5 text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleClearAnswer(currentQ._id)}
              disabled={!answers[currentQ._id]}
              className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Clear Response
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                disabled={currentIndex === totalQuestions - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar (Right 1 column) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Question Palette
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Jump directly to any question</p>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 pb-3 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span> Answered ({answeredCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200"></span> Unanswered ({unansweredCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400"></span> Marked ({flaggedCount})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md border-2 border-brand-600"></span> Current
            </span>
          </div>

          {/* Palette Button Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
            {test.questions.map((q, idx) => {
              const isCurrent = currentIndex === idx;
              const isAnswered = !!answers[q._id];
              const isFlagged = flagged.has(q._id);

              let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
              if (isFlagged) {
                btnStyle = 'bg-amber-400 text-amber-950 font-bold';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-600 text-white font-bold';
              }

              if (isCurrent) {
                btnStyle += ' ring-2 ring-brand-600 ring-offset-2';
              }

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Instructions Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Exam Instructions:</p>
            <ul className="list-disc pl-3.5 space-y-0.5">
              <li>Automatic submission on timer zero.</li>
              <li>You can revise responses at any time.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Mock Assessment"
      >
        <div className="space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to finalize and submit your test? Here is your session summary:
          </p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-2xl font-black text-emerald-700">{answeredCount}</p>
              <p className="text-xs font-semibold text-emerald-800">Answered</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-2xl font-black text-slate-700">{unansweredCount}</p>
              <p className="text-xs font-semibold text-slate-800">Unanswered</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-2xl font-black text-amber-700">{flaggedCount}</p>
              <p className="text-xs font-semibold text-amber-800">Review Flags</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Resume Test
            </button>
            <button
              onClick={handleSubmitFinal}
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Score...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Submit
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
