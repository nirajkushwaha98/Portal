import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { DifficultyBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import {
  BrainCircuit,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    category: 'Quantitative',
    topic: '',
    difficulty: 'Medium',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctOption: 'A',
    explanation: '',
    formulaTip: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [categoryFilter, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/questions', { params });
      if (res.data.success) {
        setQuestions(res.data.questions);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to fetch questions'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setFormData({
      title: q.title,
      category: q.category,
      topic: q.topic,
      difficulty: q.difficulty,
      options: q.options || initialForm.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      formulaTip: q.formulaTip || '',
    });
    setModalOpen(true);
  };

  const handleOptionChange = (id, text) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingQuestion) {
        const res = await api.put(`/questions/${editingQuestion._id}`, formData);
        if (res.data.success) {
          success('Question updated successfully!');
          setQuestions((prev) =>
            prev.map((q) => (q._id === editingQuestion._id ? res.data.question : q))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/questions', formData);
        if (res.data.success) {
          success('Question created and added to question bank!');
          setQuestions([res.data.question, ...questions]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Operation failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await api.delete(`/questions/${id}`);
      if (res.data.success) {
        success('Question deleted.');
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete question'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <BrainCircuit className="w-3.5 h-3.5" /> Question Bank Repository
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Aptitude & Technical Questions
          </h1>
          <p className="text-sm text-slate-500">
            Add, update, and manage questions used across student practice drills and timed mock exams.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Question
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
            placeholder="Search question statement or topic..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Quantitative">Quantitative</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
            <option value="Verbal Ability">Verbal Ability</option>
            <option value="Core CS Fundamentals">Core CS Fundamentals</option>
          </select>
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions in this category"
          description="Click 'Add New Question' above to create one."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-1/2">Question Statement</th>
                  <th className="py-3.5 px-4">Category & Topic</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Correct Option</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <p className="line-clamp-2 leading-relaxed">{q.title}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{q.category}</p>
                      <p className="text-[11px] text-slate-400">{q.topic}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-black inline-flex items-center justify-center">
                        {q.correctOption}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-100 rounded-lg font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-100 rounded-lg font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuestion ? 'Edit Aptitude Question' : 'Create New Aptitude Question'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Question Statement *
            </label>
            <textarea
              required
              rows={3}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter full question text..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="Quantitative">Quantitative</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Verbal Ability">Verbal Ability</option>
                <option value="Core CS Fundamentals">Core CS Fundamentals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Topic *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Time & Work, DBMS"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Options Inputs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Multiple Choice Options *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-xs flex items-center justify-center flex-shrink-0 text-slate-700">
                    {opt.id}
                  </span>
                  <input
                    type="text"
                    required
                    value={opt.text}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                    placeholder={`Option ${opt.id} text`}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Correct Answer Option *
            </label>
            <select
              value={formData.correctOption}
              onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
              className="w-full sm:w-48 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Step-by-Step Explanation *
            </label>
            <textarea
              required
              rows={3}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Detailed logical or mathematical steps..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Formula / Shortcut Tip (Optional)
            </label>
            <input
              type="text"
              value={formData.formulaTip}
              onChange={(e) => setFormData({ ...formData, formulaTip: e.target.value })}
              placeholder="e.g. Formula: Speed = Distance / Time"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{editingQuestion ? 'Update Question' : 'Create Question'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
