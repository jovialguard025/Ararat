import React, { useState, useEffect } from 'react';
import RiskMap from './components/RiskMap';
import RiskPanel from './components/RiskPanel';
import RainfallPanel from './components/RainfallPanel';
import XAIPanel from './components/XAIPanel';
import AlertsPanel from './components/AlertsPanel';
import FieldReportForm from './components/FieldReportForm';
import * as api from './services/api';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [riskData, setRiskData] = useState([]);
  const [locationDetails, setLocationDetails] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [fieldReports, setFieldReports] = useState([]);

  useEffect(() => {
    // Load initial map data
    api.getRiskMap({ minLat: 24, maxLat: 27, minLng: 92, maxLng: 95 })
      .then(setRiskData)
      .catch(console.error);

    // Load alerts
    fetchAlerts();
    
    // Load field reports
    fetchFieldReports();
  }, []);

  const fetchAlerts = () => {
    api.getAlerts()
      .then(setAlerts)
      .catch(console.error);
  };

  const fetchFieldReports = () => {
    api.getFieldReports()
      .then(setFieldReports)
      .catch(console.error);
  };

  const handleLocationSelect = async (latlng) => {
    setSelectedLocation(latlng);
    try {
      const pointData = await api.getRiskPoint(latlng.lat, latlng.lng);
      setLocationDetails(pointData);
      
      const rainData = await api.getRainfall(latlng.lat, latlng.lng);
      setRainfallData(rainData);
    } catch (err) {
      console.error(err);
      // Mock data fallback for demonstration if API fails
      setLocationDetails({
        riskScore: 0.85,
        riskLevel: 'HIGH',
        susceptibility: 0.75,
        advisory: 'High probability of landslides due to recent heavy rainfall and steep slope. Restrict traffic on mountain roads.',
        shapValues: [
          { feature: 'Rainfall 7D', value: 0.45 },
          { feature: 'Slope', value: 0.35 },
          { feature: 'Soil Moisture', value: 0.25 },
          { feature: 'Elevation', value: -0.1 },
          { feature: 'Vegetation', value: -0.15 }
        ],
        explanation: 'Recent 7-day rainfall and steep slope are the primary drivers of elevated risk.'
      });
      setRainfallData({
        current: 15,
        day3: 45,
        day7: 120,
        day14: 210,
        intensity: 5.5,
        soilMoisture: 0.82
      });
    }
  };

  const handleAcknowledgeAlert = async (id) => {
    try {
      await api.acknowledgeAlert(id);
      fetchAlerts(); // Refresh alerts
    } catch (err) {
      console.error(err);
      // Optimistic update for demo
      setAlerts(alerts.filter(a => a.id !== id));
    }
  };

  const handleFieldReportSubmit = async (report) => {
    await api.submitFieldReport(report);
    fetchFieldReports(); // Refresh
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white shadow-md z-10 relative">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center font-bold text-white shadow-sm">
              LG
            </div>
            <h1 className="text-xl font-bold tracking-tight">LandGuard AI</h1>
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline-block">| Landslide Risk Monitor</span>
          </div>
          <nav className="flex gap-6">
            <a href="#" className="text-emerald-400 font-medium border-b-2 border-emerald-400 pb-1">Dashboard</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Alerts</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Reports</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-64px-48px)] overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2 pb-2">
          <RiskPanel data={locationDetails} />
          <RainfallPanel data={rainfallData} />
          <XAIPanel data={locationDetails} />
        </div>

        {/* Center Map */}
        <div className="lg:col-span-6 h-full min-h-[500px]">
          <RiskMap riskData={riskData} onLocationSelect={handleLocationSelect} />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2 pb-2">
          <div className="h-1/2 min-h-[300px]">
            <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
          </div>
          <div className="flex-1 min-h-[400px]">
            <FieldReportForm onSubmit={handleFieldReportSubmit} recentReports={fieldReports} />
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 h-12 flex items-center justify-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} LandGuard AI Team. Geospatial Risk Assessment Platform.
      </footer>
    </div>
  );
}

export default App;
