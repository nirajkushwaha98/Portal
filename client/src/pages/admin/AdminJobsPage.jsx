import React, { useState, useEffect } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import {
  Briefcase,
  Plus,
  Users,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Loader2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Create/Edit Job
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal State for Applicants List
  const [applicantsModal, setApplicantsModal] = useState({ isOpen: false, job: null, applicants: [] });
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const initialForm = {
    title: '',
    company: '',
    type: 'Full-time',
    location: '',
    salaryOrStipend: '',
    experience: 'Freshers (Batch of 2026)',
    batch: '2026',
    description: '',
    eligibilityCriteria: 'B.Tech/B.E. in CS/IT with min 7.5 CGPA',
    skillsRequired: '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialForm);

  const { success, error: toastError } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs?limit=50&status=all'); // fetch all jobs (active and closed) for admin
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData(initialForm);
    setJobModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      type: job.type,
      location: job.location,
      salaryOrStipend: job.salaryOrStipend,
      experience: job.experience,
      batch: job.batch,
      description: job.description,
      eligibilityCriteria: job.eligibilityCriteria || '',
      skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : '',
      status: job.status,
    });
    setJobModalOpen(true);
  };

  const handleViewApplicants = async (job) => {
    try {
      setLoadingApplicants(true);
      setApplicantsModal({ isOpen: true, job, applicants: [] });
      const res = await api.get(`/applications/admin/job/${job._id}`);
      if (res.data.success) {
        setApplicantsModal({ isOpen: true, job, applicants: res.data.applications });
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to load applicants'));
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/admin/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        success(`Applicant status updated to '${newStatus}'`);
        setApplicantsModal((prev) => ({
          ...prev,
          applicants: prev.applicants.map((a) => (a._id === appId ? { ...a, status: newStatus } : a)),
        }));
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to update applicant status'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingJob) {
        const res = await api.put(`/jobs/${editingJob._id}`, payload);
        if (res.data.success) {
          success('Job posting updated successfully!');
          fetchJobs();
          setJobModalOpen(false);
        }
      } else {
        const res = await api.post('/jobs', payload);
        if (res.data.success) {
          success('New campus job drive posted!');
          fetchJobs();
          setJobModalOpen(false);
        }
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to save job'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.delete(`/jobs/${id}`);
      if (res.data.success) {
        success('Job drive removed.');
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete job'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Campus Drives & Recruiter Management
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Job & Internship Postings
          </h1>
          <p className="text-sm text-slate-500">
            Post campus recruitment drives, inspect student applicants, and advance interview stages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post New Job Drive
        </button>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs posted yet" description="Click 'Post New Job Drive' to get started." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Type & Location</th>
                  <th className="py-3.5 px-4">Compensation</th>
                  <th className="py-3.5 px-4">Drive Status</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{job.title}</p>
                      <p className="text-[11px] text-slate-500 font-semibold">{job.company}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{job.type}</span>
                      <p className="text-[11px] text-slate-400">{job.location}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      {job.salaryOrStipend}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" /> View Applicants
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg inline-block"
                        title="Edit Job"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg inline-block"
                        title="Delete Job"
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

      {/* Create / Edit Job Modal */}
      <Modal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        title={editingJob ? 'Edit Campus Job Drive' : 'Post New Campus Job Drive'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Software Engineer 1"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google, Microsoft"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Job Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, India"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Salary / CTC *
              </label>
              <input
                type="text"
                required
                value={formData.salaryOrStipend}
                onChange={(e) => setFormData({ ...formData, salaryOrStipend: e.target.value })}
                placeholder="e.g. ₹24 - ₹28 LPA"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Target Batch & Eligibility
              </label>
              <input
                type="text"
                value={formData.eligibilityCriteria}
                onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                placeholder="e.g. B.Tech CS 7.5+ CGPA (2026 Batch)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="Active">Active (Accepting Applications)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Skills Required (Comma separated)
            </label>
            <input
              type="text"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              placeholder="e.g. C++, Java, React, SQL, Algorithms"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full role description and responsibilities..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setJobModalOpen(false)}
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
              <span>{editingJob ? 'Update Drive' : 'Post Drive'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Applicants List Modal */}
      <Modal
        isOpen={applicantsModal.isOpen}
        onClose={() => setApplicantsModal({ isOpen: false, job: null, applicants: [] })}
        title={`Student Applicants: ${applicantsModal.job?.title} (${applicantsModal.job?.company})`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          {loadingApplicants ? (
            <TableSkeleton rows={3} />
          ) : applicantsModal.applicants.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">
              No students have applied to this drive yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {applicantsModal.applicants.map((app) => (
                <div key={app._id} className="py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{app.user?.name}</h4>
                      <p className="text-xs text-slate-500">
                        {app.user?.email} • {app.user?.college} • <span className="font-semibold text-emerald-600">CGPA: {app.user?.cgpa}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateApplicantStatus(app._id, e.target.value)}
                        className="p-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Submitted Resume
                      </a>
                    )}
                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> GitHub / Portfolio
                      </a>
                    )}
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed italic">
                      "{app.coverNote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
