import React, { useState } from 'react';
import { History, Calendar, Filter, Eye } from 'lucide-react';
import { Meal } from '../types';
import { RiskBadge, DisclaimerBanner } from '../components/Badges';

interface MealHistoryProps {
  meals: Meal[];
  onSelectMeal?: (meal: Meal) => void;
}

export const MealHistory: React.FC<MealHistoryProps> = ({ meals, onSelectMeal }) => {
  const [filter, setFilter] = useState<'today' | '7days' | '30days'>('today');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Meal History Timeline</h2>
              <p className="text-xs text-slate-500">Track your past meals and nutritional risk impact</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 self-start sm:self-auto">
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('7days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === '7days' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setFilter('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === '30days' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-3 pt-2">
          {meals.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No meals logged for this period. Scan a meal to get started!
            </div>
          ) : (
            meals.map((meal) => (
              <div 
                key={meal.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={meal.image_url || "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"} 
                    alt={meal.food_name} 
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{meal.food_name}</h4>
                      <RiskBadge level={meal.risk_level} size="sm" />
                    </div>
                    <div className="text-xs text-slate-500 flex items-center space-x-2">
                      <span>{meal.portion_size} portion</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">~{meal.calories_min}–{meal.calories_max} kcal</span>
                      <span>•</span>
                      <span>{meal.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      Condition: {meal.health_conditions}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectMeal && onSelectMeal(meal)}
                  className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>View Details</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
