import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';

const getRiskColor = (level) => {
  switch(level) {
    case 'LOW': return '#10b981';
    case 'MEDIUM': return '#facc15';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#dc2626';
    default: return '#9ca3af';
  }
};

const MapEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

export default function RiskMap({ riskData = [], onLocationSelect }) {
  return (
    <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
      <MapContainer 
        center={[25.5, 93.0]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {riskData.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.lng]}
            pathOptions={{ 
              color: getRiskColor(point.riskLevel),
              fillColor: getRiskColor(point.riskLevel),
              fillOpacity: 0.7
            }}
            radius={8}
            eventHandlers={{
              click: () => onLocationSelect({ lat: point.lat, lng: point.lng })
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold mb-1">Risk details</p>
                <p>Score: {(point.riskScore * 100).toFixed(1)}%</p>
                <p>Level: {point.riskLevel}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded shadow-md z-[400] text-sm">
        <h4 className="font-bold mb-2">Risk Level</h4>
        <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-emerald-500 rounded-full"></div> Low</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-yellow-400 rounded-full"></div> Medium</div>
        <div className="flex items-center gap-2 mb-1"><div className="w-4 h-4 bg-orange-500 rounded-full"></div> High</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded-full"></div> Critical</div>
      </div>
    </div>
  );
}
