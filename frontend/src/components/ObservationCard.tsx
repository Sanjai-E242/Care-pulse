import React from 'react';
import { Observation } from '../types';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Mic, FileText } from 'lucide-react';

export const ObservationCard: React.FC<{ observation: Observation }> = ({ observation }) => {
  const getSeverityBadge = (sev?: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'MODERATE':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'LOW':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const formattedTime = new Date(observation.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-teal-200 dark:hover:border-teal-700/60 transition space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {observation.inputMethod === 'VOICE' ? (
            <span className="p-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-xl" title="Voice-recorded observation">
              <Mic className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl" title="Text observation">
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{observation.patientName}</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {observation.category && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {observation.category.replace('_', ' ')}
            </span>
          )}
          {observation.severity && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(observation.severity)}`}>
              {observation.severity}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed bg-slate-50/70 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
        "{observation.rawText}"
      </p>

      {/* AI Structured Interpretation Badge */}
      {observation.summaryText && (
        <div className="p-2.5 bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 rounded-xl flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-teal-900 dark:text-teal-200">
              AI Signal Extraction: <span className="font-normal text-slate-700 dark:text-slate-300">{observation.summaryText}</span>
            </p>
            {observation.recommendedAction && (
              <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Action: {observation.recommendedAction.replace(/_/g, ' ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
        <span>Recorded by: {observation.caregiverName}</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle className="w-3 h-3" /> Confirmed
        </span>
      </div>
    </div>
  );
};