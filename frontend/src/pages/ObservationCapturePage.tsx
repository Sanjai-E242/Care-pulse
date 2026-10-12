import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, Keyboard, Sparkles, Check, Edit3, X, AlertTriangle,
  ArrowRight, ShieldAlert, HeartHandshake, CheckCircle2, ChevronDown
} from 'lucide-react';
import { patientApi, observationApi } from '../services/api';
import { Patient, ObservationExtractionResult } from '../types';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { EmergencyModal } from '../components/EmergencyModal';

export const ObservationCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [extractedResult, setExtractedResult] = useState<ObservationExtractionResult | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successSaved, setSuccessSaved] = useState<boolean>(false);

  useEffect(() => {
    patientApi.getAll().then((data) => {
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(data[0].id);
      }
    });
  }, []);

  const handleVoiceTranscript = (text: string) => {
    setRawText((prev) => (prev ? prev + ' ' + text : text));
  };

  const handleQuickPrompt = (sampleText: string) => {
    setRawText(sampleText);
  };

  const handleAnalyze = async () => {
    if (!rawText.trim() || !selectedPatientId) return;
    setAnalyzing(true);
    try {
      const result = await observationApi.analyze({
        patientId: selectedPatientId,
        rawText,
        inputMethod: isVoiceMode ? 'VOICE' : 'TEXT',
      });
      setExtractedResult(result);
      if (result.isEmergency) {
        setShowEmergencyModal(true);
      }
      setShowConfirmModal(true);
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!selectedPatientId || !extractedResult) return;
    setSaving(true);
    try {
      await observationApi.confirm({
        patientId: selectedPatientId,
        rawText,
        inputMethod: isVoiceMode ? 'VOICE' : 'TEXT',
        extractedData: extractedResult,
      });
      setSuccessSaved(true);
      setTimeout(() => {
        navigate(`/patients/${selectedPatientId}`);
      }, 1800);
    } catch (err) {
      console.error('Failed to confirm observation', err);
    } finally {
      setSaving(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
          Intelligent Observation Capture
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Tell us what happened</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          No complex forms. Simply speak or type what you noticed, and CarePulse AI will structure the care signals.
        </p>
      </div>

      {/* Success Notification */}
      {successSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-bold">
            Observation successfully structured and logged to patient care timeline. Redirecting...
          </p>
        </div>
      )}

      {/* Main Capture Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Patient Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Who is this observation about?
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPatientId(p.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
                  selectedPatientId === p.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {p.fullName} ({p.age})
              </button>
            ))}
          </div>
        </div>

        {/* Input Toggle (Voice vs Text) */}
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setIsVoiceMode(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              isVoiceMode ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Voice</span>
          </button>
          <button
            type="button"
            onClick={() => setIsVoiceMode(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              !isVoiceMode ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Type Observation</span>
          </button>
        </div>

        {/* Voice Interface */}
        {isVoiceMode && (
          <div className="py-4 text-center space-y-2">
            <VoiceRecorder
              onTranscript={handleVoiceTranscript}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </div>
        )}

        {/* Observation Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tell us what you noticed:
            </label>
            {rawText && (
              <button
                type="button"
                onClick={() => setRawText('')}
                className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
              >
                Clear text
              </button>
            )}
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={4}
            placeholder="e.g. I noticed that my mother refused breakfast twice today and seemed more confused than usual around noon..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed shadow-inner"
          />
        </div>

        {/* Demo Quick Prompts */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Demo Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPrompt("Mom refused breakfast twice today and seemed more confused than usual.")}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:border-teal-300 dark:hover:border-teal-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition text-left"
            >
              🍽 Appetite + Confusion Scenario
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt("The patient fell while getting out of bed this morning and has knee pain.")}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition text-left"
            >
              ⚠️ Fall Incident Scenario
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt("Patient experienced severe breathing difficulty and chest pain.")}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition text-left"
            >
              🚨 Emergency Red-Flag Scenario
            </button>
          </div>
        </div>

        {/* Submit & Process Button */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing || !rawText.trim()}
          className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{analyzing ? 'Extracting clinical signals with AI...' : 'Submit for AI Signal Extraction'}</span>
        </button>
      </div>

      {/* Confirmation Modal: "We understood this as: ... Is this correct?" */}
      {showConfirmModal && extractedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">We understood this as:</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Extracted Card Badges */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{extractedResult.category.replace('_', ' ')}</p>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Severity</span>
                  <p className={`font-bold mt-0.5 ${
                    extractedResult.severity === 'HIGH' || extractedResult.severity === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {extractedResult.severity}
                  </p>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">🍽 Appetite</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{extractedResult.appetite}</p>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">🧠 Cognition</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{extractedResult.cognitiveChange.replace('_', ' ')}</p>
                </div>
              </div>

              {extractedResult.recommendedAction && (
                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-900 dark:text-teal-200">
                  <span className="font-bold">Recommended Action: </span>
                  <span>{extractedResult.recommendedAction.replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>

            {/* Verification Prompt */}
            <div className="text-center pt-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Is this information correct?</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-2xl transition"
                >
                  Edit Note
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving to Database...' : 'Confirm & Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Modal if Red-Flag Symptoms Triggered */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        message="Critical symptoms such as breathing difficulty, severe chest pain, or acute neurological signs require immediate clinical assessment."
      />
    </div>
  );
};