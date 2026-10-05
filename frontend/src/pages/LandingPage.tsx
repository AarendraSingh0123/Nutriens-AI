import React from 'react';
import { 
  Camera, ShieldCheck, WifiOff, ArrowRight, Cpu, FileText, Mic, HeartPulse, 
  Package, ChevronRight, Activity, CheckCircle2, Lock 
} from 'lucide-react';
import { DisclaimerBanner } from '../components/Badges';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100">
      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">NutriLens <span className="text-brand-600">AI</span></span>
            <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Hackathon MVP</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onStart}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] flex items-center"
          >
            <span>Try NutriLens AI</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
              <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% On-Device • Zero Internet Required</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
              Know what your food means for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-600 to-emerald-600">YOU.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              AI-powered personalized nutrition guidance for Indian meals — designed to work completely offline with zero cloud latency.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onStart}
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.02] flex items-center justify-center"
              >
                <span>Launch Demo Application</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={onStart}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-semibold text-base transition-colors flex items-center justify-center"
              >
                <span>Explore Indian Food Scanner</span>
              </button>
            </div>

            <div className="pt-4 flex items-center space-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> Structured Nutrition DB</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> Deterministic Rules</span>
              <span className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" /> Private Edge AI</span>
            </div>
          </div>

          {/* Hero Visual mockup */}
          <div className="lg:col-span-5 relative">
            <div className="w-full max-w-sm mx-auto bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
              <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-4"></div>
              
              <div className="bg-slate-950 rounded-[28px] overflow-hidden text-white border border-slate-800 p-4 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80" 
                    alt="Masala Dosa" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 border border-emerald-500/40">
                    NPU: 42ms • 92% Conf
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Detected Meal</span>
                    <h3 className="font-bold text-lg text-white leading-tight">MASALA DOSA</h3>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estimated Nutrition</span>
                    <span className="font-bold text-emerald-400">320–380 kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1 border-t border-slate-800">
                    <div className="bg-slate-800/60 p-1 rounded">
                      <div className="text-slate-400">Carbs</div>
                      <div className="font-semibold text-white">45–55g</div>
                    </div>
                    <div className="bg-slate-800/60 p-1 rounded">
                      <div className="text-slate-400">Protein</div>
                      <div className="font-semibold text-white">7–10g</div>
                    </div>
                    <div className="bg-slate-800/60 p-1 rounded">
                      <div className="text-slate-400">Fat</div>
                      <div className="font-semibold text-white">10–14g</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-400">Profile: Type 2 Diabetes</div>
                    <div className="font-semibold text-white">MEDIUM RISK</div>
                  </div>
                  <button 
                    onClick={onStart}
                    className="bg-brand-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                  >
                    View Tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why NutriLens Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why NutriLens AI?</h2>
            <p className="text-slate-600 mt-2 text-base">Built specifically for Indian dietary habits and chronic health condition management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xl mb-4">
                🍛
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Indian Food Native</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Trained on 30+ staple Indian dishes, snacks, and street foods from Dosa and Rajma Rice to Pav Bhaji and Chole Bhature.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">
                🩺
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Condition-Aware Rules</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates meals against deterministic clinical rules for Diabetes, Hypertension, PCOS, and Thyroid dietary requirements.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Offline AI</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Runs edge vision and LLM models locally on device NPU. Functions smoothly in remote areas or airplane mode with 0 latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
          <p className="text-slate-600 mt-2 text-base">Simple 3-step edge intelligence workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Scan Your Meal</h3>
            <p className="text-slate-600 text-sm">Snap a photo or upload an image. The on-device classifier identifies Indian dishes in 42ms.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Deterministic Evaluation</h3>
            <p className="text-slate-600 text-sm">Structured nutrition database + transparent health rules evaluate risk without LLM hallucination.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Personalized Guidance</h3>
            <p className="text-slate-600 text-sm">Get portion recommendations, food pairings (e.g. Sambar), and short post-meal activity tips.</p>
          </div>
        </div>
      </section>

      {/* Edge AI Pipeline Architecture */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">Technical Architecture</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Powered by Edge AI & Snapdragon NPU</h2>
            <p className="text-slate-400 mt-2 text-sm">Zero cloud dependencies — complete user privacy and deterministic safety.</p>
          </div>

          {/* Architecture Pipeline Diagram */}
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 max-w-5xl mx-auto overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] text-center space-x-3 text-xs">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <Camera className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                <div className="font-bold text-white">Camera Feed</div>
                <div className="text-[11px] text-slate-400">CameraX API</div>
              </div>

              <div className="text-slate-600 font-bold">➔</div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <Cpu className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <div className="font-bold text-white">Food AI (42ms)</div>
                <div className="text-[11px] text-slate-400">EfficientNet-Lite0 / LiteRT</div>
              </div>

              <div className="text-slate-600 font-bold">➔</div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <Activity className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="font-bold text-white">Nutrition DB</div>
                <div className="text-[11px] text-slate-400">Structured Indian Foods</div>
              </div>

              <div className="text-slate-600 font-bold">➔</div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="font-bold text-white">Health Rules</div>
                <div className="text-[11px] text-slate-400">Deterministic Engine</div>
              </div>

              <div className="text-slate-600 font-bold">➔</div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <Mic className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="font-bold text-white">Local LLM</div>
                <div className="text-[11px] text-slate-400">Gemma 2B Advice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Features Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Comprehensive Hackathon MVP Feature Suite</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <Camera className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Food Scanner</h4>
              <p className="text-xs text-slate-500">Detects Indian dishes with calorie & macro ranges.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <HeartPulse className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Health Profile</h4>
              <p className="text-xs text-slate-500">Diabetes, Hypertension, PCOS & Thyroid customization.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <Mic className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Voice Assistant</h4>
              <p className="text-xs text-slate-500">Ask questions using speech recognition & TTS.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <FileText className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Lab Reports OCR</h4>
              <p className="text-xs text-slate-500">Extracts HbA1c & glucose with verification.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <Package className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Packaged Foods</h4>
              <p className="text-xs text-slate-500">Scan barcodes and nutrition labels on device.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-start space-x-3">
            <Lock className="w-6 h-6 text-brand-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Privacy</h4>
              <p className="text-xs text-slate-500">Health data remains strictly local on device.</p>
            </div>
          </div>
        </div>

        <DisclaimerBanner />
      </section>

      {/* Footer CTA */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <span className="font-bold text-slate-900">NutriLens AI</span> — Personal nutrition guidance that works without internet.
          </div>
          <button 
            onClick={onStart} 
            className="mt-4 sm:mt-0 font-bold text-brand-600 hover:text-brand-700 underline"
          >
            Launch Interactive Application ➔
          </button>
        </div>
      </footer>
    </div>
  );
};
