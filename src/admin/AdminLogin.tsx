import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from '../components/Logo';
import { Lock, User, ArrowLeft, Shield, AlertCircle, KeyRound, Check } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { setAdminToken, setActivePage } = useContent();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      setAdminToken(data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Public Website link */}
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Public Website</span>
        </button>

        <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Store Administrator Portal</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Secure management console for Quadri Medical &amp; General Store
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 py-8 px-6 sm:px-10 rounded-2xl border border-slate-700/80 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-700/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Setup Hint for Store Owner */}
          <div className="mt-8 pt-5 border-t border-slate-700/80 text-slate-400 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              <span>Owner Default Credentials</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/50 font-mono text-[11px] space-y-1">
              <p>Username: <span className="text-white font-bold">admin</span></p>
              <p>Password: <span className="text-white font-bold">quadri1994</span></p>
            </div>
            <p className="text-[11px] text-slate-500">
              You can change this password at any time inside the dashboard settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
