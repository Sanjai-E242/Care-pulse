import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, Heart, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  Flame, Plus, Sparkles, ShieldAlert, Users, BookOpen, ArrowRightLeft,
  ChevronRight, Calendar, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, taskApi } from '../services/api';
import { DashboardSummary } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ObservationCard } from '../components/ObservationCard';
import { TaskCard } from '../components/TaskCard';
import { AlertCard } from '../components/AlertCard';
import { WellbeingModal } from '../components/WellbeingModal';
import { getCurrentShift } from '../utils/shift';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWellbeingModal, setShowWellbeingModal] = useState<boolean>(false);

  const fetchDashboard = () => {
    setLoading(true);
    dashboardApi.getSummary()
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to load dashboard', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const handleToggleTaskStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      await taskApi.updateStatus(id, nextStatus);
      fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !summary) {
    return <LoadingSpinner message="Synthesizing care signals and active shifts..." size="lg" />;
  }

  const patient = summary.primaryPatient;
  const burnout = summary.burnoutRisk;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/60">
            {summary.role.replace('_', ' ')} PORTAL
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.greeting}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized patient intelligence and active shift status
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowWellbeingModal(true)}
            className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-bold rounded-2xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-100 dark:fill-rose-950" />
            <span>Check Wellbeing</span>
          </button>

          <Link
            to="/observations/new"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Observation</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FAMILY CAREGIVER VIEW */}
      {/* ========================================================================= */}
      {summary.role === 'FAMILY_CAREGIVER' && (
        <>
          {/* Top Row: Patient Summary Card & Burnout Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Patient Status Overview (2 Cols) */}
            {patient && (
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Primary Patient</span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.fullName} ({patient.age} yrs)</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{patient.conditions}</p>
                  </div>
                  <Link
                    to={`/patients/${patient.id}`}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1"
                  >
                    View Full Chart <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Vitals & Behaviors Visual Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Mood</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{patient.currentMood || 'Normal'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Appetite</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{patient.currentAppetite || 'Normal'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Sleep</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{patient.currentSleep || 'Restful'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Mobility</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{patient.currentMobility || 'Guarded'}</p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <Link
                    to="/observations/new"
                    className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-bold text-xs text-center transition"
                  >
                    Record Observation
                  </Link>
                  <button
                    onClick={() => setShowWellbeingModal(true)}
                    className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold text-xs text-center transition"
                  >
                    Check My Wellbeing
                  </button>
                  <Link
                    to="/guidance"
                    className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-bold text-xs text-center transition"
                  >
                    View Guidance
                  </Link>
                  <Link
                    to="/tasks"
                    className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-bold text-xs text-center transition"
                  >
                    View Tasks
                  </Link>
                </div>
              </div>
            )}

            {/* Burnout Risk Card (1 Col) */}
            {burnout && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Caregiver Strain Index</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      burnout.level === 'CRITICAL' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800' :
                      burnout.level === 'HIGH' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800' :
                      burnout.level === 'MODERATE' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {burnout.level} Risk
                    </span>
                  </div>

                  <div className="my-4">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{burnout.score}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          burnout.score > 75 ? 'bg-red-500' : burnout.score > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${burnout.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3">
                    {burnout.factors[0] || 'Workload is currently balanced.'}
                  </p>

                  <div className="text-[11px] bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Recommended Next Step:</span>
                    <p className="text-slate-500 dark:text-slate-400">{burnout.recommendations[0]}</p>
                  </div>
                </div>

                <Link
                  to="/burnout"
                  className="mt-4 w-full py-2 text-center text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition block"
                >
                  View Burnout Analytics & Respite →
                </Link>
              </div>
            )}
          </div>

          {/* Timeline of Recent Patient Signals & Today's Care Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Patient Signals Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Recent Patient Signals Timeline</span>
                </h3>
                <Link to="/observations" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                  All Observations
                </Link>
              </div>

              {summary.recentObservations.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No observations recorded today.</p>
              ) : (
                <div className="space-y-3">
                  {summary.recentObservations.slice(0, 4).map((obs) => (
                    <ObservationCard key={obs.id} observation={obs} />
                  ))}
                </div>
              )}
            </div>

            {/* Today's Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Today's Care Tasks</span>
                </h3>
                <Link to="/tasks" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                  Manage Board
                </Link>
              </div>

              {summary.pendingTasks.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No pending care tasks.</p>
              ) : (
                <div className="space-y-2.5">
                  {summary.pendingTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleStatus={handleToggleTaskStatus}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. PROFESSIONAL CAREGIVER (CNA) VIEW */}
      {/* ========================================================================= */}
      {summary.role === 'PROFESSIONAL_CAREGIVER' && (
        <>
          {/* Shift Banner & Handover Call-to-action */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-800 text-blue-200 px-3 py-1 rounded-full">
                  CURRENT ACTIVE SHIFT
                </span>
                <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
                  <span>{getCurrentShift().icon}</span>
                  <span>{summary.stats?.currentShift || getCurrentShift().label}</span>
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  {getCurrentShift().description} • Assigned Patients: 3 • High-priority watch items pending incoming shift review
                </p>
              </div>

              <Link
                to="/handover"
                className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-700" />
                <span>Generate Shift Handover</span>
              </Link>
            </div>

            {/* High Priority Watch Items */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <h4 className="text-xs font-extrabold text-blue-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>Active Shift Watch Items</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-blue-50 font-medium">
                <li className="p-2 bg-white/5 rounded-xl border border-white/10">
                  • Mary Johnson: Refused breakfast; monitor hydration
                </li>
                <li className="p-2 bg-white/5 rounded-xl border border-white/10">
                  • Mary Johnson: Increased evening disorientation reported
                </li>
                <li className="p-2 bg-white/5 rounded-xl border border-white/10">
                  • Susan Miller: Guarded gait; provide transfer assist
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Assigned Shift Observations</h3>
              <div className="space-y-3">
                {summary.recentObservations.slice(0, 4).map((obs) => (
                  <ObservationCard key={obs.id} observation={obs} />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Shift Tasks & Medication Handoffs</h3>
              <div className="space-y-2.5">
                {summary.pendingTasks.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleTaskStatus}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. CARE COORDINATOR VIEW */}
      {/* ========================================================================= */}
      {summary.role === 'CARE_COORDINATOR' && (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Total Patients</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.stats.totalPatients || 3}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Active Caregivers</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.stats.activeCaregivers || 2}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">High-Risk Caregivers</span>
              <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{summary.stats.highRiskCaregivers || 1}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Pending Tasks</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{summary.stats.pendingTasks || 4}</p>
            </div>
          </div>

          {/* Caregiver Burnout Monitoring Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Caregiver Strain Monitoring</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time burnout forecasting across active care circles</p>
              </div>
              <Link to="/tasks" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                Redistribute Tasks →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px]">
                    <th className="py-2.5 font-bold">Caregiver</th>
                    <th className="py-2.5 font-bold">Role</th>
                    <th className="py-2.5 font-bold">Strain Score</th>
                    <th className="py-2.5 font-bold">Risk Level</th>
                    <th className="py-2.5 font-bold">Contributing Factor</th>
                    <th className="py-2.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Sarah Johnson</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">Family Caregiver</td>
                    <td className="py-3 font-extrabold text-amber-600 dark:text-amber-400">68 / 100</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        HIGH
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Consecutive days + Overdue doctor prep task</td>
                    <td className="py-3 text-right">
                      <Link
                        to="/tasks"
                        className="px-3 py-1 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold rounded-xl text-[11px] transition"
                      >
                        Reassign Tasks
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">David Miller, CNA</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">Professional Staff</td>
                    <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400">28 / 100</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        LOW
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Schedule balanced; all shift tasks logged</td>
                    <td className="py-3 text-right">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">Normal</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Urgent Caregiver & Patient Alerts</h3>
            <div className="space-y-2.5">
              {summary.activeAlerts.map((alt) => (
                <AlertCard key={alt.id} alert={alt} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. CLINICAL STAFF VIEW */}
      {/* ========================================================================= */}
      {summary.role === 'CLINICAL_STAFF' && (
        <>
          {/* AI Clinical Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-cyan-200 dark:border-cyan-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-base font-black">72-Hour AI Clinical Synthesis</h3>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-cyan-50/50 dark:bg-cyan-950/40 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-900/60">
              "{summary.clinicalAiSummary || 'Over the last 72 hours, the patient has shown reduced appetite and increased evening agitation. Mobility appears slightly reduced compared with previous observations.'}"
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              * AI-generated summary — verify with clinical assessment before diagnostic or medication changes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Structured Behavioral & Functional Observations</h3>
              <div className="space-y-3">
                {summary.recentObservations.slice(0, 5).map((obs) => (
                  <ObservationCard key={obs.id} observation={obs} />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Clinical Review Flags & Escalations</h3>
              <div className="space-y-2.5">
                {summary.activeAlerts.map((alt) => (
                  <AlertCard key={alt.id} alert={alt} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for Wellbeing */}
      <WellbeingModal
        isOpen={showWellbeingModal}
        onClose={() => setShowWellbeingModal(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};