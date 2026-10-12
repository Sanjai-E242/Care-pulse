import React from 'react';
import { CareTask } from '../types';
import { CheckCircle2, Clock, AlertCircle, ArrowRightLeft, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: CareTask;
  onToggleStatus?: (id: number, currentStatus: string) => void;
  onReassign?: (task: CareTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onReassign }) => {
  const isCompleted = task.status === 'COMPLETED';
  const isOverdue = task.status === 'OVERDUE';

  const priorityColors = {
    LOW: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    MEDIUM: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
    HIGH: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
    CRITICAL: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300',
  };

  const formattedDue = task.dueDate
    ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Today';

  return (
    <div className={`p-4 rounded-2xl border transition shadow-sm ${
      isCompleted
        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 opacity-75'
        : isOverdue
        ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-red-900 ring-1 ring-red-200 dark:ring-red-900'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700/60'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2.5">
          <button
            onClick={() => onToggleStatus && onToggleStatus(task.id, task.status)}
            className={`mt-0.5 rounded-full transition p-0.5 ${
              isCompleted ? 'text-emerald-600 hover:text-slate-400 dark:hover:text-slate-500' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            title={isCompleted ? 'Mark Todo' : 'Mark Complete'}
          >
            <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'fill-emerald-100 dark:fill-emerald-950' : ''}`} />
          </button>
          <div>
            <h4 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
              {task.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-600 dark:text-slate-300">{task.patientName}</span>
          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>
            <Clock className="w-3 h-3" />
            {formattedDue}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 text-[10px]">Assigned: {task.assignedCaregiverName || 'Unassigned'}</span>
          {onReassign && (
            <button
              onClick={() => onReassign(task)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg transition"
              title="Reassign Task"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};