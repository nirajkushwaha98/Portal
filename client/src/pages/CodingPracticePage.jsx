import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DifficultyBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import {
  Code2,
  ExternalLink,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  Lightbulb,
  Building2,
  Trophy,
} from 'lucide-react';

export const CodingPracticePage = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Expanded hints set
  const [expandedHints, setExpandedHints] = useState(new Set());

  useEffect(() => {
    fetchProblems();
  }, [selectedTopic, selectedDifficulty]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedTopic !== 'All') params.topic = selectedTopic;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/coding-problems', { params });
      if (res.data.success) {
        setProblems(res.data.problems);
        setTopics(res.data.topics || []);
      }
    } catch (err) {
      console.error('Failed to load coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSolved = async (problemId) => {
    if (!isAuthenticated) {
      toastError('Please sign in to track your solved coding problems.');
      return;
    }

    try {
      const res = await api.post(`/users/toggle-problem/${problemId}`);
      if (res.data.success) {
        setProblems((prev) =>
          prev.map((p) => (p._id === problemId ? { ...p, isSolved: res.data.isSolved } : p))
        );

        if (res.data.isSolved) {
          success('Problem marked as solved! Keep up the momentum.');
        }

        // Update auth user context
        if (user) {
          setUser({ ...user, solvedProblems: res.data.solvedProblems });
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to update problem status'));
    }
  };

  const toggleHint = (problemId) => {
    setExpandedHints((prev) => {
      const copy = new Set(prev);
      if (copy.has(problemId)) {
        copy.delete(problemId);
      } else {
        copy.add(problemId);
      }
      return copy;
    });
  };

  const totalSolvedCount = problems.filter((p) => p.isSolved).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            <Code2 className="w-3.5 h-3.5" /> Curated Campus Placement DSA Sheet
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Data Structures & Algorithms Tracker
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            High-frequency coding problems frequently asked in online coding assessments and technical rounds at top product firms.
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[200px]">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Solved Count</p>
            <p className="text-xl font-black text-slate-900">
              {totalSolvedCount} / {problems.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProblems()}
            placeholder="Search problems, companies..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 text-slate-900"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="All">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table / List */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : problems.length === 0 ? (
        <EmptyState
          title="No coding problems match your search"
          description="Try resetting your filters or search terms."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {problems.map((prob, idx) => {
              const isHintOpen = expandedHints.has(prob._id);
              return (
                <div key={prob._id} className="p-5 sm:p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Checkbox & Title */}
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleSolved(prob._id)}
                        className="mt-0.5 text-slate-300 hover:text-emerald-600 transition-colors"
                        title={prob.isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                      >
                        {prob.isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={prob.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm sm:text-base font-bold hover:text-brand-600 transition-colors flex items-center gap-1.5 ${
                              prob.isSolved ? 'text-slate-500 line-through' : 'text-slate-900'
                            }`}
                          >
                            <span>{prob.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 inline" />
                          </a>
                          <DifficultyBadge difficulty={prob.difficulty} />
                        </div>
                        <p className="text-xs text-slate-500">
                          Topic: <span className="font-semibold text-slate-700">{prob.topic}</span>
                        </p>
                      </div>
                    </div>

                    {/* Company Tags & Hint Toggle */}
                    <div className="flex items-center gap-2 sm:self-center pl-8 sm:pl-0">
                      {prob.solutionHint && (
                        <button
                          onClick={() => toggleHint(prob._id)}
                          className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          {isHintOpen ? 'Hide Hint' : 'Approach Hint'}
                        </button>
                      )}

                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1"
                      >
                        <span>Code Online</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Problem Description if available */}
                  {prob.description && (
                    <p className="text-xs text-slate-600 pl-8 leading-relaxed max-w-4xl">
                      {prob.description}
                    </p>
                  )}

                  {/* Companies asked */}
                  {prob.companies && prob.companies.length > 0 && (
                    <div className="pl-8 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Frequently asked by:
                      </span>
                      {prob.companies.map((co, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold"
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable Hint Box */}
                  {isHintOpen && prob.solutionHint && (
                    <div className="ml-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5 animate-slide-in">
                      <p className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600" /> Optimal Solution Intuition & Complexity
                      </p>
                      <p className="leading-relaxed font-mono text-[11px] bg-white/70 p-3 rounded-xl border border-amber-200/50">
                        {prob.solutionHint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
