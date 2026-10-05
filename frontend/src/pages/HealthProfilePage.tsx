import React, { useState } from 'react';
import { User, HeartPulse, Save, CheckCircle2 } from 'lucide-react';
import { HealthProfile } from '../types';
import { saveHealthProfile } from '../services/api';
import { DisclaimerBanner } from '../components/Badges';

interface HealthProfilePageProps {
  profile: HealthProfile;
  setProfile: (p: HealthProfile) => void;
}

export const HealthProfilePage: React.FC<HealthProfilePageProps> = ({ profile, setProfile }) => {
  const [formData, setFormData] = useState<HealthProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await saveHealthProfile(formData);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const toggleCondition = (key: 'has_diabetes' | 'has_hypertension' | 'has_thyroid' | 'has_pcos') => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="saas-card p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Your Health Profile</h2>
            <p className="text-xs text-slate-500">Configure parameters used by the deterministic health rules engine</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Personal Information */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height_cm}
                  onChange={e => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight_kg}
                  onChange={e => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 outline-none focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Health Conditions (Segmented Pill Buttons) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Health Conditions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <button
                type="button"
                onClick={() => toggleCondition('has_diabetes')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                  formData.has_diabetes 
                    ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Diabetes</span>
                <span className={`text-[10px] ${formData.has_diabetes ? 'text-brand-600' : 'text-slate-400'}`}>
                  {formData.has_diabetes ? '● Active' : 'Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCondition('has_hypertension')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                  formData.has_hypertension 
                    ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Hypertension</span>
                <span className={`text-[10px] ${formData.has_hypertension ? 'text-brand-600' : 'text-slate-400'}`}>
                  {formData.has_hypertension ? '● Active' : 'Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCondition('has_thyroid')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                  formData.has_thyroid 
                    ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Thyroid</span>
                <span className={`text-[10px] ${formData.has_thyroid ? 'text-brand-600' : 'text-slate-400'}`}>
                  {formData.has_thyroid ? '● Active' : 'Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleCondition('has_pcos')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                  formData.has_pcos 
                    ? 'bg-brand-50 text-brand-700 border-brand-300 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>PCOS</span>
                <span className={`text-[10px] ${formData.has_pcos ? 'text-brand-600' : 'text-slate-400'}`}>
                  {formData.has_pcos ? '● Active' : 'Off'}
                </span>
              </button>

            </div>
          </div>

          {/* Section 3: Goals (Segmented Control) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Weight Goal</h3>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
              {['Maintain', 'Lose', 'Gain'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, weight_goal: g })}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    formData.weight_goal === g
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g} Weight
                </button>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white py-3 px-6 rounded-2xl font-extrabold text-xs shadow-md shadow-brand-600/15 flex items-center"
            >
              <Save className="w-4 h-4 mr-1.5" />
              <span>Save Health Profile</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Profile Saved!
              </span>
            )}
          </div>

        </form>

      </div>

      <DisclaimerBanner />
    </div>
  );
};
