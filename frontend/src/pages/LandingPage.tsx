import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ShieldCheck, Heart, Sparkles, ArrowRight, CheckCircle2,
  AlertTriangle, Clock, Users, Flame, Brain, ShieldAlert, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const solutions = [
    {
      title: 'Smart Observation Capture',
      description: 'Capture everyday observations via voice or natural text. AI converts freeform caregiver notes into structured clinical signals.',
      icon: Sparkles,
      color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/40',
    },
    {
      title: 'Intelligent Shift Handover',
      description: 'Synthesizes past and current shift observations into prioritized watch items, emerging patterns, and pending task lists.',
      icon: Clock,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
    },
    {
      title: 'Burnout Prediction & Prevention',
      description: 'Multi-signal strain tracking monitoring task load, consecutive demanding care days, and self-reported emotional wellbeing.',
      icon: Flame,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
    },
    {
      title: 'AI Clinical Care Guidance',
      description: 'Immediate context-aware decision support for falls, sudden confusion, and nutritional changes with clear emergency escalations.',
      icon: Brain,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation */}
      <nav className="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              CarePulse <span className="text-teal-600 dark:text-teal-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 transition"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/30 transition flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            AI-Agent-Powered Caregiver Intelligence Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] mb-6">
            Caregiving Shouldn't Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">Invisible</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            CarePulse AI transforms everyday caregiver observations into actionable care intelligence, protects family and professional caregivers from burnout, and keeps multidisciplinary care teams synchronized.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2"
            >
              <span>Get Started with Demo Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/guidance"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-sm transition"
            >
              View Decision Support Scenarios
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase mb-2">The Hidden Crisis</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Why Modern Caregiving Breaks Down</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-4">1</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Observations Are Lost</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Critical subtle signs—like gradual food refusal or evening restlessness—stay trapped in memory or paper scraps.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-4">2</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Caregivers Are Overwhelmed</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Family members carry 40+ hours of physical and emotional load with zero respite or proactive burnout monitoring.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-4">3</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Handovers Are Fragmented</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Shift transitions between outgoing CNAs and incoming family members miss vital context and pending medication tasks.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-4">4</div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Burnout Becomes Risk</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When caregiver exhaustion peaks, medical errors, missed doses, and unaddressed fall hazards rapidly rise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section (4 Cards) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase mb-2">The CarePulse AI Solution</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Coordinated Intelligence for Every Role</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-600 transition">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{s.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (Observe -> Understand -> Coordinate -> Act) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase mb-2">The Architecture</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">How CarePulse AI Operates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-700 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Observe</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Caregivers speak or type what they notice in plain, natural English.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-700 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Understand</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Observation and Pattern AI agents extract clinical signals & trends.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-700 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Coordinate</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks are rebalanced, handovers synthesized, and family circles notified.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-700 dark:text-teal-300 font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Act</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Immediate decision guidance, warning signs, and doctor escalations triggered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="py-12 bg-slate-100 dark:bg-slate-950 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm mb-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Privacy-Conscious Healthcare Principles</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            CarePulse AI is engineered with minimum-necessary data display, role-restricted authorization, and audit logging. Designed with privacy-conscious principles for decision-support workflows.
          </p>
        </div>
      </section>
    </div>
  );
};