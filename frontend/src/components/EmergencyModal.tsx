import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, X } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border-4 border-red-500 p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-950/80 rounded-2xl">
            <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
              Critical Red-Flag Signal
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Possible Medical Emergency</h2>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-200 text-base font-medium mb-4 leading-relaxed">
          {message || 'The symptoms described indicate potentially severe acute physiological deterioration.'}
        </p>

        <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 rounded-2xl p-4 mb-6 text-sm text-red-900 dark:text-red-200 space-y-2">
          <p className="font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            DO NOT DELAY CLINICAL ATTENTION
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-red-800 dark:text-red-300">
            <li>Call your local emergency medical service (e.g. 108 / 112) immediately.</li>
            <li>Ensure the patient is resting comfortably with open airways.</li>
            <li>Do not attempt to move the person if spinal or hip injury is suspected.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:108"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 transition text-base"
          >
            <PhoneCall className="w-5 h-5" />
            Call Emergency (108)
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl transition text-sm"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
};