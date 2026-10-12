import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Eye,
  ClipboardList,
  ArrowRightLeft,
  Flame,
  HeartHandshake,
  BookOpen,
  Bell,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/observations', label: 'Observations', icon: Eye },
    { to: '/tasks', label: 'Care Tasks', icon: ClipboardList },
    { to: '/handover', label: 'Shift Handover', icon: ArrowRightLeft },
    { to: '/burnout', label: 'Burnout & Wellbeing', icon: Flame },
    { to: '/family', label: 'Family Coordination', icon: HeartHandshake },
    { to: '/guidance', label: 'Care Guidance', icon: BookOpen },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex transition-colors duration-200">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 rounded-2xl">
        <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 text-[11px] font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Decision-Support AI</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          AI-generated guidance and risk signals. Confirm urgent clinical decisions with certified medical personnel.
        </p>
      </div>
    </aside>
  );
};