import React from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { Role } from '../types';
import { User, Mail, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, switchDemoRole } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
          Account Information
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Caregiver Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your active role credentials and care team preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.fullName}</h2>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {user?.role.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">{user?.phone || '+1 555-0100'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Security & Role Access</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">JWT Authenticated Session (24h validity)</p>
            </div>
          </div>
        </div>

        {/* Persona Switcher Quick Box */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Switch Role for Presentation / Testing</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchDemoRole(r)}
                className={`p-3 rounded-2xl text-xs font-bold border text-left transition ${
                  user?.role === r
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {DEMO_CREDENTIALS[r].title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};