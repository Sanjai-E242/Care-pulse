import React, { useEffect, useState } from 'react';
import { patientApi, familyApi, taskApi } from '../services/api';
import { Patient, FamilyDiscussion, FamilySummary, CareTask } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TaskCard } from '../components/TaskCard';
import {
  HeartHandshake, Users, MessageSquare, Sparkles, Send,
  Plus, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

export const FamilyPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [discussions, setDiscussions] = useState<FamilyDiscussion[]>([]);
  const [summary, setSummary] = useState<FamilySummary | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [familyTasks, setFamilyTasks] = useState<CareTask[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [category, setCategory] = useState<string>('UPDATE');
  const [loading, setLoading] = useState<boolean>(true);
  const [posting, setPosting] = useState<boolean>(false);

  useEffect(() => {
    patientApi.getAll().then((data) => {
      setPatients(data);
      if (data.length > 0) {
        setSelectedPatientId(data[0].id);
        fetchFamilyData(data[0].id);
      }
    });
  }, []);

  const fetchFamilyData = (pId: number) => {
    setLoading(true);
    Promise.all([
      familyApi.getDiscussions(pId),
      familyApi.getSummary(pId),
      familyApi.getMembers(pId),
      taskApi.getAll({ patientId: pId }),
    ])
      .then(([disc, sum, mem, tasks]) => {
        setDiscussions(disc);
        setSummary(sum);
        setMembers(mem);
        setFamilyTasks(tasks);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handlePatientSelect = (pId: number) => {
    setSelectedPatientId(pId);
    fetchFamilyData(pId);
  };

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newMessage.trim()) return;
    setPosting(true);
    try {
      const created = await familyApi.postDiscussion({
        patientId: selectedPatientId,
        message: newMessage,
        category,
      });
      setDiscussions([...discussions, created]);
      setNewMessage('');
      // Refresh AI summary
      familyApi.getSummary(selectedPatientId).then(setSummary);
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/40">
            Care Circle Coordination
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Shared Family Care Workspace</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synchronized patient visibility, collaborative task sharing, and mediated discussions
          </p>
        </div>

        {/* Patient Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePatientSelect(p.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${
                selectedPatientId === p.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {p.fullName}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Connecting to family care circle..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: AI Summary & Discussion Thread */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Discussion Neutral Summary Box */}
            {summary && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-teal-200 dark:border-teal-800/60 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300">
                  <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider">AI Family Discussion Synthesis</h3>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-teal-50/50 dark:bg-teal-950/30 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/40">
                  "{summary.neutralSummary}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Points of Agreement
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {summary.agreementPoints.map((pt, idx) => (
                        <li key={idx}>• {pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Discussion Nuances / Items
                    </span>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                      {summary.disagreementPoints.length > 0 ? (
                        summary.disagreementPoints.map((pt, idx) => <li key={idx}>• {pt}</li>)
                      ) : (
                        <li>• No contentious items; all members aligned on care plans.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {summary.suggestedActionItems.length > 0 && (
                  <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-purple-900 dark:text-purple-300">Suggested Action Items:</span>
                    <ul className="list-disc list-inside text-purple-800 dark:text-purple-300 space-y-0.5">
                      {summary.suggestedActionItems.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Discussion Messages */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Family Care Circle Discussion</span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {discussions.map((d) => (
                  <div key={d.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{d.userName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                          {d.userRole.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(d.createdAt).toLocaleDateString()} {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{d.message}</p>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handlePostMessage} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share an update, concern, or care question..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <button
                  type="submit"
                  disabled={posting || !newMessage.trim()}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right 1 Col: Care Circle Members & Family Tasks */}
          <div className="space-y-6">
            
            {/* Care Circle Members */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Care Team Circle</span>
              </h3>

              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{m.user?.fullName}</span>
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                        {m.relationship}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{m.responsibilities}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Shared Tasks</h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">{familyTasks.length} Active</span>
              </div>
              <div className="space-y-2">
                {familyTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};