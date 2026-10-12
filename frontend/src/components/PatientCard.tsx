import React from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '../types';
import { User, Activity, AlertCircle, ChevronRight, Heart, Utensils, Moon, Footprints } from 'lucide-react';

export const PatientCard: React.FC<{ patient: Patient }> = ({ patient }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition hover:border-teal-300 dark:hover:border-teal-700/60 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center font-black text-base shadow-sm">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{patient.fullName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {patient.age} yrs • {patient.gender} • Blood: {patient.bloodGroup}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold border border-slate-200 dark:border-slate-700">
            {patient.mobilityStatus}
          </span>
        </div>

        {/* Conditions */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Conditions: </span>
          {patient.conditions}
        </p>

        {/* Current Status Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/70">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-500 dark:text-slate-400">Mood:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{patient.currentMood || 'Stable'}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/70">
            <Utensils className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-500 dark:text-slate-400">Appetite:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{patient.currentAppetite || 'Normal'}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/70">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Sleep:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{patient.currentSleep || 'Restful'}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/70">
            <Footprints className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-slate-500 dark:text-slate-400">Mobility:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{patient.currentMobility || 'Steady'}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Primary: {patient.primaryCaregiverName || 'Assigned Caregiver'}
        </span>
        <Link
          to={`/patients/${patient.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition"
        >
          <span>View Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};