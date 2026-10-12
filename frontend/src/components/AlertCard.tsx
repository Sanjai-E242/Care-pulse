import React from 'react';
import { AlertItem } from '../types';
import { AlertOctagon, AlertTriangle, Info, Check, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlertCardProps {
  alert: AlertItem;
  onMarkRead?: (id: number) => void;
  onResolve?: (id: number) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkRead, onResolve }) => {
  const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';

  return (
    <div className={`p-4 rounded-2xl border transition shadow-sm ${
      alert.resolved
        ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
        : isCritical
        ? 'bg-red-50/50 dark:bg-red-950/40 border-red-200 dark:border-red-900/80'
        : 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          )}
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            isCritical ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}>
            {alert.severity}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 pl-6">{alert.message}</p>

      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-800 pl-6">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Patient: {alert.patientName || 'Clinical Alert'}</span>

        <div className="flex items-center gap-2">
          {alert.patientId && (
            <Link
              to={`/patients/${alert.patientId}`}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 text-[11px] font-semibold flex items-center gap-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Eye className="w-3 h-3" /> View Patient
            </Link>
          )}
          {!alert.resolved && onResolve && (
            <button
              onClick={() => onResolve(alert.id)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1 transition"
            >
              <Check className="w-3 h-3" /> Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
};