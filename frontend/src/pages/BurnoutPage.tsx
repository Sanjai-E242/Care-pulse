import React, { useEffect, useState } from 'react';
import { burnoutApi } from '../services/api';
import { BurnoutRisk } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { WellbeingModal } from '../components/WellbeingModal';
import {
  Flame, Heart, AlertTriangle, ShieldCheck, CheckCircle2,
  Clock, ArrowRightLeft, Sparkles, UserCheck, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BurnoutPage: React.FC = () => {
  const [risk, setRisk] = useState<BurnoutRisk | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchBurnoutData = () => {
    setLoading(true);
    Promise.all([burnoutApi.getCurrent(), burnoutApi.getHistory()])
      .then(([riskData, histData]) => {
        setRisk(riskData);
        setHistory(histData || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBurnoutData();
  }, []);

  if (loading || !risk) {
    return <LoadingSpinner message="Calculating caregiver strain index..." />;
  }

  const getScoreColor = (score: number) => {
    if (score <= 30) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
    if (score <= 60) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    if (score <= 80) return { bg: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' };
    return { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
  };

  const theme = getScoreColor(risk.score);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            Caregiver Health Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Burnout Prediction & Prevention</h1>
          <p className="text-xs text-slate-500">
            Transparent strain score modeling task load, emotional distress, and self-checkins
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-rose-600/20 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Heart className="w-4 h-4" />
          <span>Record Wellbeing Check-in</span>
        </button>
      </div>

      {/* Main Burnout Score Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Caregiver: {risk.caregiverName}
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Current Strain Score:</h2>
              <span className={`text-4xl font-black ${theme.text}`}>{risk.score}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scoring Model: 0–30 Low • 31–60 Moderate • 61–80 High • 81–100 Critical
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${theme.badge}`}>
              {risk.level} BURNOUT RISK
            </span>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Updated after each task, shift & observation</p>
          </div>
        </div>

        {/* Meter Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ${theme.bg}`}
              style={{ width: `${risk.score}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-1">
            <span>0 Low Strain</span>
            <span>30 Moderate</span>
            <span>60 High Risk</span>
            <span>100 Critical Burnout</span>
          </div>
        </div>

        {/* Contributing Factors & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Contributing Signals & Factors</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {risk.factors.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-teal-50/50 dark:bg-teal-950/40 rounded-2xl border border-teal-100 dark:border-teal-900/60 space-y-3">
            <h3 className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Recommended Interventions</span>
            </h3>
            <ul className="space-y-2 text-xs text-teal-950 dark:text-teal-200 font-medium">
              {risk.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Workload Rebalancing CTA if High or Critical */}
        {(risk.level === 'HIGH' || risk.level === 'CRITICAL') && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="font-semibold">
                Workload strain is elevated. Care coordinator and family members can immediately rebalance pending tasks.
              </p>
            </div>
            <Link
              to="/tasks"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap"
            >
              Reassign Tasks Now →
            </Link>
          </div>
        )}
      </div>

      {/* Wellbeing Check-in History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Self-Reported Wellbeing History</span>
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No wellbeing check-ins submitted yet.</p>
        ) : (
          <div className="space-y-2.5">
            {history.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {item.moodRating ? item.moodRating.replace(/_/g, ' ').toLowerCase() : 'Check-in'}
                  </span>
                  {item.notes && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">"{item.notes}"</p>}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <WellbeingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchBurnoutData}
      />
    </div>
  );
};