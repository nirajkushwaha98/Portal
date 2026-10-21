import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api/client';
import { DifficultyBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import {
  BrainCircuit,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const AptitudePracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // User state for active practice: map of questionId -> selectedOption
  const [userAnswers, setUserAnswers] = useState({});
  // Set of questionIds where user clicked "Check Answer"
  const [revealedQuestions, setRevealedQuestions] = useState(new Set());

  // Modal explanation state
  const [explanationModal, setExplanationModal] = useState({ isOpen: false, question: null });

  const categoryList = [
    'All',
    'Quantitative',
    'Logical Reasoning',
    'Verbal Ability',
    'Core CS Fundamentals',
  ];

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };

      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.questions);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  const handleSelectOption = (qId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  const toggleRevealAnswer = (qId) => {
    setRevealedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
          <BrainCircuit className="w-3.5 h-3.5" /> High-Yield Placement Question Bank
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Aptitude & Technical Practice Arena
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Sharpen your mental speed and accuracy. Select an answer to evaluate your response, view formulas, and read verified solutions.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or topics..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 text-slate-900"
          />
        </form>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-700"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions found"
          description="Try selecting a different category or clearing your search query."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSelectedDifficulty('All');
            setSearch('');
          }}
        />
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isRevealed = revealedQuestions.has(q._id);
            const selectedOpt = userAnswers[q._id];
            const isAnswered = !!selectedOpt;

            return (
              <div
                key={q._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover space-y-5"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      Q{(page - 1) * 10 + qIndex + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{q.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-500">{q.topic}</span>
                  </div>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>

                {/* Question Statement */}
                <p className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                  {q.title}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    const isCorrect = q.correctOption === opt.id;

                    let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';

                    if (isRevealed) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-medium';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-brand-50 border-brand-400 text-brand-900 font-semibold';
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q._id, opt.id)}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {opt.id}
                        </span>
                        <span className="flex-1 mt-0.5 leading-snug">{opt.text}</span>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRevealAnswer(q._id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        isRevealed
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-brand-600 text-white hover:bg-brand-700 shadow-xs'
                      }`}
                    >
                      {isRevealed ? 'Hide Answer' : 'Check Answer'}
                    </button>

                    <button
                      onClick={() => setExplanationModal({ isOpen: true, question: q })}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                      View Explanation & Tips
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="text-xs font-bold">
                      {selectedOpt === q.correctOption ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                        </span>
                      ) : selectedOpt ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect (Option {q.correctOption} is correct)
                        </span>
                      ) : (
                        <span className="text-brand-600">Correct Option: {q.correctOption}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Explanation Modal */}
      <Modal
        isOpen={explanationModal.isOpen}
        onClose={() => setExplanationModal({ isOpen: false, question: null })}
        title="Question Explanation & Shortcut Tips"
      >
        {explanationModal.question && (
          <div className="space-y-5">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs">
              <span className="font-bold text-brand-900">Correct Answer: </span>
              <span className="font-bold text-brand-700">Option {explanationModal.question.correctOption}</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Step-by-Step Derivation</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 whitespace-pre-line font-mono text-xs">
                {explanationModal.question.explanation}
              </p>
            </div>

            {explanationModal.question.formulaTip && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Concept & Speed Formula
                </h5>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {explanationModal.question.formulaTip}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
