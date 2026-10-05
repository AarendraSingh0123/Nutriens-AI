import React, { useState } from 'react';
import { FileText, Upload, Cpu, CheckCircle2, Edit3, Save, TrendingUp, AlertCircle } from 'lucide-react';
import { LabReport, LabValue } from '../types';
import { analyzeLabReport, saveLabReport } from '../services/api';
import { DisclaimerBanner } from '../components/Badges';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LabReportsProps {
  reports: LabReport[];
  onReportSaved: () => void;
}

export const LabReports: React.FC<LabReportsProps> = ({ reports, onReportSaved }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedValues, setExtractedValues] = useState<LabValue[] | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleUploadReport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      setExtractedValues(null);
      setSavedSuccess(false);

      setTimeout(async () => {
        const res = await analyzeLabReport(e.target.files![0]);
        setExtractedValues(res.extracted_data.values as LabValue[]);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleDemoUpload = () => {
    setIsProcessing(true);
    setExtractedValues(null);
    setSavedSuccess(false);

    setTimeout(() => {
      setExtractedValues([
        { parameter: "HbA1c", value: 7.2, unit: "%", reference_range: "< 5.7 %", flag: "Borderline" },
        { parameter: "Fasting Glucose", value: 138.0, unit: "mg/dL", reference_range: "70–99 mg/dL", flag: "High" },
        { parameter: "Post-meal Glucose", value: 186.0, unit: "mg/dL", reference_range: "< 140 mg/dL", flag: "High" }
      ]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleValueChange = (index: number, val: number) => {
    if (!extractedValues) return;
    const updated = [...extractedValues];
    updated[index].value = val;
    setExtractedValues(updated);
  };

  const handleConfirmAndSave = async () => {
    if (!extractedValues) return;
    await saveLabReport("Recent Lab Report", extractedValues);
    setSavedSuccess(true);
    onReportSaved();
    setTimeout(() => {
      setExtractedValues(null);
      setSavedSuccess(false);
    }, 2000);
  };

  // Prepare chart data
  const chartData = [
    { date: 'Jul 15', HbA1c: 7.6, FastingGlucose: 148, PostMealGlucose: 204 },
    { date: 'Aug 20', HbA1c: 7.4, FastingGlucose: 142, PostMealGlucose: 192 },
    { date: 'Oct 01', HbA1c: 7.2, FastingGlucose: 138, PostMealGlucose: 186 }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Upload & OCR Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Scan Lab Report</h2>
            <p className="text-xs text-slate-500">Extract HbA1c, Fasting & Post-meal Glucose via ML Kit OCR</p>
          </div>
        </div>

        {!extractedValues && !isProcessing && (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Upload a photograph or PDF of your medical lab report.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <label className="bg-brand-600 hover:bg-brand-700 text-white py-3 px-5 rounded-xl font-bold text-xs shadow-md shadow-brand-600/15 cursor-pointer flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                <span>Upload Lab PDF/Image</span>
                <input type="file" onChange={handleUploadReport} className="hidden" />
              </label>

              <button
                onClick={handleDemoUpload}
                className="bg-slate-800 hover:bg-slate-900 text-white py-3 px-5 rounded-xl font-semibold text-xs transition-colors"
              >
                Use Demo Lab Report
              </button>
            </div>
          </div>
        )}

        {/* OCR Processing State */}
        {isProcessing && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-3">
            <Cpu className="w-8 h-8 text-emerald-400 mx-auto animate-spin" />
            <h4 className="font-bold text-base">Running On-Device ML Kit OCR...</h4>
            <p className="text-xs text-slate-400">Extracting metabolic parameters with 0 cloud transmission.</p>
          </div>
        )}

        {/* Extracted Values with MANDATORY verification & edit capability */}
        {extractedValues && !isProcessing && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">OCR Extracted Values</span>
                <h3 className="text-lg font-extrabold text-slate-900">Extracted Lab Parameters</h3>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-brand-600 hover:underline flex items-center"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                <span>{isEditing ? 'Done Editing' : 'Edit Values'}</span>
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-semibold flex items-center">
              <AlertCircle className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
              <span>Please verify extracted values before saving.</span>
            </div>

            <div className="space-y-3">
              {extractedValues.map((val, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{val.parameter}</div>
                    <div className="text-xs text-slate-400">Ref: {val.reference_range}</div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={val.value}
                        onChange={(e) => handleValueChange(idx, Number(e.target.value))}
                        className="w-24 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 outline-none"
                      />
                    ) : (
                      <span className="text-lg font-black text-slate-900">{val.value} <span className="text-xs text-slate-500 font-medium">{val.unit}</span></span>
                    )}

                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      val.flag === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {val.flag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleConfirmAndSave}
                disabled={savedSuccess}
                className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center transition-all ${
                  savedSuccess ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    <span>Saved to Database!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>Confirm & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Health Trends Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">HbA1c & Fasting Glucose History</h3>
            <p className="text-xs text-slate-500">Track longitudinal lab parameters</p>
          </div>
          <TrendingUp className="w-5 h-5 text-brand-600" />
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
              <YAxis yAxisId="hba1c" domain={[5.0, 9.0]} stroke="#16A34A" fontSize={11} />
              <YAxis yAxisId="glucose" orientation="right" domain={[100, 220]} stroke="#0F766E" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
              <Line yAxisId="hba1c" type="monotone" dataKey="HbA1c" stroke="#16A34A" strokeWidth={3} name="HbA1c (%)" />
              <Line yAxisId="glucose" type="monotone" dataKey="FastingGlucose" stroke="#0F766E" strokeWidth={2} name="Fasting Glucose (mg/dL)" />
              <Line yAxisId="glucose" type="monotone" dataKey="PostMealGlucose" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" name="Post-meal Glucose (mg/dL)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
};
