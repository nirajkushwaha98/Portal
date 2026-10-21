import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-brand-50 text-brand-600',
  trend,
  trendType = 'positive', // 'positive' | 'neutral' | 'negative'
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-hover flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        {subtext && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {trend && (
              <span
                className={`font-semibold ${
                  trendType === 'positive'
                    ? 'text-emerald-600'
                    : trendType === 'negative'
                    ? 'text-rose-600'
                    : 'text-slate-600'
                }`}
              >
                {trend}
              </span>
            )}
            <span>{subtext}</span>
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
