import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/common/Badge';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import {
  Layers,
  Building2,
  Calendar,
  MapPin,
  Save,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit3,
} from 'lucide-react';

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditNote = (app) => {
    setEditingNotesId(app._id);
    setNotesDraft(app.studentNotes || '');
  };

  const handleSaveNote = async (id) => {
    try {
      setSavingNote(true);
      const res = await api.put(`/applications/${id}/notes`, { studentNotes: notesDraft });
      if (res.data.success) {
        success('Personal interview note updated!');
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, studentNotes: notesDraft } : a))
        );
        setEditingNotesId(null);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save notes'));
    } finally {
      setSavingNote(false);
    }
  };

  const stages = ['Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'];

  const stageCounts = stages.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.status === stage).length;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Layers className="w-3.5 h-3.5" /> Stage-by-Stage Recruitment Kanban
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Campus Application Tracker
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Track your progress across campus placement interview rounds, log preparation notes, and monitor offers.
          </p>
        </div>

        <Link
          to="/jobs"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
        >
          <span>Browse More Drives</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stage Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <div key={stage} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stage}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stageCounts[stage] || 0}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No campus applications yet"
          description="Browse active hiring drives and submit your profile with 1-click."
          actionLabel="View Campus Job Drives"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job;
            if (!job) return null;
            const isEditingNote = editingNotesId === app._id;

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm card-hover space-y-5"
              >
                {/* Main Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-base shadow-xs flex-shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">{job.company}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-600">{job.location}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                        {job.title}
                      </h3>
                      <p className="text-xs font-bold text-emerald-600 mt-1">
                        Compensation: {job.salaryOrStipend}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-center">
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] text-slate-400 uppercase font-semibold">Status</p>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="sm:hidden">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                </div>

                {/* Sub-row: Applied date & candidate notes */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Applied on:{' '}
                      <span className="font-semibold text-slate-700">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>

                    {!isEditingNote && (
                      <button
                        onClick={() => handleStartEditNote(app)}
                        className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{app.studentNotes ? 'Edit Prep Notes' : '+ Add Interview Notes'}</span>
                      </button>
                    )}
                  </div>

                  {/* Personal Interview Notes Box */}
                  {isEditingNote ? (
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Private Interview & Follow-up Notes
                      </label>
                      <textarea
                        rows={2}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Log interview round dates, topics asked, interviewer name, or next steps..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(app._id)}
                          disabled={savingNote}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Notes
                        </button>
                      </div>
                    </div>
                  ) : app.studentNotes ? (
                    <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <span className="font-bold text-amber-900">My Interview Prep Notes:</span>
                      <p className="leading-relaxed">{app.studentNotes}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
