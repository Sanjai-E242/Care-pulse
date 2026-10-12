import React, { useEffect, useState } from 'react';
import { alertApi } from '../services/api';
import { AlertItem } from '../types';
import { AlertCard } from '../components/AlertCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Bell, Filter, CheckCircle2 } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unresolvedOnly, setUnresolvedOnly] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = () => {
    setLoading(true);
    alertApi.getAll({ unresolvedOnly })
      .then((data) => setAlerts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [unresolvedOnly]);

  const handleResolve = async (id: number) => {
    try {
      await alertApi.resolve(id);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/40">
            Safety Monitoring
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Clinical & Caregiver Alerts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Falls, acute confusion spikes, poor appetite patterns, and burnout notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <input
              type="checkbox"
              checked={unresolvedOnly}
              onChange={(e) => setUnresolvedOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Unresolved alerts only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Scanning active safety alerts..." />
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">All Clear — No Active Alerts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">All flagged safety observations have been addressed and resolved.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alt) => (
            <AlertCard
              key={alt.id}
              alert={alt}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
};