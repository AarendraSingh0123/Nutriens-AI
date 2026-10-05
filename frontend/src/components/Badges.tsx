import React, { useState } from 'react';
import { Shield, WifiOff, Info, Cpu, X, Lock } from 'lucide-react';

interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const norm = (level || 'LOW').toUpperCase();
  
  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  let dotColor = 'bg-emerald-500';
  let label = 'Low Risk';

  if (norm === 'HIGH') {
    bg = 'bg-red-50 text-red-700 border-red-200/80';
    dotColor = 'bg-red-500';
    label = 'High Risk';
  } else if (norm === 'MEDIUM') {
    bg = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotColor = 'bg-amber-500';
    label = 'Medium Risk';
  }

  const py = size === 'sm' ? 'py-0.5 px-2.5 text-[11px]' : size === 'lg' ? 'py-1.5 px-3.5 text-xs font-semibold' : 'py-1 px-3 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${bg} ${py}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`}></span>
      <span>{label}</span>
    </span>
  );
};

export const OfflineHeaderPill: React.FC<{ isAirplane: boolean }> = ({ isAirplane }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        title="Click to view offline privacy status"
      >
        <span className={`w-2 h-2 rounded-full ${isAirplane ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
        <span>{isAirplane ? 'Airplane Mode' : 'Offline'}</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Device-Only Processing</h4>
                <p className="text-[11px] text-slate-500">100% On-device Edge AI</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500">Cloud Connection:</span>
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Disabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500">Health Data:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Stays on this device</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-500">Inference Engine:</span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Snapdragon NPU</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
            >
              Close Status
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const PrivacyIndicator: React.FC = () => {
  return (
    <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/80">
      <Lock className="w-3.5 h-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
      <span>Your health data stays on this device.</span>
    </div>
  );
};

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start space-x-2 my-4">
      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-bold">General dietary guidance only — not medical advice.</span> NutriLens AI does not diagnose conditions, prescribe medication, change medication doses, or replace professional medical care.
      </div>
    </div>
  );
};
