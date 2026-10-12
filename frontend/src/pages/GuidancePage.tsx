import React, { useEffect, useState } from 'react';
import { guidanceApi } from '../services/api';
import { ClinicalScenario, GuidanceResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BookOpen, AlertTriangle, ShieldAlert, PhoneCall, Search,
  CheckCircle2, AlertOctagon, HelpCircle, ChevronRight, X
} from 'lucide-react';

export const GuidancePage: React.FC = () => {
  const [scenarios, setScenarios] = useState<ClinicalScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ClinicalScenario | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customGuidance, setCustomGuidance] = useState<GuidanceResponse | null>(null);
  const [querying, setQuerying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    guidanceApi.getScenarios()
      .then((data) => {
        setScenarios(data);
        if (data.length > 0) setSelectedScenario(data[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setQuerying(true);
    try {
      const resp = await guidanceApi.query(searchQuery);
      setCustomGuidance(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
          Clinical Decision Support
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">Care Guidance & Emergency Triage</h1>
        <p className="text-xs text-slate-500">
          Plain-English, step-by-step guidance for falls, cognitive delirium, food refusal, and acute warning signs
        </p>
      </div>

      {/* Emergency Red-Flag Banner */}
      <div className="p-5 rounded-3xl bg-red-600 text-white shadow-lg shadow-red-600/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl">
            <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black">Life-Threatening Emergency Warning Protocol</h3>
            <p className="text-xs text-red-100">
              For loss of consciousness, severe breathing distress, major hemorrhage, or sudden FAST stroke signs:
            </p>
          </div>
        </div>
        <a
          href="tel:108"
          className="px-5 py-2.5 bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2 flex-shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 108 / Emergency</span>
        </a>
      </div>

      {/* Search / Ask Guidance Engine */}
      <form onSubmit={handleSearchQuery} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask CarePulse guidance (e.g. 'Patient fell out of bed', 'Refusing to swallow liquids')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
          />
        </div>
        <button
          type="submit"
          disabled={querying || !searchQuery.trim()}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-xs transition disabled:opacity-50"
        >
          {querying ? 'Searching...' : 'Get Guidance'}
        </button>
      </form>

      {/* Custom AI Query Result Card if present */}
      {customGuidance && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-500 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">{customGuidance.title}</h3>
            <button
              onClick={() => setCustomGuidance(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">What To Do Immediately:</span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                {customGuidance.immediateActions.map((act, i) => (
                  <li key={i}>• {act}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-300">Warning Signs to Escalate:</span>
              <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                {customGuidance.warningSigns.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 p-3 rounded-xl border border-teal-100 dark:border-teal-900/60">
            Recommended Action: {customGuidance.recommendedEscalation}
          </p>
        </div>
      )}

      {/* Scenarios Browser */}
      {loading ? (
        <LoadingSpinner message="Loading clinical scenario protocols..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Scenario Tabs List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Common Clinical Scenarios
            </span>
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  selectedScenario?.id === sc.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{sc.title}</h4>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                    selectedScenario?.id === sc.id ? 'text-teal-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {sc.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Scenario Detail View (2 cols) */}
          {selectedScenario && (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Protocol</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{selectedScenario.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedScenario.description}</p>
              </div>

              {/* 4 Cards: What to check, What to do now, Contact Clinician, Emergency Help */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> What to Check
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    {selectedScenario.whatToCheck.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-teal-50/50 dark:bg-teal-950/40 rounded-2xl border border-teal-100 dark:border-teal-900/60 space-y-2">
                  <h4 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> What to Do Now
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    {selectedScenario.whatToDoNow.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> When to Contact Clinician
                  </h4>
                  <ul className="space-y-1.5 text-amber-900 dark:text-amber-200">
                    {selectedScenario.whenToContactClinician.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-50/50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60 space-y-2">
                  <h4 className="font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> When to Seek Emergency Help
                  </h4>
                  <ul className="space-y-1.5 text-red-900 dark:text-red-200 font-semibold">
                    {selectedScenario.whenToSeekEmergencyHelp.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Decision-support protocol only. Confirm all clinical actions with qualified medical personnel.</span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};