import React from 'react';

export default function AlertsPanel({ alerts = [], onAcknowledge }) {
  const sortedAlerts = [...alerts].sort((a, b) => b.risk_score - a.risk_score);

  const getAlertStyle = (level) => {
    switch(level) {
      case 'CRITICAL': return 'border-red-200 bg-red-50';
      case 'HIGH': return 'border-orange-200 bg-orange-50';
      case 'MEDIUM': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeStyle = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-slate-200 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">Active Alerts</h3>
        <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full font-bold">
          {alerts.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px]">
        {alerts.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">No active alerts</div>
        ) : (
          sortedAlerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border ${getAlertStyle(alert.risk_level)}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${getBadgeStyle(alert.risk_level)}`}>
                  {alert.risk_level}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-800 mb-1">{alert.location}</p>
              <p className="text-xs text-slate-600 mb-3">{alert.message}</p>
              <button 
                onClick={() => onAcknowledge(alert.id)}
                className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors w-full font-medium"
              >
                Acknowledge
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
