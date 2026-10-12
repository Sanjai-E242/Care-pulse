import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Bell, LogOut, User as UserIcon, ChevronDown, Sparkles, HeartHandshake } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleLabels: Record<Role, string> = {
    FAMILY_CAREGIVER: 'Family Caregiver',
    PROFESSIONAL_CAREGIVER: 'Professional CNA',
    CARE_COORDINATOR: 'Care Coordinator',
    CLINICAL_STAFF: 'Clinical Staff (MD)',
  };

  const roleColors: Record<Role, string> = {
    FAMILY_CAREGIVER: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    PROFESSIONAL_CAREGIVER: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    CARE_COORDINATOR: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    CLINICAL_STAFF: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CarePulse <span className="text-teal-600 dark:text-teal-400 font-black">AI</span>
              </span>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Caregiver Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Role Switcher for Demo */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              title="Demo Role Switcher"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Role:</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${user ? roleColors[user.role] : ''}`}>
                {user ? roleLabels[user.role] : 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 animate-fadeIn">
                <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Switch Active Persona
                </p>
                {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchDemoRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      user?.role === r
                        ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{roleLabels[r]}</span>
                    {user?.role === r && <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/observations/new"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/30 transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Record Observation</span>
          </Link>

          {/* Theme Toggle Button (Light Mode: 🌙 to switch to Dark, Dark Mode: ☀️ to switch to Light) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <>
                <span className="text-sm leading-none select-none" role="img" aria-label="Light Mode">☀️</span>
                <span className="text-xs font-bold text-amber-300 hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <span className="text-sm leading-none select-none" role="img" aria-label="Dark Mode">🌙</span>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <Link
            to="/alerts"
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                {user?.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Profile & Role
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};