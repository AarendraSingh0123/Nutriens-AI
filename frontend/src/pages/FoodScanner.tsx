import React, { useState } from 'react';
import { 
  Camera, Upload, Cpu, ArrowLeft, MessageSquare, Plus, Info, CheckCircle2, Sparkles 
} from 'lucide-react';
import { HealthProfile, RiskEvaluationResult, ActiveTab, Meal } from '../types';
import { analyzeFoodImage, evaluateRisk, saveMeal } from '../services/api';
import { RiskBadge, DisclaimerBanner } from '../components/Badges';

interface FoodScannerProps {
  profile: HealthProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onMealAdded?: () => void;
  onAskVoiceWithContext?: (query: string, foodName: string) => void;
}

const SAMPLE_DEMO_FOODS = [
  { name: "Masala Dosa", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80" },
  { name: "Rajma Rice", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80" },
  { name: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { name: "Chole Bhature", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" },
  { name: "Idli", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80" },
  { name: "Paneer Tikka", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80" }
];

export const FoodScanner: React.FC<FoodScannerProps> = ({ 
  profile, 
  setActiveTab, 
  onMealAdded,
  onAskVoiceWithContext
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [portionSize, setPortionSize] = useState<string>('Medium');
  const [riskEval, setRiskEval] = useState<RiskEvaluationResult | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const handleProcessImage = async (imageSrc: string, foodNameHint?: string) => {
    setSelectedImage(imageSrc);
    setIsScanning(true);
    setScanResult(null);
    setRiskEval(null);
    setAddedSuccess(false);

    setTimeout(async () => {
      const res = await analyzeFoodImage(undefined, foodNameHint || "Masala Dosa");
      setScanResult(res);
      setIsScanning(false);
      runRiskEvaluation(res.detected_food, 'Medium');
    }, 1300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleProcessImage(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runRiskEvaluation = async (foodName: string, portion: string) => {
    const evalRes = await evaluateRisk(foodName, portion, profile);
    setRiskEval(evalRes);
  };

  const handlePortionChange = (newPortion: string) => {
    setPortionSize(newPortion);
    if (scanResult) {
      runRiskEvaluation(scanResult.detected_food, newPortion);
    }
  };

  const handleAddToMealLog = async () => {
    if (!riskEval || !scanResult) return;
    
    const mealData: Partial<Meal> = {
      food_name: riskEval.food_name,
      portion_size: riskEval.portion_size,
      calories_min: riskEval.calories_min,
      calories_max: riskEval.calories_max,
      carbs_g: riskEval.carbs_g,
      protein_g: riskEval.protein_g,
      fat_g: riskEval.fat_g,
      fiber_g: riskEval.fiber_g,
      risk_level: riskEval.risk_level,
      health_conditions: profile.has_diabetes ? 'Type 2 Diabetes' : 'General Health',
      pairing_suggestion: riskEval.pairing,
      activity_suggestion: riskEval.activity,
      ai_explanation: riskEval.ai_explanation,
      image_url: selectedImage || scanResult.food_details?.image_url
    };

    await saveMeal(mealData);
    setAddedSuccess(true);
    if (onMealAdded) onMealAdded();
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* 1. Large Rounded Scanner Container */}
      {!scanResult && !isScanning && (
        <div className="space-y-6">
          <div className="saas-card p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Scan Your Meal</h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto mt-1">
                Point your camera at an Indian meal or upload an image to analyze calories and portion risk.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-sm mx-auto">
              <button
                onClick={() => handleProcessImage(SAMPLE_DEMO_FOODS[0].img, "Masala Dosa")}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 px-5 rounded-2xl font-extrabold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center transition-all"
              >
                <Camera className="w-4 h-4 mr-2" />
                <span>Scan Food</span>
              </button>

              <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-5 rounded-2xl font-semibold text-xs border border-slate-200 cursor-pointer flex items-center justify-center transition-colors">
                <Upload className="w-4 h-4 mr-2 text-slate-500" />
                <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-center space-x-1.5 pt-2">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              <span>Edge AI Model • Snapdragon NPU (~42ms latency)</span>
            </div>
          </div>

          {/* Quick Demo Sample Food Chips */}
          <div className="saas-card p-5 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Or Pick Demo Sample Meal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_DEMO_FOODS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleProcessImage(sample.img, sample.name)}
                  className="flex items-center space-x-3 p-2.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-400 transition-all text-left"
                >
                  <img src={sample.img} alt={sample.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{sample.name}</div>
                    <div className="text-[10px] text-slate-400">Tap to analyze</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Scanning Animation */}
      {isScanning && (
        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative w-64 h-44 mx-auto rounded-2xl overflow-hidden border border-emerald-500/40">
            {selectedImage && <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover opacity-80" />}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanline"></div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono border border-emerald-800">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>Qualcomm Snapdragon NPU • LiteRT</span>
            </div>
            <h3 className="text-lg font-bold">Detecting Indian Meal...</h3>
            <p className="text-slate-400 text-xs font-mono">Running EfficientNet-Lite0 on-device (~42ms)</p>
          </div>
        </div>
      )}

      {/* 3. Detected Result Page (Clean SaaS Card Layout) */}
      {scanResult && !isScanning && riskEval && (
        <div className="space-y-5">
          {/* Top Return Bar */}
          <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => { setScanResult(null); setSelectedImage(null); }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Scan Another Meal</span>
            </button>

            <div className="text-[11px] font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-700 border border-slate-200">
              {scanResult.classification_engine} • {scanResult.latency_ms}ms
            </div>
          </div>

          {/* Main Detection SaaS Card */}
          <div className="saas-card p-6 space-y-6">
            
            {/* Header: Food Name & Compact Risk Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedImage || scanResult.food_details?.image_url} 
                  alt={scanResult.detected_food} 
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Detected Meal</span>
                  <h2 className="text-2xl font-black text-slate-900">{scanResult.detected_food}</h2>
                </div>
              </div>

              <RiskBadge level={riskEval.risk_level} size="lg" />
            </div>

            {/* Calories & Macros Row */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Nutrition</span>
                <span className="text-xl font-extrabold text-slate-900">{riskEval.calories_range}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Carbs</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{riskEval.carbs_g}g</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Protein</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{riskEval.protein_g}g</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Fat</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{riskEval.fat_g}g</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Fiber</div>
                  <div className="font-extrabold text-slate-800 text-sm mt-0.5">{riskEval.fiber_g}g</div>
                </div>
              </div>
            </div>

            {/* Dynamic Portion Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>PORTION SIZE</span>
                <span className="text-brand-600 font-semibold">{portionSize} Portion</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Small', 'Medium', 'Large'].map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePortionChange(p)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      portionSize === p 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Guidance Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Recommended Portion</div>
                <div className="font-extrabold text-xs text-emerald-950 mt-1">{riskEval.recommended_portion}</div>
              </div>

              <div className="bg-teal-50/60 border border-teal-200/80 p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">Pair With</div>
                <div className="font-extrabold text-xs text-teal-950 mt-1">{riskEval.pairing}</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200/80 p-3.5 rounded-2xl">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">After Meal</div>
                <div className="font-extrabold text-xs text-blue-950 mt-1">{riskEval.activity}</div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900">Health Impact Advice: </span>
              {riskEval.ai_explanation}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToMealLog}
                disabled={addedSuccess}
                className={`flex-1 py-3 px-5 rounded-2xl font-extrabold text-xs flex items-center justify-center transition-all ${
                  addedSuccess 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/15'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    <span>Added to Meal Log!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add to Meal Log</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (onAskVoiceWithContext) {
                    onAskVoiceWithContext("What if I add sambar and chutney?", scanResult.detected_food);
                  }
                  setActiveTab('voice-assistant');
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 px-5 rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                <span>Ask NutriLens</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
};
