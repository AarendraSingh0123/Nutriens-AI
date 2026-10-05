import React, { useState, useEffect } from 'react';
import { ActiveTab, HealthProfile, Meal, LabReport, MedicineReminder, InferenceLog } from './types';
import { 
  fetchHealthProfile, fetchMeals, fetchLabReports, fetchMedicineReminders, fetchInferenceLogs, setAirplaneMode 
} from './services/api';
import { Topbar } from './components/Topbar';
import { MobileNav } from './components/MobileNav';
import { RiskBadge } from './components/Badges';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { FoodScanner } from './pages/FoodScanner';
import { VoiceAssistant } from './pages/VoiceAssistant';
import { HealthProfilePage } from './pages/HealthProfilePage';
import { MealHistory } from './pages/MealHistory';
import { LabReports } from './pages/LabReports';
import { PackagedFood } from './pages/PackagedFood';
import { MedicineReminders } from './pages/MedicineReminders';
import { OfficeKitDashboard } from './pages/OfficeKitDashboard';
import { SettingsPage } from './pages/SettingsPage';
import { X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isAirplane, setIsAirplane] = useState<boolean>(false);
  const [profile, setProfile] = useState<HealthProfile>({
    name: "Anil Kumar",
    age: 42,
    sex: "Male",
    height_cm: 172,
    weight_kg: 76,
    has_diabetes: true,
    has_hypertension: false,
    has_thyroid: false,
    has_pcos: false,
    weight_goal: "Lose",
    activity_level: "Moderate"
  });

  const [meals, setMeals] = useState<Meal[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [inferenceLogs, setInferenceLogs] = useState<InferenceLog[]>([]);

  const [selectedMealDetail, setSelectedMealDetail] = useState<Meal | null>(null);
  const [voiceQueryCtx, setVoiceQueryCtx] = useState<{ query: string; foodName: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prof = await fetchHealthProfile();
    const mls = await fetchMeals();
    const lr = await fetchLabReports();
    const rem = await fetchMedicineReminders();
    const inf = await fetchInferenceLogs();

    setProfile(prof);
    setMeals(mls);
    setLabReports(lr);
    setReminders(rem);
    setInferenceLogs(inf);
  };

  const handleToggleAirplane = (enabled: boolean) => {
    setIsAirplane(enabled);
    setAirplaneMode(enabled);
  };

  const handleAskVoiceWithContext = (query: string, foodName: string) => {
    setVoiceQueryCtx({ query, foodName });
    setActiveTab('voice-assistant');
  };

  if (activeTab === 'landing') {
    return (
      <LandingPage onStart={() => setActiveTab('dashboard')} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F172A] flex flex-col">
      {/* SaaS Top Navigation Header */}
      <Topbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        profile={profile} 
        isAirplane={isAirplane} 
        setIsAirplane={handleToggleAirplane} 
      />

      {/* Airplane mode banner */}
      {isAirplane && (
        <div className="bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center tracking-wide shadow-xs flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>AIRPLANE MODE ACTIVE: 100% On-Device Edge AI & Local Rules Engine</span>
        </div>
      )}

      {/* Main Centered Workspace Container */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard 
            setActiveTab={setActiveTab} 
            meals={meals} 
            profile={profile} 
            labReports={labReports} 
            onSelectMeal={(m) => setSelectedMealDetail(m)}
          />
        )}

        {activeTab === 'scan-food' && (
          <FoodScanner 
            profile={profile} 
            setActiveTab={setActiveTab} 
            onMealAdded={loadData}
            onAskVoiceWithContext={handleAskVoiceWithContext}
          />
        )}

        {activeTab === 'voice-assistant' && (
          <VoiceAssistant 
            initialQuery={voiceQueryCtx?.query} 
            foodContext={voiceQueryCtx?.foodName} 
          />
        )}

        {activeTab === 'health-profile' && (
          <HealthProfilePage 
            profile={profile} 
            setProfile={setProfile} 
          />
        )}

        {activeTab === 'meal-history' && (
          <MealHistory 
            meals={meals} 
            onSelectMeal={(m) => setSelectedMealDetail(m)}
          />
        )}

        {activeTab === 'lab-reports' && (
          <LabReports 
            reports={labReports} 
            onReportSaved={loadData} 
          />
        )}

        {activeTab === 'packaged-food' && (
          <PackagedFood profile={profile} />
        )}

        {activeTab === 'medicine-reminders' && (
          <MedicineReminders 
            reminders={reminders} 
            onRemindersChanged={loadData} 
          />
        )}

        {activeTab === 'office-dashboard' && (
          <OfficeKitDashboard 
            meals={meals} 
            inferenceLogs={inferenceLogs} 
            profile={profile} 
            labReports={labReports} 
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage 
            profile={profile} 
            meals={meals} 
            labReports={labReports} 
          />
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Meal Detail Modal */}
      {selectedMealDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedMealDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 -mx-6 -mt-6 bg-slate-100 overflow-hidden mb-4">
              <img 
                src={selectedMealDetail.image_url || "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"} 
                alt={selectedMealDetail.food_name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <RiskBadge level={selectedMealDetail.risk_level} size="lg" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-black text-slate-900">{selectedMealDetail.food_name}</h3>
                <span className="text-xs font-semibold text-slate-500">{selectedMealDetail.portion_size} Portion</span>
              </div>

              <div className="text-xl font-extrabold text-slate-800">
                ~{selectedMealDetail.calories_min}–{selectedMealDetail.calories_max} kcal
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Carbs</div>
                  <div className="font-bold text-slate-800">{selectedMealDetail.carbs_g}g</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Protein</div>
                  <div className="font-bold text-slate-800">{selectedMealDetail.protein_g}g</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fat</div>
                  <div className="font-bold text-slate-800">{selectedMealDetail.fat_g}g</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fiber</div>
                  <div className="font-bold text-slate-800">{selectedMealDetail.fiber_g}g</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Personalized Guidance:</div>
                <p>{selectedMealDetail.ai_explanation}</p>
                <div className="pt-1 font-semibold text-brand-700">
                  Recommended Pairing: {selectedMealDetail.pairing_suggestion}
                </div>
                <div className="font-semibold text-blue-700">
                  After Meal Activity: {selectedMealDetail.activity_suggestion}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
