import React from 'react';
import { LayoutDashboard, Camera, Mic, History, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex justify-around items-center z-40 shadow-lg">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center text-xs font-medium ${
          activeTab === 'dashboard' ? 'text-brand-600 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab('voice-assistant')}
        className={`flex flex-col items-center text-xs font-medium ${
          activeTab === 'voice-assistant' ? 'text-brand-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Mic className="w-5 h-5 mb-0.5" />
        <span>Ask</span>
      </button>

      {/* Prominent Scan Action Button */}
      <button
        onClick={() => setActiveTab('scan-food')}
        className="flex flex-col items-center -mt-6"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-r from-brand-600 to-teal-600 p-3 text-white shadow-lg shadow-brand-600/30 flex items-center justify-center border-4 border-slate-50 active:scale-95 transition-transform">
          <Camera className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold text-brand-700 mt-0.5">Scan</span>
      </button>

      <button
        onClick={() => setActiveTab('meal-history')}
        className={`flex flex-col items-center text-xs font-medium ${
          activeTab === 'meal-history' ? 'text-brand-600 font-bold' : 'text-slate-500'
        }`}
      >
        <History className="w-5 h-5 mb-0.5" />
        <span>History</span>
      </button>

      <button
        onClick={() => setActiveTab('health-profile')}
        className={`flex flex-col items-center text-xs font-medium ${
          activeTab === 'health-profile' ? 'text-brand-600 font-bold' : 'text-slate-500'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Profile</span>
      </button>
    </div>
  );
};
