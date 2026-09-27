import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function XAIPanel({ data }) {
  if (!data || !data.shapValues) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 h-full flex items-center justify-center text-slate-500 text-sm">
        Select a location for risk factor analysis.
      </div>
    );
  }

  const sortedData = [...data.shapValues]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 flex flex-col gap-4">
      <h3 className="font-bold text-slate-800">Risk Factor Analysis</h3>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData} 
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="feature" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#475569' }}
              width={80}
            />
            <Tooltip
              formatter={(value) => value.toFixed(3)}
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
        <p className="mb-2"><strong>Interpretation:</strong></p>
        <p>{data.explanation}</p>
      </div>
    </div>
  );
}
