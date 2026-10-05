import React, { useState } from 'react';
import { Settings, Shield, WifiOff, Database, Download, Trash2, CheckCircle2, Cpu, Info } from 'lucide-react';
import { HealthProfile, Meal, LabReport } from '../types';
import { DisclaimerBanner } from '../components/Badges';

interface SettingsPageProps {
  profile: HealthProfile;
  meals: Meal[];
  labReports: LabReport[];
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ profile, meals, labReports }) => {
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  const handleExportData = () => {
    const exportObject = {
      exportDate: new Date().toISOString(),
      profile,
      meals,
      labReports,
      privacyGuarantee: "100% On-device Local Storage"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nutrilens_health_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete all local health data? This cannot be undone.")) {
      localStorage.clear();
      alert("All local data deleted successfully.");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Settings & Privacy</h2>
            <p className="text-xs text-slate-500">Configure on-device AI status and data management</p>
          </div>
        </div>

        {/* Section 1: Privacy Guarantees */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-brand-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Privacy & Security Guarantees</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Cloud backend:</span>
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Disabled</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Health data:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Stored locally</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Nutrition database:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Local</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">AI processing:</span>
              <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">On-device NPU</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
              <span className="text-slate-600 font-medium">Internet required:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">No (100% Offline)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Data Management */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Data Management</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export My Data (JSON)</span>
            </button>

            <button
              onClick={handleDeleteData}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete All Data</span>
            </button>
          </div>

          {exportedSuccess && (
            <div className="text-xs font-bold text-emerald-600 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Data exported to JSON file!
            </div>
          )}
        </div>

        {/* Section 3: About NutriLens AI */}
        <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
          <div className="font-bold text-slate-900">About NutriLens AI</div>
          <div>Version 1.0.0 — Open Innovation Hackathon Prototype</div>
          <div>"Personal nutrition guidance that works without internet."</div>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
