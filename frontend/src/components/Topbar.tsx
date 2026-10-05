import React, { useState } from 'react';
import { 
  Camera, LayoutDashboard, HeartPulse, History, FileText, Bell, 
  User, Settings, Laptop, Package, Pill, Mic, Plane, ChevronDown, Leaf
} from 'lucide-react';
import { ActiveTab, HealthProfile } from '../types';
import { OfflineHeaderPill } from './Badges';

interface TopbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: HealthProfile;
  isAirplane: boolean;
  setIsAirplane: (val: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  profile, 
  isAirplane, 
  setIsAirplane 
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-food', label: 'Scan Food', icon: Camera, highlight: true },
    { id: 'health-profile', label: 'Health', icon: HeartPulse },
    { id: 'meal-history', label: 'History', icon: History },
    { id: 'lab-reports', label: 'Reports', icon: FileText },
  ];

  const secondaryNavItems = [
    { id: 'voice-assistant', label: 'Ask NutriLens', icon: Mic },
    { id: 'packaged-food', label: 'Packaged Food', icon: Package },
    { id: 'medicine-reminders', label: 'Medicine Reminders', icon: Pill },
    { id: 'office-dashboard', label: 'Laptop Dashboard', icon: Laptop },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Top-Left: Logo & Brand */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">NutriLens</span>
            <span className="font-bold text-xs text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60">AI</span>
          </div>
        </div>

        {/* Center Navigation (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse ml-0.5"></span>
                )}
              </button>
            );
          })}

          {/* More Menu Dropdown for secondary features */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all"
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showMoreMenu && (
              <div 
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 space-y-0.5"
                onMouseLeave={() => setShowMoreMenu(false)}
              >
                {secondaryNavItems.map((sec) => {
                  const SecIcon = sec.icon;
                  const isSecActive = activeTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveTab(sec.id as ActiveTab);
                        setShowMoreMenu(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3.5 py-2 text-xs text-left font-medium transition-colors ${
                        isSecActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <SecIcon className="w-4 h-4 text-slate-500" />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Airplane Mode Toggle simulator */}
          <button
            onClick={() => setIsAirplane(!isAirplane)}
            className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              isAirplane
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
            title="Toggle simulated airplane mode for offline edge AI demo"
          >
            <Plane className={`w-3 h-3 ${isAirplane ? 'rotate-45' : ''}`} />
            <span>{isAirplane ? 'Airplane ON' : 'Airplane Mode'}</span>
          </button>

          {/* Compact Offline Indicator Pill */}
          <OfflineHeaderPill isAirplane={isAirplane} />

          {/* Notifications Icon Button */}
          <button 
            onClick={() => setActiveTab('medicine-reminders')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors relative"
            title="Notifications & Medicine Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border border-white"></span>
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => setActiveTab('health-profile')}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 p-1 md:pl-1 md:pr-3 rounded-full border border-slate-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden lg:inline">{profile.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
