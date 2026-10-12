import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientApi, observationApi } from '../services/api';
import { Patient, Observation, PatientIntelligence } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ObservationCard } from '../components/ObservationCard';
import {
  Heart, Utensils, Moon, Footprints, Clock, Plus,
  ShieldAlert, ArrowLeft, Activity, TrendingUp, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const PatientDetailPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [intelligence, setIntelligence] = useState<PatientIntelligence | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      patientApi.getById(Number(id)),
      observationApi.getByPatient(Number(id)),
      patientApi.getIntelligence(Number(id)).catch(() => null)
    ])
      .then(([patData, obsData, intelData]) => {
        setPatient(patData);
        setObservations(obsData);
        setIntelligence(intelData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !patient) {
    return <LoadingSpinner message="Loading patient chart and longitudinal trends..." />;
  }

  // Realistic mock trend dataset for charts
  const trendData = [
    { day: 'Mon', appetite: 80, sleep: 75, mood: 70, mobility: 85 },
    { day: 'Tue', appetite: 75, sleep: 70, mood: 65, mobility: 80 },
    { day: 'Wed', appetite: 60, sleep: 65, mood: 60, mobility: 75 },
    { day: 'Thu', appetite: 45, sleep: 50, mood: 50, mobility: 65 },
    { day: 'Fri', appetite: 40, sleep: 55, mood: 45, mobility: 60 },
    { day: 'Sat', appetite: 50, sleep: 60, mood: 55, mobility: 60 },
    { day: 'Sun', appetite: 40, sleep: 50, mood: 45, mobility: 55 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Registry</span>
        </Link>

        <Link
          to="/observations/new"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Observation</span>
        </Link>
      </div>

      {/* Patient Header Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-teal-600/20">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{patient.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {patient.gender} • {patient.age} yrs
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Blood Group: <span className="font-bold text-slate-700 dark:text-slate-300">{patient.bloodGroup}</span> • Emergency Contact: <span className="font-semibold text-slate-700 dark:text-slate-300">{patient.emergencyContact}</span>
              </p>
            </div>
          </div>

          <div className="text-left md:text-right text-xs">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Primary Designated Caregiver</span>
            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{patient.primaryCaregiverName || 'Sarah Johnson'}</p>
          </div>
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Clinical Conditions</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">{patient.conditions}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Known Allergies</span>
            <p className="font-bold text-rose-700 dark:text-rose-400">{patient.allergies}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Medications</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">{patient.medications}</p>
          </div>
        </div>

        {/* Current Status Visual Cards */}
        <div className="pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Real-Time Physiological & Behavioral Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-2xl">
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Mood
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{patient.currentMood || 'Content'}</p>
            </div>
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Appetite
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{patient.currentAppetite || 'Poor'}</p>
            </div>
            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Sleep
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{patient.currentSleep || 'Restless'}</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Mobility
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{patient.currentMobility || 'Guarded'}</p>
            </div>
            <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Cognition
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100 mt-1">{patient.cognitiveStatus || 'Alert'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Patient Intelligence & Change Signals Card */}
      {intelligence && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">AI Patient Intelligence</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Longitudinal Change Pattern Analysis</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                intelligence.riskLevel === 'HIGH' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' :
                intelligence.riskLevel === 'MODERATE' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}>
                {intelligence.riskLevel} Risk • {intelligence.riskScore}/100
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {intelligence.progression}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pattern Explanation</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">{intelligence.explanation}</p>
            </div>
            <div className="p-4 bg-teal-50/50 dark:bg-teal-950/30 rounded-2xl border border-teal-100 dark:border-teal-900/40 space-y-1.5">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Clinical Next Steps</span>
              <p className="text-teal-900 dark:text-teal-200 font-semibold leading-relaxed">{intelligence.recommendedAction}</p>
            </div>
          </div>

          {intelligence.evidence && intelligence.evidence.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Detected Clinical Signals ({intelligence.evidence.length})
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {intelligence.evidence.map((ev, i) => (
                  <li key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Trends Analytics (Recharts) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Longitudinal Signal Trends</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">7-Day Caregiver Observation Trends</h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Index 0 - 100</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  borderRadius: '1rem',
                  fontSize: '11px'
                }}
              />
              <Line type="monotone" dataKey="appetite" stroke="#f59e0b" strokeWidth={2.5} name="Appetite Level" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2.5} name="Sleep Restfulness" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2.5} name="Mood / Wellbeing" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mobility" stroke="#0d9488" strokeWidth={2.5} name="Mobility Independence" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Appetite
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Sleep
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-pink-600 dark:text-pink-400">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span> Mood
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400">
            <span className="w-3 h-3 rounded-full bg-teal-600"></span> Mobility
          </span>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Chronological Care Timeline ({observations.length} Observations)</span>
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Most recent first</span>
        </div>

        {observations.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No observations recorded yet for this patient.</p>
        ) : (
          <div className="space-y-3">
            {observations.map((obs) => (
              <ObservationCard key={obs.id} observation={obs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};