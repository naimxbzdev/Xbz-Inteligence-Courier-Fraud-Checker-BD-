import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Lock, 
  Activity, 
  Server, 
  Terminal, 
  Radio, 
  RefreshCw, 
  Key, 
  AlertCircle, 
  CheckCircle,
  Truck
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { language } = useLanguage();
  const { adminPasskey, isAdminAuthenticated, loginAdmin, logoutAdmin } = useAuth();
  
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);

  // Diagnostic tool
  const [testProvider, setTestProvider] = useState('steadfast');
  const [testPhone, setTestPhone] = useState('01711000001');
  const [testScenario, setTestScenario] = useState('clean');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const fetchHealth = async () => {
    if (!adminPasskey) return;
    setIsLoadingHealth(true);
    try {
      const res = await fetch('/api/admin/health', {
        headers: { 'x-admin-key': adminPasskey },
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        setSystemHealth(data.data);
      } else {
        logoutAdmin();
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchHealth();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoadingAuth(true);

    const success = await loginAdmin(passkeyInput);
    if (!success) {
      setAuthError(
        language === 'bn' 
          ? 'ভুল অ্যাডমিন পাসকি অথবা সার্ভার কানেকশন এরর। ডিফল্ট ডেভেলপমেন্ট কি: admin123' 
          : 'Invalid admin passkey or server connection error. Default development key: admin123'
      );
    }
    setIsLoadingAuth(false);
  };

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasskey) return;
    setIsRunningDiagnostic(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch('/api/admin/test-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminPasskey,
        },
        body: JSON.stringify({
          provider: testProvider,
          phone: testPhone,
          sandboxScenario: testScenario,
        }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error(
          language === 'bn' 
            ? 'সার্ভার থেকে অবৈধ রেসপন্স এসেছে। Netlify Functions সচল রয়েছে কি না চেক করুন।' 
            : 'Non-JSON response from server. Check Netlify Functions status.'
        );
      }
      const data = await res.json();
      setDiagnosticResult(data.diagnostic);
    } catch (err: any) {
      setDiagnosticResult({ error: err.message });
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  // If not authenticated, render Passkey gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 animate-in fade-in">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/95 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'অ্যাডমিনিস্ট্রেটর পোর্টাল' : 'Administrator Portal'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'bn'
                ? 'সিস্টেম ডায়াগনস্টিকস ও নিরাপত্তা নিরীক্ষার জন্য অ্যাডমিন পাসকি প্রয়োজন।'
                : 'Enter your administrative security passkey to access system telemetry.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Passkey (ADMIN_PASSKEY)
              </label>
              <div className="flex items-center bg-slate-950 rounded-xl px-3 border border-slate-800 focus-within:border-cyan-500/50">
                <Key className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-transparent py-2.5 text-white text-xs font-mono focus:outline-none"
                />
              </div>
              <div className="text-[11px] text-cyan-400/80 mt-1.5">
                Development Default: <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">admin123</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoadingAuth ? 'Verifying...' : 'Authorize Admin Session'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-xl mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                XBZ Intelligence Admin Console
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Server Uptime: {systemHealth ? `${Math.floor(systemHealth.uptimeSeconds / 60)} min` : 'Loading...'} · Server Time: {systemHealth?.serverTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchHealth}
            disabled={isLoadingHealth}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 rounded-lg bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-900 transition-all"
          >
            End Admin Session
          </button>
        </div>
      </div>

      {/* Grid: Rate Limiting & System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="p-5 rounded-2xl bg-[#090f23] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Rate Limiter State
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mb-1">
            {systemHealth?.rateLimiter?.activeTrackingIPs ?? 0} IPs Active
          </div>
          <p className="text-xs text-slate-400">
            Window: {systemHealth?.rateLimiter?.windowMinutes ?? 5} min · Max: {systemHealth?.rateLimiter?.maxRequestsPerWindow ?? 25} queries/window
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090f23] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Configured Adapters
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            {systemHealth?.providers?.length ?? 5} Providers
          </div>
          <p className="text-xs text-slate-400">
            Steadfast (Phone Scoring) + 4 Tracking Adapters
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#090f23] border border-cyan-500/20 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Audit Ledger Status
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
            {systemHealth?.recentAuditLogs?.length ?? 0} Events Recorded
          </div>
          <p className="text-xs text-slate-400">
            All phone queries securely masked
          </p>
        </div>

      </div>

      {/* Provider Diagnostic Test Tool */}
      <div className="p-6 rounded-2xl bg-[#090f23]/95 border border-cyan-500/20 shadow-xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">
            Provider Diagnostic Test Runner
          </h2>
        </div>

        <form onSubmit={handleRunDiagnostic} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Provider</label>
            <select
              value={testProvider}
              onChange={(e) => setTestProvider(e.target.value)}
              className="w-full bg-slate-950 rounded-lg px-3 py-2 text-xs text-white border border-slate-800 focus:outline-none"
            >
              <option value="steadfast">Steadfast Courier</option>
              <option value="pathao">Pathao Courier</option>
              <option value="redx">REDX Courier</option>
              <option value="paperfly">Paperfly</option>
              <option value="ecourier">eCourier</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Test Phone</label>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full bg-slate-950 rounded-lg px-3 py-2 text-xs text-white font-mono border border-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Scenario Preset</label>
            <select
              value={testScenario}
              onChange={(e) => setTestScenario(e.target.value)}
              className="w-full bg-slate-950 rounded-lg px-3 py-2 text-xs text-white border border-slate-800 focus:outline-none"
            >
              <option value="clean">Clean (High Delivery)</option>
              <option value="high_cancellation">High Cancellation Rate</option>
              <option value="scoring_disabled">Scoring Disabled by Provider</option>
              <option value="no_record">No Record Found</option>
              <option value="unavailable">Timeout Simulation</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isRunningDiagnostic}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer"
            >
              {isRunningDiagnostic ? 'Testing...' : 'Execute Probe'}
            </button>
          </div>
        </form>

        {diagnosticResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">Probe Response:</div>
            <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-60 p-2">
              {JSON.stringify(diagnosticResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Redacted Audit Logs Table */}
      <div className="p-6 rounded-2xl bg-[#090f23]/95 border border-cyan-500/20 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">
          Redacted System Audit Ledger
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Details (Redacted)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {systemHealth?.recentAuditLogs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
