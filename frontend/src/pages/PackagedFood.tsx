import React, { useState } from 'react';
import { Package, Barcode, FileText, Cpu, CheckCircle2 } from 'lucide-react';
import { HealthProfile } from '../types';
import { RiskBadge, DisclaimerBanner } from '../components/Badges';
import { evaluateMealRiskLocal } from '../services/ruleEngineLocal';

interface PackagedFoodProps {
  profile: HealthProfile;
}

export const PackagedFood: React.FC<PackagedFoodProps> = ({ profile }) => {
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSimulateScan = (mode: 'barcode' | 'label') => {
    setIsScanning(true);
    setScannedProduct(null);

    setTimeout(() => {
      const demoFood = {
        name: "Multigrain Biscuits",
        category: "Packaged Snack",
        calories_per_100g: 440,
        carbs_per_100g: 64.0,
        protein_per_100g: 8.0,
        fat_per_100g: 16.0,
        fiber_per_100g: 6.0,
        sodium_level: "Medium",
        glycemic_load_tag: "Medium",
        default_portion: "Small",
        barcode: "8901234567890",
        image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80"
      };

      const evalRes = evaluateMealRiskLocal(demoFood as any, 'Small', profile);

      setScannedProduct({
        ...demoFood,
        serving_size: "3 Biscuits (30g)",
        serving_calories: 132,
        evalRes
      });
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Packaged Food Scanner</h2>
            <p className="text-xs text-slate-500">Scan barcodes or nutrition facts panels on packaged foods</p>
          </div>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSimulateScan('barcode')}
            className="p-6 bg-slate-50 hover:bg-brand-50/60 rounded-2xl border border-slate-200 hover:border-brand-400 text-left space-y-3 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-brand-700 text-base">Scan Barcode</h4>
              <p className="text-xs text-slate-500 mt-0.5">Lookup barcode in local edge database</p>
            </div>
          </button>

          <button
            onClick={() => handleSimulateScan('label')}
            className="p-6 bg-slate-50 hover:bg-brand-50/60 rounded-2xl border border-slate-200 hover:border-brand-400 text-left space-y-3 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 group-hover:text-brand-700 text-base">Scan Nutrition Label</h4>
              <p className="text-xs text-slate-500 mt-0.5">OCR scan macros and sodium content</p>
            </div>
          </button>
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-3">
            <Cpu className="w-8 h-8 text-emerald-400 mx-auto animate-spin" />
            <h4 className="font-bold">Analyzing Packaged Food Data...</h4>
            <p className="text-xs text-slate-400">On-device edge inference</p>
          </div>
        )}

        {/* Scanned Result */}
        {scannedProduct && !isScanning && (
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-4">
                <img src={scannedProduct.image_url} alt={scannedProduct.name} className="w-16 h-16 rounded-2xl object-cover border" />
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Barcode: {scannedProduct.barcode}</span>
                  <h3 className="text-2xl font-black text-slate-900">{scannedProduct.name}</h3>
                  <div className="text-xs text-slate-500">Serving size: {scannedProduct.serving_size}</div>
                </div>
              </div>
              <RiskBadge level={scannedProduct.evalRes.risk_level} size="lg" />
            </div>

            {/* Serving Macros */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nutrition Per Serving</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Calories</div>
                  <div className="font-extrabold text-slate-900 text-sm">{scannedProduct.serving_calories} kcal</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Carbs</div>
                  <div className="font-extrabold text-slate-900 text-sm">19.2g</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Protein</div>
                  <div className="font-extrabold text-slate-900 text-sm">2.4g</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Fiber</div>
                  <div className="font-extrabold text-slate-900 text-sm">1.8g</div>
                </div>
              </div>
            </div>

            {/* How this fits your profile */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-slate-900">How This Fits Your Health Profile</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {scannedProduct.evalRes.ai_explanation}
              </p>
              <div className="text-xs font-semibold text-brand-700 pt-1">
                Tip: Limit portion to 2–3 biscuits and pair with unsweetened green tea.
              </div>
            </div>
          </div>
        )}
      </div>

      <DisclaimerBanner />
    </div>
  );
};
