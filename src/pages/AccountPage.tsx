import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { User, Building, Clock, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Download, RotateCcw } from 'lucide-react';

interface AccountPageProps {
  onSearchPhone: (phone: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onSearchPhone }) => {
  const { language } = useLanguage();
  const { user, savedSearches, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="p-8 rounded-2xl bg-[#090f23] border border-cyan-500/25">
          <p className="text-sm text-slate-300 mb-4">
            {language === 'bn' 
              ? 'মার্চেন্ট ড্যাশবোর্ড দেখার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।' 
              : 'Please sign in to view your merchant dashboard and saved lookups.'}
          </p>
        </div>
      </div>
    );
  }

  const exportHistory = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      ['Phone,MaskedPhone,RiskLevel,VerifiedCouriers,Timestamp']
        .concat(savedSearches.map(s => `${s.phone},${s.maskedPhone},${s.riskLevel},${s.verifiedCouriers},${s.timestamp}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xbz_search_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Merchant Profile Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/merchant_avatar_profile_1791896744677.jpg"
              alt="Merchant Profile Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                  MERCHANT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.businessName}</span>
                <span>·</span>
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportHistory}
              disabled={savedSearches.length === 0}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History (CSV)</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-900 transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Saved Searches Section */}
      <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {language === 'bn' ? 'সংরক্ষিত সার্চ ইতিহাস' : 'Recent Lookup History'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' 
                ? 'লগইন থাকা অবস্থায় আপনার সাম্প্রতিক অনুসন্ধানের রেকর্ড' 
                : 'Searches performed during your authorized session'}
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {savedSearches.length} Records
          </span>
        </div>

        {savedSearches.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            {language === 'bn' ? 'এখনো কোনো সার্চ হিস্ট্রি নেই।' : 'No searches recorded yet. Run a search to see it listed here.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Phone (Masked)</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                  <th className="py-2.5 px-3">Verified Couriers</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {savedSearches.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {s.maskedPhone}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.riskLevel === 'low'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : s.riskLevel === 'high'
                          ? 'bg-red-950 text-red-300 border border-red-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {s.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {s.verifiedCouriers} Provider(s)
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(s.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSearchPhone(s.phone)}
                        className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
                      >
                        Re-query
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
