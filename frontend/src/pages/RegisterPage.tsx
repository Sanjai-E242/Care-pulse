import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('FAMILY_CAREGIVER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ fullName, email, password, phone, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            CarePulse <span className="text-teal-600 dark:text-teal-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Join a care circle or clinical coordination team</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                placeholder="e.g. Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                placeholder="+1 555-0100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              >
                <option value="FAMILY_CAREGIVER">Family Caregiver</option>
                <option value="PROFESSIONAL_CAREGIVER">Professional Caregiver / CNA</option>
                <option value="CARE_COORDINATOR">Care Coordinator</option>
                <option value="CLINICAL_STAFF">Clinical Staff / Physician</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};