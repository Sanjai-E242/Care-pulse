import React, { useEffect, useState } from 'react';
import { patientApi, handoverApi } from '../services/api';
import { Patient, Handover } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  ArrowRightLeft, Sparkles, Copy, Printer, CheckCircle, Clock,
  AlertTriangle, Check, ShieldCheck
} from 'lucide-react';
import { getCurrentShift, SHIFTS } from '../utils/shift';

export const HandoverPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [selectedShift, setSelectedShift] = useState<string>(() => getCurrentShift().label);
  const [generating, setGenerating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    patientApi.getAll().then((data) => {
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(data[0].id);
        fetchHandovers(data[0].id);
      }
    });
  }, []);

  const fetchHandovers = (pId: number) => {
    setLoading(true);
    handoverApi.getByPatient(pId)
      .then((data) => setHandovers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handlePatientChange = (pId: number) => {
    setSelectedPatientId(pId);
    fetchHandovers(pId);
  };

  const handleGenerate = async () => {
    if (!selectedPatientId) return;
    setGenerating(true);
    try {
      const created = await handoverApi.generate({
        patientId: selectedPatientId,
        shiftName: selectedShift,
      });
      setHandovers([created, ...handovers]);
    } catch (err) {
      console.error('Failed to generate handover', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkReviewed = async (id: number) => {
    try {
      const updated = await handoverApi.markReviewed(id);
      setHandovers(handovers.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (h: Handover) => {
    const text = `
CAREPULSE AI - SHIFT HANDOVER
Patient: ${h.patientName}
Shift: ${h.shiftName}
Generated: ${new Date(h.createdAt).toLocaleString()}

TOP OBSERVATIONS:
${h.topObservations?.map(o => '- ' + o).join('\n')}

EMERGING PATTERN:
${h.emergingPattern}

WATCH ITEMS:
${h.watchItems?.map(w => '- ' + w).join('\n')}

COMPLETED TASKS:
${h.completedTasks?.map(t => '- ' + t).join('\n')}

PENDING TASKS:
${h.pendingTasks?.map(t => '- ' + t).join('\n')}

* AI-generated handover. Verify important information with clinical staff.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedId(h.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-900/60">
            Clinical Continuity
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Intelligent Shift Handover</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synthesize cross-shift observations, watch items, and pending care tasks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            title="Target Shift for Handover"
          >
            {SHIFTS.map((s) => (
              <option key={s.label} value={s.label}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={generating || !selectedPatientId}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{generating ? 'Synthesizing...' : 'Generate Handover'}</span>
          </button>
        </div>
      </div>

      {/* Patient Selector Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {patients.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePatientChange(p.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold border transition flex-shrink-0 ${
              selectedPatientId === p.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {p.fullName} ({p.age})
          </button>
        ))}
      </div>

      {/* Handover List */}
      {loading ? (
        <LoadingSpinner message="Retrieving handover records..." />
      ) : handovers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <ArrowRightLeft className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Handover Generated Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Click "Generate Handover" to aggregate recent shift observations, emerging patterns, and pending tasks.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Generate Handover
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {handovers.map((h) => (
            <div key={h.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
              
              {/* Handover Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                      {h.shiftName}
                    </span>
                    {h.reviewed && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Reviewed
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">Patient: {h.patientName}</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Outgoing Caregiver: <span className="font-bold text-slate-600 dark:text-slate-300">{h.outgoingCaregiverName}</span> • Generated: {new Date(h.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(h)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === h.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  {!h.reviewed && (
                    <button
                      onClick={() => handleMarkReviewed(h.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Reviewed</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Top 3-5 Important Observations */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Top Important Shift Observations
                </h3>
                <div className="space-y-1.5">
                  {h.topObservations?.map((obs, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emerging Pattern */}
              {h.emergingPattern && (
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Emerging Longitudinal Pattern
                  </span>
                  <p className="text-xs font-bold text-amber-950 dark:text-amber-200 leading-relaxed">
                    "{h.emergingPattern}"
                  </p>
                </div>
              )}

              {/* Watch During Your Shift */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Watch During Your Shift</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {h.watchItems?.map((w, idx) => (
                    <div key={idx} className="p-2.5 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Breakdown (Completed vs Pending) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Completed Tasks ({h.completedTasks?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-300">
                    {h.completedTasks?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-purple-50/40 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Pending Shift Tasks ({h.pendingTasks?.length || 0})</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-purple-800 dark:text-purple-300">
                    {h.pendingTasks?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Disclaimer Footer */}
              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>AI-generated handover report. Verify medication, vital signs, and urgent clinical status with licensed staff.</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};