import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observationApi, patientApi } from '../services/api';
import { Observation, Patient } from '../types';
import { ObservationCard } from '../components/ObservationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Eye, Plus, Filter } from 'lucide-react';

export const ObservationsPage: React.FC = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([observationApi.getRecent(), patientApi.getAll()])
      .then(([obsData, patData]) => {
        setObservations(obsData);
        setPatients(patData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedPatientId === 'ALL'
    ? observations
    : observations.filter((o) => o.patientId === Number(selectedPatientId));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
            Observation Journal
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Caregiver Observations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Live feed of voice & text observations with AI clinical signals</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">All Patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          <Link
            to="/observations/new"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Observation</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching caregiver observations..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No observations recorded for this filter.</p>
          <Link
            to="/observations/new"
            className="mt-3 inline-block px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
          >
            Record First Observation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((obs) => (
            <ObservationCard key={obs.id} observation={obs} />
          ))}
        </div>
      )}
    </div>
  );
};