import React, { useEffect, useState } from 'react';
import { taskApi, patientApi } from '../services/api';
import { CareTask, Patient } from '../types';
import { TaskCard } from '../components/TaskCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ClipboardList, Plus, Filter, ArrowRightLeft, X } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  // New task modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newPriority, setNewPriority] = useState<string>('MEDIUM');
  const [newPatientId, setNewPatientId] = useState<number | null>(null);

  // Reassign modal
  const [reassigningTask, setReassigningTask] = useState<CareTask | null>(null);
  const [targetCaregiverId, setTargetCaregiverId] = useState<number>(1);

  const fetchTasks = () => {
    setLoading(true);
    Promise.all([taskApi.getAll(), patientApi.getAll()])
      .then(([taskData, patData]) => {
        setTasks(taskData);
        setPatients(patData);
        if (patData.length > 0) setNewPatientId(patData[0].id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      await taskApi.updateStatus(id, nextStatus);
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPatientId) return;
    try {
      await taskApi.create({
        title: newTitle,
        description: newDesc,
        patientId: newPatientId,
        priority: newPriority as any,
        status: 'TODO',
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassigningTask) return;
    try {
      await taskApi.reassign({
        taskId: reassigningTask.id,
        newCaregiverId: targetCaregiverId,
        reason: 'Workload strain rebalancing',
      });
      setReassigningTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = statusFilter === 'ALL'
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-900/40">
            Care Operations
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Care Task Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Medication adherence, nutrition schedules, and family workload redistribution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Care Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'TODO', 'OVERDUE', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              statusFilter === st
                ? 'bg-slate-900 dark:bg-teal-600 text-white border-slate-900 dark:border-teal-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <LoadingSpinner message="Fetching care tasks..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">No tasks found matching this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggleStatus={handleToggleStatus}
              onReassign={(task) => setReassigningTask(task)}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create Care Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Patient</label>
                <select
                  value={newPatientId || ''}
                  onChange={(e) => setNewPatientId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Hydration & Vitals Check"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Specific instructions or doses..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {reassigningTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                <ArrowRightLeft className="w-4 h-4" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Rebalance Care Task</h3>
              </div>
              <button onClick={() => setReassigningTask(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Transfer responsibility for "<span className="font-bold">{reassigningTask.title}</span>" to prevent caregiver burnout.
            </p>

            <form onSubmit={handleReassignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reassign To:</label>
                <select
                  value={targetCaregiverId}
                  onChange={(e) => setTargetCaregiverId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-800 dark:text-slate-100"
                >
                  <option value={1}>Sarah Johnson (Family Caregiver)</option>
                  <option value={2}>David Miller, CNA (Professional CNA)</option>
                  <option value={3}>Elena Vance, RN (Care Coordinator)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassigningTask(null)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-700"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};