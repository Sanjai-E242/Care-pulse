import React, { useState } from 'react';
import { Heart, X, Sparkles } from 'lucide-react';
import { burnoutApi } from '../services/api';

interface WellbeingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WellbeingModal: React.FC<WellbeingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedMood, setSelectedMood] = useState<string>('DOING_OKAY');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const moods = [
    { key: 'DOING_OKAY', emoji: '😊', label: 'Doing okay', color: 'border-green-200 dark:border-green-900/60 hover:border-green-400 bg-green-50/50 dark:bg-green-950/30 text-slate-700 dark:text-slate-200' },
    { key: 'A_LITTLE_OVERWHELMED', emoji: '😐', label: 'A little overwhelmed', color: 'border-yellow-200 dark:border-yellow-900/60 hover:border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/30 text-slate-700 dark:text-slate-200' },
    { key: 'VERY_OVERWHELMED', emoji: '😟', label: 'Very overwhelmed', color: 'border-orange-200 dark:border-orange-900/60 hover:border-orange-400 bg-orange-50/50 dark:bg-orange-950/30 text-slate-700 dark:text-slate-200' },
    { key: 'STRUGGLING', emoji: '😣', label: 'Struggling', color: 'border-red-200 dark:border-red-900/60 hover:border-red-400 bg-red-50/50 dark:bg-red-950/30 text-slate-700 dark:text-slate-200' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const risk = await burnoutApi.recordCheckin({ moodRating: selectedMood, notes });
      if (risk.level === 'HIGH' || risk.level === 'CRITICAL') {
        setResultMessage("We hear you. Your responses suggest significant strain today. We have surfaced workload redistribution recommendations for your care circle.");
      } else {
        setResultMessage("Thank you for checking in. Tracking your wellbeing helps ensure both you and your loved ones stay healthy.");
      }
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setResultMessage(null);
        setNotes('');
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-xl border border-slate-100 dark:border-slate-800 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-teal-600 mb-3">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 rounded-xl">
            <Heart className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Caregiver Wellbeing Check-in</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your health directly protects care quality</p>
          </div>
        </div>

        {resultMessage ? (
          <div className="py-8 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{resultMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                How are you feeling about caregiving today?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {moods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMood(m.key)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${m.color} ${
                      selectedMood === m.key ? 'ring-2 ring-teal-600 shadow-sm' : ''
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                What is making today difficult? (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="E.g. lack of sleep, difficult transfers, heavy schedule..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Check-in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};