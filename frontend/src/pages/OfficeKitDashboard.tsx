import React, { useState } from 'react';
import { Laptop, Cpu, Activity, ShieldCheck, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { Meal, InferenceLog, HealthProfile, LabReport } from '../types';
import { RiskBadge, DisclaimerBanner } from '../components/Badges';

interface OfficeKitDashboardProps {
  meals: Meal[];
  inferenceLogs: InferenceLog[];
  profile: HealthProfile;
  labReports: LabReport[];
}

export const OfficeKitDashboard: React.FC<OfficeKitDashboardProps> = ({
  meals,
  inferenceLogs,
  profile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'user-view' | 'inference-log'>('user-view');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Connected Status Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Connected to Phone (Office Kit Sync)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">NutriLens AI — Connected Dashboard</h2>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('user-view')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'user-view' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            USER VIEW
          </button>
          <button
            onClick={() => setActiveSubTab('inference-log')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeSubTab === 'inference-log' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            INFERENCE LOG
          </button>
        </div>
      </div>

      {/* Subtab 1: USER VIEW */}
      {activeSubTab === 'user-view' && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Logged Meals Today</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{meals.length} meals</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Risk Distribution</span>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Low: 2</span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">Medium: 1</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">Active Health Conditions</span>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {profile.has_diabetes ? 'Type 2 Diabetes' : 'General'}
              </div>
            </div>
          </div>

          {/* Meals Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Today's Meals & Guidance Sync</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-3">Meal</th>
                    <th className="py-3 px-3">Portion</th>
                    <th className="py-3 px-3">Calories</th>
                    <th className="py-3 px-3">Risk Level</th>
                    <th className="py-3 px-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {meals.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{m.food_name}</td>
                      <td className="py-3 px-3">{m.portion_size}</td>
                      <td className="py-3 px-3">~{m.calories_min}–{m.calories_max} kcal</td>
                      <td className="py-3 px-3"><RiskBadge level={m.risk_level} size="sm" /></td>
                      <td className="py-3 px-3 text-slate-500">{m.activity_suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: INFERENCE LOG */}
      {activeSubTab === 'inference-log' && (
        <div className="space-y-6">
          {/* Architecture Telemetry Specs Cards */}
          <div className="bg-slate-950 text-slate-200 p-6 rounded-3xl border border-slate-800 font-mono text-xs space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">Qualcomm Snapdragon NPU / LiteRT Telemetry</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800 font-bold">
                Status: ACTIVE (OFFLINE)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Vision Model</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">EfficientNet-Lite0</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Inference Engine</div>
                <div className="font-bold text-teal-400 text-sm mt-0.5">LiteRT / TFLite QNN</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Hardware Backend</div>
                <div className="font-bold text-amber-400 text-sm mt-0.5">Qualcomm NPU / Hexagon</div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">LLM Engine</div>
                <div className="font-bold text-blue-400 text-sm mt-0.5">Gemma 2B (On-Device)</div>
              </div>
            </div>
          </div>

          {/* Telemetry Logs Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Recent Edge AI Inference Execution Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold font-mono">
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Model</th>
                    <th className="py-3 px-3">Runtime</th>
                    <th className="py-3 px-3">Backend</th>
                    <th className="py-3 px-3">Latency</th>
                    <th className="py-3 px-3">LLM Status</th>
                    <th className="py-3 px-3">Privacy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                  {inferenceLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{log.model_name}</td>
                      <td className="py-3 px-3">{log.runtime}</td>
                      <td className="py-3 px-3 text-brand-700 font-bold">{log.backend_device}</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">{log.latency_ms} ms</td>
                      <td className="py-3 px-3">{log.llm_status}</td>
                      <td className="py-3 px-3 text-xs font-bold text-emerald-700">{log.privacy_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Production Architecture Spec Reference */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Full Production Android Stack Specs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
              <div className="bg-white p-2.5 rounded-xl border">
                <span className="font-bold text-slate-900">UI / Language:</span> Kotlin + Jetpack Compose
              </div>
              <div className="bg-white p-2.5 rounded-xl border">
                <span className="font-bold text-slate-900">Camera:</span> CameraX API
              </div>
              <div className="bg-white p-2.5 rounded-xl border">
                <span className="font-bold text-slate-900">Database:</span> Room / SQLite
              </div>
              <div className="bg-white p-2.5 rounded-xl border">
                <span className="font-bold text-slate-900">OCR Engine:</span> ML Kit On-Device
              </div>
            </div>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
