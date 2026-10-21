import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CardSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  Bookmark,
  CheckCircle2,
  Send,
  Loader2,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export const JobsPage = () => {
  const { isAuthenticated, user, setUser, demoLogin } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Application modal state
  const [applyModal, setApplyModal] = useState({ isOpen: false, job: null });
  const [applyForm, setApplyForm] = useState({ resumeUrl: '', portfolioUrl: '', coverNote: '' });
  const [applying, setApplying] = useState(false);

  // Set of job IDs the user has applied to
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  // Set of saved job IDs
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) {
      fetchMyApplications();
      if (user?.savedJobs) {
        const set = new Set();
        user.savedJobs.forEach((j) => set.add(typeof j === 'object' ? j._id : j));
        setSavedJobIds(set);
      }
    }
  }, [selectedType, isAuthenticated]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType !== 'All') params.type = selectedType;
      if (selectedLocation !== 'All') params.location = selectedLocation;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/jobs', { params });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        const ids = new Set(res.data.applications.map((a) => a.job?._id));
        setAppliedJobIds(ids);
      }
    } catch (err) {
      console.error('Failed to load user applications:', err);
    }
  };

  const handleOpenApply = (job) => {
    if (!isAuthenticated) {
      demoLogin('student').then(() => {
        setApplyModal({ isOpen: true, job });
        setApplyForm({
          resumeUrl: user?.resumeUrl || 'https://example.com/resumes/demo-resume.pdf',
          portfolioUrl: user?.githubUrl || 'https://github.com/placement-aspirant',
          coverNote: '',
        });
      });
      return;
    }

    setApplyModal({ isOpen: true, job });
    setApplyForm({
      resumeUrl: user?.resumeUrl || '',
      portfolioUrl: user?.githubUrl || '',
      coverNote: '',
    });
  };

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      toastError('Please sign in to save job postings.');
      return;
    }

    try {
      const res = await api.post(`/users/toggle-save-job/${jobId}`);
      if (res.data.success) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (res.data.isSaved) {
            next.add(jobId);
            info('Job saved to your bookmarks.');
          } else {
            next.delete(jobId);
            info('Job removed from bookmarks.');
          }
          return next;
        });

        if (user) {
          setUser({ ...user, savedJobs: res.data.savedJobs });
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save job'));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!applyModal.job) return;

    try {
      setApplying(true);
      const res = await api.post(`/applications/apply/${applyModal.job._id}`, applyForm);

      if (res.data.success) {
        success(`Successfully submitted application for ${applyModal.job.company}!`);
        setAppliedJobIds((prev) => new Set([...prev, applyModal.job._id]));
        setApplyModal({ isOpen: false, job: null });
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Application failed.'));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
            <Briefcase className="w-3.5 h-3.5 text-cyan-600" /> Campus Recruitment & Internships
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Campus Placement Drives & Openings
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Explore verified campus hiring drives and full-time engineering graduate roles for the 2025-2026 batches.
          </p>
        </div>

        {isAuthenticated && (
          <Link
            to="/applications"
            className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 transition-colors flex items-center gap-2"
          >
            <span>My Application Tracker</span>
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] flex items-center justify-center font-bold">
              {appliedJobIds.size}
            </span>
          </Link>
        )}
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
            onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            placeholder="Search roles, companies, skills..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 text-slate-900"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No campus drives match your criteria"
          description="Try broadening your search or check back as new drives open regularly."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.has(job._id);
            const isSaved = savedJobIds.has(job._id);

            return (
              <div
                key={job._id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm card-hover flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Top Bar: Company, Type Badge, Save Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-base shadow-xs">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {job.company}
                        </h4>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSave(job._id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save job drive'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900">{job.salaryOrStipend}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Briefcase className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span className="font-semibold">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">{job.experience}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {/* Skills badges */}
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {job.skillsRequired.slice(0, 4).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Eligibility criteria notice */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Eligibility: </span>
                    <span>{job.eligibilityCriteria}</span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2">
                  {isApplied ? (
                    <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application Submitted (Tracked)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenApply(job)}
                      className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-brand-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply For Drive</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1-Click Application Modal */}
      <Modal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ isOpen: false, job: null })}
        title={`Apply for ${applyModal.job?.title} at ${applyModal.job?.company}`}
      >
        <form onSubmit={handleSubmitApplication} className="space-y-4">
          <div className="p-3.5 bg-brand-50 rounded-xl border border-brand-100 text-xs text-brand-900 space-y-1">
            <p className="font-bold">Campus Drive Application Details:</p>
            <p className="text-brand-700">
              Your academic profile (CGPA: {user?.cgpa || '8.5'}, Branch: {user?.branch || 'CS'}, College: {user?.college}) will be submitted directly to the recruiter portal.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Resume Link (PDF / Google Drive URL) *
            </label>
            <input
              type="url"
              required
              value={applyForm.resumeUrl}
              onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Portfolio / GitHub URL
            </label>
            <input
              type="url"
              value={applyForm.portfolioUrl}
              onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
              placeholder="https://github.com/your-username"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Candidate Note / Statement of Interest
            </label>
            <textarea
              rows={3}
              value={applyForm.coverNote}
              onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
              placeholder="Briefly state your primary technical strengths and why you're a great fit for this role..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setApplyModal({ isOpen: false, job: null })}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              {applying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
