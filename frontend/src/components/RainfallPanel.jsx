import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RainfallPanel({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 h-full flex items-center justify-center text-slate-500 text-sm">
        Select a location for rainfall data.
      </div>
    );
  }

  const chartData = [
    { name: 'Current', value: data.current },
    { name: '3-Day', value: data.day3 },
    { name: '7-Day', value: data.day7 },
    { name: '14-Day', value: data.day14 },
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 flex flex-col gap-4">
      <h3 className="font-bold text-slate-800">Precipitation Data</h3>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" textAnchor="end" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="text-xs text-blue-600 mb-1">Intensity</div>
          <div className="font-bold text-slate-800">{data.intensity} mm/hr</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
          <div className="text-xs text-emerald-600 mb-1">Soil Moisture</div>
          <div className="font-bold text-slate-800">{(data.soilMoisture * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
