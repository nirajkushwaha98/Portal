import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-100 rounded"></div>
            <div className="h-3.5 w-5/6 bg-slate-100 rounded"></div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-9 w-24 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse p-4 space-y-4">
      <div className="h-8 bg-slate-100 rounded w-1/4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
        ))}
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
