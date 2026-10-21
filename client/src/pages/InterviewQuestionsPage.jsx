import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api/client';
import { DifficultyBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import {
  BookOpen,
  Building2,
  ThumbsUp,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

export const InterviewQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Set of expanded question IDs
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    fetchQuestions();
  }, [selectedCompany, selectedCategory]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCompany !== 'All') params.company = selectedCompany;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/interview-questions', { params });
      if (res.data.success) {
        setQuestions(res.data.questions);
        setCompanies(res.data.distinctCompanies || []);
      }
    } catch (err) {
      console.error('Failed to load interview questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/interview-questions/${id}/upvote`);
      if (res.data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === id ? { ...q, upvotes: res.data.upvotes } : q))
        );
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const categories = [
    'All',
    'Technical',
    'HR / Behavioral',
    'System Design',
    'DBMS & SQL',
    'Computer Networks & OS',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Real Campus Interview Experiences Archive
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Company-Specific Interview Questions & Tips
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Real questions asked during technical and HR rounds at Amazon, Google, Microsoft, and TCS. Study proven STAR responses and technical deep-dives.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
        </div>

        {/* Company and Category Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="All">All Companies</option>
              {companies.map((co) => (
                <option key={co} value={co}>
                  {co}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No interview questions found"
          description="Try resetting your company or category filters."
        />
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedIds.has(q._id);
            return (
              <div
                key={q._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden card-hover transition-all"
              >
                {/* Header row (Click to expand) */}
                <div
                  onClick={() => toggleExpand(q._id)}
                  className="p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                        <Building2 className="w-3 h-3 text-slate-500" /> {q.company}
                      </span>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        {q.category}
                      </span>
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {q.frequency} Frequency
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={(e) => handleUpvote(q._id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
                      title="Helpful interview tip"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-brand-600" />
                      <span>{q.upvotes || 0}</span>
                    </button>

                    <button className="p-1.5 text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-slide-in">
                    {/* Prompt Statement */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Exact Interviewer Question:
                      </p>
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        "{q.question}"
                      </p>
                    </div>

                    {/* Model Answer */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Recommended Model Response:
                      </p>
                      <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans shadow-inner">
                        {q.answer}
                      </div>
                    </div>

                    {/* Key Interviewer Tips */}
                    {q.keyTips && q.keyTips.length > 0 && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                        <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" /> Pro Tips For Acing This Question:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
                          {q.keyTips.map((tip, tIdx) => (
                            <li key={tIdx} className="leading-relaxed">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {q.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
