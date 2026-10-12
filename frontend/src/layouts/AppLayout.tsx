import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};