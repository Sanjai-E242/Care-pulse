import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogIn, Sparkles, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('family@carepulse.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAuthError = (err: any): string => {
    if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.PROD) {
      return 'Production backend URL is not configured. Please set VITE_API_BASE_URL in your Vercel project settings.';
    }
    if (!err || !err.response) {
      return 'Unable to connect to the CarePulse server. Please verify the backend service is running and reachable.';
    }
    const status = err.response.status;
    if (status === 401) {
      return 'Invalid email or password.';
    }
    if (status === 403) {
      return 'Your account does not have permission to access this area.';
    }
    if (status === 404) {
      return 'Authentication service is unavailable.';
    }
    if (status >= 500) {
      return 'Server error. Please try again.';
    }
    return err.response.data?.message || 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: Role) => {
    const cred = DEMO_CREDENTIALS[role];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.pass);
    }
    setLoading(true);
    setError(null);
    try {
      await switchDemoRole(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            CarePulse <span className="text-teal-600 dark:text-teal-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign in to your care portal</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Coordinate observations, track burnout, and synchronize care teams
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          {/* Quick Demo Role Logins */}
          <div className="mb-6 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 dark:text-teal-200 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>1-Click Demo Persona Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleDemoLogin(r)}
                  disabled={loading}
                  className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{DEMO_CREDENTIALS[r].title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                placeholder="name@carepulse.com"
              />
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
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};