import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
      <div className="w-14 h-14 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};