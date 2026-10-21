import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { DifficultyBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import {
  Timer,
  Plus,
  Clock,
  Trash2,
  Edit2,
  CheckSquare,
  Square,
  Loader2,
} from 'lucide-react';

export const AdminTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    category: 'TCS NQT Style',
    durationMinutes: 30,
    totalMarks: 100,
    passingMarks: 60,
    difficulty: 'Medium',
    questions: [],
  };

  const [formData, setFormData] = useState(initialForm);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchTestsAndQuestions();
  }, []);

  const fetchTestsAndQuestions = async () => {
    try {
      setLoading(true);
      const [testRes, qRes] = await Promise.all([
        api.get('/mock-tests'),
        api.get('/questions?limit=100'),
      ]);

      if (testRes.data.success) {
        setTests(testRes.data.tests);
      }
      if (qRes.data.success) {
        setAvailableQuestions(qRes.data.questions);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to load test management data'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTest(null);
    setFormData({
      ...initialForm,
      questions: availableQuestions.slice(0, 5).map((q) => q._id), // default select first 5
    });
    setModalOpen(true);
  };

  const handleOpenEdit = async (t) => {
    try {
      const res = await api.get(`/mock-tests/${t._id}`);
      if (res.data.success) {
        const full = res.data.test;
        setEditingTest(full);
        setFormData({
          title: full.title,
          description: full.description || '',
          category: full.category,
          durationMinutes: full.durationMinutes,
          totalMarks: full.totalMarks,
          passingMarks: full.passingMarks,
          difficulty: full.difficulty || 'Medium',
          questions: (full.questions || []).map((q) =>
            typeof q === 'object' && q !== null ? q._id : q
          ),
        });
        setModalOpen(true);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to load test details'));
    }
  };

  const toggleQuestionSelection = (qId) => {
    setFormData((prev) => {
      const exists = prev.questions.includes(qId);
      const next = exists
        ? prev.questions.filter((id) => id !== qId)
        : [...prev.questions, qId];
      return { ...prev, questions: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) {
      toastError('Please select at least 1 question for the mock test.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingTest) {
        const res = await api.put(`/mock-tests/${editingTest._id}`, formData);
        if (res.data.success) {
          success('Mock test updated successfully!');
          fetchTestsAndQuestions();
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/mock-tests', formData);
        if (res.data.success) {
          success('New mock test created!');
          fetchTestsAndQuestions();
          setModalOpen(false);
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save test'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mock test? Past attempts will be preserved.')) return;
    try {
      const res = await api.delete(`/mock-tests/${id}`);
      if (res.data.success) {
        success('Test deleted.');
        setTests((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete test'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Timer className="w-3.5 h-3.5 text-amber-600" /> Assessment Scheduling
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Campus Mock Exams
          </h1>
          <p className="text-sm text-slate-500">
            Configure timed tests, link questions from the bank, and establish passing cutoffs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Mock Test
        </button>
      </div>

      {/* Tests Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : tests.length === 0 ? (
        <EmptyState title="No mock tests created yet" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Test Title & Category</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Questions</th>
                  <th className="py-3.5 px-4">Cutoff %</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {tests.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{t.title}</p>
                      <p className="text-[11px] text-brand-600 font-semibold">{t.category}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {t.durationMinutes} mins
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {t.questionCount} Questions
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      {t.passingMarks}%
                    </td>
                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={t.difficulty} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg inline-block"
                        title="Edit Test"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block"
                        title="Delete Test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Test Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTest ? 'Edit Mock Test Assessment' : 'Assemble New Mock Assessment'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Assessment Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Amazon SDE Diagnostic Mock 2026"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. TCS NQT, Core CS"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                max="180"
                required
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Passing Cutoff %
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Test instructions or focus areas..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          {/* Select Questions Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Select Questions ({formData.questions.length} Selected) *
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    questions: availableQuestions.map((q) => q._id),
                  })
                }
                className="text-[11px] font-bold text-brand-600 hover:underline"
              >
                Select All
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 p-1 border border-slate-200 rounded-xl">
              {availableQuestions.map((q) => {
                const isSelected = formData.questions.includes(q._id);
                return (
                  <div
                    key={q._id}
                    onClick={() => toggleQuestionSelection(q._id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                      isSelected
                        ? 'bg-brand-50 border-brand-300 text-brand-950 font-semibold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="line-clamp-2">{q.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {q.category} • {q.topic} • {q.difficulty}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <span>{editingTest ? 'Update Test' : 'Create Test'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
