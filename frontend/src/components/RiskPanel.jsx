import React from 'react';

export default function RiskPanel({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 h-full flex items-center justify-center text-slate-500 text-sm">
        No location selected. Click on the map.
      </div>
    );
  }

  const { riskScore, riskLevel, susceptibility, advisory } = data;
  const scorePercent = Math.round(riskScore * 100);
  
  const getLevelClasses = (level) => {
    switch(level) {
      case 'LOW': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getColorClass = (level) => {
    switch(level) {
      case 'LOW': return 'text-emerald-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-orange-500';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-slate-800">Current Risk Assessment</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getLevelClasses(riskLevel)}`}>
          {riskLevel}
        </span>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-100">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10%"
              strokeDasharray={`${scorePercent * 2.51} 251`}
              className={getColorClass(riskLevel)}
            />
          </svg>
          <div className="text-3xl font-black text-slate-700">{scorePercent}</div>
        </div>
        <span className="text-sm text-slate-500 mt-2">Overall Risk Score</span>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600">Base Susceptibility</span>
          <span className="font-medium">{(susceptibility * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${susceptibility * 100}%` }}></div>
        </div>
      </div>

      {advisory && (
        <div className="mt-2 bg-slate-50 p-3 rounded border border-slate-200">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">AI Advisory</h4>
          <p className="text-sm text-slate-700">{advisory}</p>
        </div>
      )}
    </div>
  );
}
