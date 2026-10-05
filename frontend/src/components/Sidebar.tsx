import React from 'react';
import { 
  LayoutDashboard, Camera, Mic, User, History, FileText, Package, Pill, Settings, Laptop, Leaf
} from 'lucide-react';
import { ActiveTab } from '../types';
import { OfflineHeaderPill, PrivacyIndicator } from './Badges';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAirplane: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAirplane }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-food', label: 'Scan Food', icon: Camera, highlight: true },
    { id: 'voice-assistant', label: 'Voice Assistant', icon: Mic },
    { id: 'health-profile', label: 'Health Profile', icon: User },
    { id: 'meal-history', label: 'Meal History', icon: History },
    { id: 'lab-reports', label: 'Lab Reports', icon: FileText },
    { id: 'packaged-food', label: 'Packaged Food', icon: Package },
    { id: 'medicine-reminders', label: 'Medicine Reminders', icon: Pill },
    { id: 'office-dashboard', label: 'Laptop Dashboard', icon: Laptop },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between hidden md:flex h-screen sticky top-0 shadow-xs z-30">
      <div>
        <div 
          onClick={() => setActiveTab('landing')}
          className="p-5 flex items-center space-x-3 cursor-pointer border-b border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-600 flex items-center justify-center text-white shadow-xs">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">NutriLens <span className="text-brand-600">AI</span></h1>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Offline Edge AI</p>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60 font-bold'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 space-y-3 border-t border-slate-100 bg-slate-50/50">
        <OfflineHeaderPill isAirplane={isAirplane} />
        <PrivacyIndicator />
      </div>
    </aside>
  );
};
