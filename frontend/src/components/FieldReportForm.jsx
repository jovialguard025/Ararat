import React, { useState } from 'react';

export default function FieldReportForm({ onSubmit, recentReports = [] }) {
  const [formData, setFormData] = useState({
    reporter: '',
    lat: '',
    lng: '',
    severity: '3',
    description: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        severity: parseInt(formData.severity, 10)
      });
      setStatus({ type: 'success', msg: 'Report submitted successfully' });
      setFormData({ ...formData, description: '' });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to submit report' });
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 flex flex-col gap-4">
      <h3 className="font-bold text-slate-800">Field Report</h3>
      
      {status && (
        <div className={`p-2 text-sm rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          required
          type="text" 
          placeholder="Reporter Name"
          className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          value={formData.reporter}
          onChange={e => setFormData({...formData, reporter: e.target.value})}
        />
        
        <div className="flex gap-2">
          <input 
            required
            type="number" 
            step="any"
            placeholder="Latitude"
            className="w-1/2 text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
            value={formData.lat}
            onChange={e => setFormData({...formData, lat: e.target.value})}
          />
          <input 
            required
            type="number" 
            step="any"
            placeholder="Longitude"
            className="w-1/2 text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
            value={formData.lng}
            onChange={e => setFormData({...formData, lng: e.target.value})}
          />
        </div>

        <select 
          className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
          value={formData.severity}
          onChange={e => setFormData({...formData, severity: e.target.value})}
        >
          <option value="1">Severity 1 (Minor)</option>
          <option value="2">Severity 2</option>
          <option value="3">Severity 3 (Moderate)</option>
          <option value="4">Severity 4</option>
          <option value="5">Severity 5 (Severe)</option>
        </select>

        <textarea 
          required
          placeholder="Observations..."
          rows="3"
          className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 resize-none"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        ></textarea>

        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors"
        >
          Submit Report
        </button>
      </form>

      {recentReports.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Recent Reports</h4>
          <div className="space-y-2">
            {recentReports.slice(0, 3).map((rep, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded text-xs border border-slate-100">
                <div className="flex justify-between font-medium mb-1">
                  <span>{rep.reporter}</span>
                  <span className="text-red-500">Lv {rep.severity}</span>
                </div>
                <p className="text-slate-600 truncate">{rep.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
