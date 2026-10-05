import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, Trash2, Clock, Info } from 'lucide-react';
import { MedicineReminder } from '../types';
import { addMedicineReminder, toggleMedicineReminder, deleteMedicineReminder } from '../services/api';
import { DisclaimerBanner } from '../components/Badges';

interface MedicineRemindersProps {
  reminders: MedicineReminder[];
  onRemindersChanged: () => void;
}

export const MedicineReminders: React.FC<MedicineRemindersProps> = ({ 
  reminders, 
  onRemindersChanged 
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [medName, setMedName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('1 Tablet');
  const [medTime, setMedTime] = useState<string>('08:00 PM');
  const [notes, setNotes] = useState<string>('Take after meal');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    await addMedicineReminder({
      medicine_name: medName,
      dosage,
      time: medTime,
      frequency: 'Daily',
      notes
    });

    setMedName('');
    setShowAddModal(false);
    onRemindersChanged();
  };

  const handleToggle = async (id: number) => {
    await toggleMedicineReminder(id);
    onRemindersChanged();
  };

  const handleDelete = async (id: number) => {
    await deleteMedicineReminder(id);
    onRemindersChanged();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Medicine Reminders</h2>
              <p className="text-xs text-slate-500">Store and track user-configured prescription times</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Add Reminder</span>
          </button>
        </div>

        {/* Mandatory Medical Disclaimer Notice */}
        <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 font-medium flex items-start space-x-2">
          <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">User Schedule Storage Only:</span> NutriLens AI does NOT recommend medications or adjust dosages. Reminders are configured solely by you based on your physician's prescription.
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                r.is_completed 
                  ? 'bg-slate-50 border-slate-200 opacity-60' 
                  : 'bg-white border-slate-200 hover:border-brand-300 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => r.id && handleToggle(r.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    r.is_completed 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 hover:border-brand-500'
                  }`}
                >
                  {r.is_completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className={`font-extrabold text-base text-slate-900 ${r.is_completed ? 'line-through' : ''}`}>
                    {r.medicine_name} <span className="text-xs font-semibold text-slate-500">({r.dosage})</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span className="flex items-center font-semibold text-slate-700"><Clock className="w-3.5 h-3.5 mr-1" />{r.time}</span>
                    <span>•</span>
                    <span>{r.notes}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  r.is_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {r.is_completed ? 'Completed' : 'Upcoming'}
                </span>

                <button
                  onClick={() => r.id && handleDelete(r.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-lg text-slate-900">Add Medicine Reminder</h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={medName}
                  onChange={e => setMedName(e.target.value)}
                  placeholder="e.g. Metformin"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dosage</label>
                <input
                  type="text"
                  value={dosage}
                  onChange={e => setDosage(e.target.value)}
                  placeholder="e.g. 500 mg"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reminder Time</label>
                <input
                  type="text"
                  value={medTime}
                  onChange={e => setMedTime(e.target.value)}
                  placeholder="e.g. 08:00 PM"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Take after dinner"
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
