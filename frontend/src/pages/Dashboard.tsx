import React, { useState } from 'react';
import { 
  Camera, Upload, Flame, Utensils, HeartPulse, FileText, ArrowRight, Eye, 
  Activity, CheckCircle2, TrendingUp, Calendar, Sparkles, ChevronDown 
} from 'lucide-react';
import { ActiveTab, HealthProfile, Meal, LabReport } from '../types';
import { RiskBadge, DisclaimerBanner } from '../components/Badges';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  meals: Meal[];
  profile: HealthProfile;
  labReports: LabReport[];
  onSelectMeal?: (meal: Meal) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  setActiveTab, 
  meals, 
  profile, 
  labReports,
  onSelectMeal 
}) => {
  const [chartMetric, setChartMetric] = useState<'Calories' | 'Carbs' | 'Protein' | 'Fat'>('Calories');

  const totalCalories = meals.reduce((sum, m) => sum + Math.round((m.calories_min + m.calories_max) / 2), 0);
  const mealsCount = meals.length;

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Chart data for weekly nutrition overview
  const weeklyNutritionData = [
    { day: 'Mon', Calories: 1240, Carbs: 145, Protein: 42, Fat: 38 },
    { day: 'Tue', Calories: 1380, Carbs: 160, Protein: 48, Fat: 42 },
    { day: 'Wed', Calories: 1190, Carbs: 130, Protein: 45, Fat: 35 },
    { day: 'Thu', Calories: 1420, Carbs: 170, Protein: 52, Fat: 44 },
    { day: 'Fri', Calories: 1280, Carbs: 140, Protein: 50, Fat: 39 },
    { day: 'Sat', Calories: 1350, Carbs: 155, Protein: 46, Fat: 41 },
    { day: 'Sun', Calories: 1240, Carbs: 142, Protein: 44, Fat: 36 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {profile.name}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
            Here's your nutrition and health overview for today.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span>{currentDateStr}</span>
        </div>
      </div>

      {/* 2. Four Compact Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Calories */}
        <div className="saas-card p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Calories</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalCalories.toLocaleString()} <span className="text-xs font-medium text-slate-500">kcal</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Meals Count */}
        <div className="saas-card p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meals Logged</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{mealsCount} <span className="text-xs font-medium text-slate-500">meals</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Health Score */}
        <div className="saas-card p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Health Score</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">82 <span className="text-xs font-medium text-slate-500">/ 100</span></div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Lab Status */}
        <div className="saas-card p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lab Status</div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              Stable / Tracking
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Health Overview & Nutrition Chart */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Health Overview Card */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Your Health Overview</h3>
                <p className="text-xs text-slate-500">Condition-aware telemetry & dietary balance score</p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-1 rounded-full">
                {profile.has_diabetes ? 'Type 2 Diabetes Active' : 'General Monitoring'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Indicator 1 */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Condition</div>
                <div className="font-extrabold text-slate-800 text-xs sm:text-sm">Monitoring</div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full w-[85%]"></div>
                </div>
              </div>

              {/* Indicator 2 */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Nutrition Balance</div>
                <div className="font-extrabold text-slate-800 text-xs sm:text-sm">82%</div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[82%]"></div>
                </div>
              </div>

              {/* Indicator 3 */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Meal Quality</div>
                <div className="font-extrabold text-emerald-700 text-xs sm:text-sm">Good</div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[78%]"></div>
                </div>
              </div>

              {/* Indicator 4 */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Post-Meal Walk</div>
                <div className="font-extrabold text-slate-800 text-xs sm:text-sm">18 min</div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[90%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Chart Card */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Nutrition Overview</h3>
                <p className="text-xs text-slate-500">Weekly breakdown across key macronutrients</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Metric Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  {(['Calories', 'Carbs', 'Protein', 'Fat'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setChartMetric(m)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        chartMetric === m ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Dropdown */}
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-xl">
                  <span>This week</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Clean Line Chart */}
            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyNutritionData}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={chartMetric} 
                    stroke={chartMetric === 'Calories' ? '#16A34A' : chartMetric === 'Carbs' ? '#0F766E' : chartMetric === 'Protein' ? '#2563EB' : '#D97706'} 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Quick Scan Action Card & Recent Meals */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Scan Card ("What's on your plate?") */}
          <div className="bg-gradient-to-tr from-brand-600 via-teal-600 to-emerald-700 text-white p-6 rounded-3xl shadow-md relative overflow-hidden space-y-4">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-100 font-bold bg-white/10 px-2.5 py-1 rounded-full">
                Edge AI Meal Scanner
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">What's on your plate?</h3>
              <p className="text-brand-50 text-xs sm:text-sm leading-relaxed max-w-xs">
                Scan your Indian meal and get personalized portion & food pairing guidance in 42ms.
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-3 relative z-10">
              <button
                onClick={() => setActiveTab('scan-food')}
                className="bg-white text-brand-700 hover:bg-brand-50 px-5 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center"
              >
                <Camera className="w-4 h-4 mr-1.5 text-brand-600" />
                <span>+ Scan Food</span>
              </button>

              <button
                onClick={() => setActiveTab('scan-food')}
                className="bg-black/20 hover:bg-black/30 text-white px-4 py-3 rounded-2xl font-semibold text-xs border border-white/20 transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                <span>Upload Image</span>
              </button>
            </div>

            <div className="absolute -right-4 -bottom-6 opacity-15 text-[120px] select-none">
              🍛
            </div>
          </div>

          {/* Recent Meals Card */}
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Recent Meals</h3>
                <p className="text-xs text-slate-500">Today's dietary log</p>
              </div>
              <button
                onClick={() => setActiveTab('meal-history')}
                className="text-xs font-bold text-brand-600 hover:underline flex items-center"
              >
                <span>View Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* Compact Rows */}
            <div className="space-y-3">
              {meals.map((meal) => (
                <div 
                  key={meal.id}
                  onClick={() => onSelectMeal && onSelectMeal(meal)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={meal.image_url || "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80"} 
                      alt={meal.food_name} 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{meal.food_name}</h4>
                      <span className="text-[11px] text-slate-400">{meal.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="font-extrabold text-xs text-slate-900">
                      ~{(meal.calories_min + meal.calories_max) / 2} kcal
                    </div>
                    <RiskBadge level={meal.risk_level} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <DisclaimerBanner />
    </div>
  );
};
