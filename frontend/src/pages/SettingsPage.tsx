import React from 'react';
import { Settings, ShieldCheck, Database, Cpu, Lock, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
          System Preferences
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Platform Settings & Privacy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Appearance, security configuration, audit trail, and AI engine telemetry</p>
      </div>

      {/* Appearance / Theme Mode Preference */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
          <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Interface Appearance & Theme</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose between crisp clinical Light Mode or high-contrast, low-fatigue Healthcare Dark Mode.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
              theme === 'light'
                ? 'bg-teal-50/80 dark:bg-slate-800 border-teal-600 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
              ☀️
            </div>
            <div>
              <p className="text-xs font-bold">Light Mode</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Crisp, daylight healthcare styling</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
              theme === 'dark'
                ? 'bg-teal-50/80 dark:bg-slate-800 border-teal-600 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
              🌙
            </div>
            <div>
              <p className="text-xs font-bold">Dark Mode</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Navy/slate low-strain night mode</p>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <Database className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Database & Storage</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Connected to local MySQL 8.0 instance (<code className="bg-slate-200 dark:bg-slate-700 dark:text-slate-200 px-1 py-0.5 rounded text-[11px]">carepulse_db</code>). Schema updates managed via JPA/Hibernate.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">AI Agent Architecture</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Active engines: ObservationAgent, PatternDetectionAgent, HandoverAgent, BurnoutAgent, GuidanceAgent, FamilyCoordinationAgent. Dual-mode fallback architecture enabled.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Role-Based Access Control</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Cryptographic BCrypt password hashing and Spring Security stateless JWT authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice Box */}
        <div className="p-5 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-teal-900 dark:text-teal-300 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Privacy-Conscious Healthcare Design Notice</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            CarePulse AI is designed with privacy-conscious principles. Patient observations and caregiver wellbeing check-ins are restricted to verified care circle participants and clinical professionals.
          </p>
        </div>
      </div>
    </div>
  );
};