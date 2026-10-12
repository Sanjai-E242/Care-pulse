import React, { useEffect, useState } from 'react';
import { patientApi } from '../services/api';
import { Patient } from '../types';
import { PatientCard } from '../components/PatientCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Users, Search } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    patientApi.getAll()
      .then((data) => setPatients(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.conditions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
            Care Registry
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Assigned Patients</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Comprehensive medical summaries, status cards, and timelines</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading patient records..." />
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 py-8 text-center">No patients found matching "{searchTerm}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  );
};