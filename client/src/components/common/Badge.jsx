import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  const variantClasses = {
    primary: 'bg-brand-50 text-brand-700 border border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  const config = {
    Easy: { variant: 'success', text: 'Easy' },
    Medium: { variant: 'warning', text: 'Medium' },
    Hard: { variant: 'danger', text: 'Hard' },
  }[difficulty] || { variant: 'neutral', text: difficulty || 'Medium' };

  return <Badge variant={config.variant}>{config.text}</Badge>;
};

export const StatusBadge = ({ status }) => {
  const config = {
    Active: 'success',
    Closed: 'danger',
    Applied: 'primary',
    Shortlisted: 'indigo',
    Interviewing: 'warning',
    Offered: 'success',
    Rejected: 'danger',
    completed: 'success',
    'in-progress': 'warning',
  }[status] || 'neutral';

  return <Badge variant={config}>{status}</Badge>;
};
