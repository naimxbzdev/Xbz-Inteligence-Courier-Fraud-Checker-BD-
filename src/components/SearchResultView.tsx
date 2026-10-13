import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LookupReport, RiskLevel } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Info,
  Building2,
  FileText,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

interface SearchResultViewProps {
  report: LookupReport;
  onReset: () => void;
}

export const SearchResultView: React.FC<SearchResultViewProps> = ({ report, onReset }) => {
  const { language, t } = useLanguage();
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return {
          bg: 'bg-emerald-950/50',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        };
      case 'moderate':
        return {
          bg: 'bg-amber-950/50',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
        };
      case 'high':
        return {
          bg: 'bg-red-950/50',
          border: 'border-red-500/40',
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
        };
      default:
        return {
          bg: 'bg-slate-900/60',
          border: 'border-slate-700',
          text: 'text-slate-300',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <HelpCircle className="w-6 h-6 text-slate-400" />,
        };
    }
  };

  const riskTheme = getRiskColor(report.riskSummary.level);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const text = `XBZ Intelligence Report\nPhone: ${report.maskedPhone}\nRisk Level: ${report.riskSummary.level.toUpperCase()}\nStatus: ${report.overallStatus}\nGenerated at: ${new Date(report.timestamp).toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-xl backdrop-blur-md mb-6">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('result.reportTitle')}
              </h2>
              {report.isSandboxMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  SANDBOX / DEMO
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span>·</span>
              <span>ID: {report.requestId}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('result.exportBtn')}</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('result.retryBtn')}</span>
          </button>
        </div>

      </div>

      {/* Primary KPI & Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        
        {/* Phone Card with Privacy Mask Toggle */}
        <div className="p-4 rounded-xl bg-[#0a1126] border border-cyan-500/20 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>{t('result.maskedNumber')}</span>
            <button
              onClick={() => setShowFullPhone(!showFullPhone)}
              className="text-cyan-400 hover:text-cyan-300"
              title={showFullPhone ? 'Mask Number' : 'Reveal Number'}
            >
              {showFullPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-cyan-300 tracking-wide">
            {showFullPhone ? report.normalizedPhone : report.maskedPhone}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bangladesh (+880)</div>
        </div>

        {/* Checked Providers */}
        <div className="p-4 rounded-xl bg-[#0a1126] border border-cyan-500/20 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 mb-1">
            {t('result.providersChecked')}
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-white">
            {report.totalProvidersChecked} Providers
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Steadfast · Pathao · REDX · Paperfly · eCourier
          </div>
        </div>

        {/* Verified Results Count */}
        <div className="p-4 rounded-xl bg-[#0a1126] border border-cyan-500/20 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 mb-1">
            {t('result.verifiedProviders')}
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
            {report.verifiedProvidersCount} Courier(s)
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active History Match</div>
        </div>

        {/* Unsupported / Unavailable Providers */}
        <div className="p-4 rounded-xl bg-[#0a1126] border border-cyan-500/20 shadow-md">
          <div className="text-[11px] font-medium text-slate-400 mb-1">
            {t('result.unsupportedProviders')}
          </div>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-300">
            {report.unsupportedProvidersCount} Courier(s)
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tracking-Only APIs</div>
        </div>

      </div>

      {/* Risk Analysis Card */}
      <div className={`p-6 rounded-2xl ${riskTheme.bg} border ${riskTheme.border} shadow-2xl backdrop-blur-xl mb-6`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-700">
              {riskTheme.icon}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t('result.riskTitle')}
              </div>
              <h3 className={`text-xl sm:text-2xl font-extrabold ${riskTheme.text}`}>
                {language === 'bn' ? report.riskSummary.titleBn : report.riskSummary.titleEn}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${riskTheme.badge}`}>
              {report.riskSummary.level.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Specific reasons supported by data */}
        <div className="space-y-2 mb-5">
          <div className="text-xs font-bold text-slate-300">
            {language === 'bn' ? 'তথ্যভিত্তিক পর্যালোচনার কারণসমূহ:' : 'Data-Backed Observations:'}
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {(language === 'bn' ? report.riskSummary.reasonsBn : report.riskSummary.reasonsEn).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mathematical Formula Explanation & Limitations Note */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-2">
          <div>
            <span className="font-semibold text-cyan-300">{t('result.formula')}: </span>
            <span>{language === 'bn' ? report.riskSummary.scoringFormulaExplanationBn : report.riskSummary.scoringFormulaExplanationEn}</span>
          </div>
          <div>
            <span className="font-semibold text-amber-300">{t('result.limitations')}: </span>
            <span>{language === 'bn' ? report.riskSummary.limitationsNoteBn : report.riskSummary.limitationsNoteEn}</span>
          </div>
        </div>

      </div>

      {/* Provider Breakdown Cards */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>{t('result.courierDetails')}</span>
        </h3>

        <div className="space-y-3">
          {report.providerResults.map((prov) => {
            const isVerified = prov.status === 'verified_result';
            const isUnsupported = prov.status === 'unsupported';
            const isNoRecord = prov.status === 'no_record';
            const isUnavailable = prov.status === 'unavailable';

            return (
              <div
                key={prov.provider}
                className="p-4 sm:p-5 rounded-xl bg-[#090f23]/90 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-300">
                      {prov.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm">{prov.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">
                        {prov.dataSource}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isVerified && (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                        {language === 'bn' ? prov.statusLabelBn : prov.statusLabelEn}
                      </span>
                    )}
                    {isNoRecord && (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700">
                        {language === 'bn' ? prov.statusLabelBn : prov.statusLabelEn}
                      </span>
                    )}
                    {isUnsupported && (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                        {language === 'bn' ? prov.statusLabelBn : prov.statusLabelEn}
                      </span>
                    )}
                    {isUnavailable && (
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-300 border border-red-500/40">
                        {language === 'bn' ? prov.statusLabelBn : prov.statusLabelEn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivered / Cancelled / Ratio Metrics — Displays live telemetry */}
                {isVerified && (
                  <div className="space-y-3 my-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-slate-800/80 text-xs">
                      <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">{t('result.successRatio')}</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {prov.deliveryRatio !== undefined ? `${Math.round(prov.deliveryRatio * 100)}%` : t('result.notProvided')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'bn' ? 'ক্যানসেলেশন ও রিটার্ন' : 'Cancellation Rate'}</span>
                        <span className="text-base font-bold font-mono text-red-400">
                          {prov.cancellationRatio !== undefined ? `${Math.round(prov.cancellationRatio * 100)}%` : t('result.notProvided')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'bn' ? 'পার্সেল ভলিউম' : 'Parcel Volume'}</span>
                        <span className="text-base font-bold font-mono text-cyan-300">
                          {prov.volumeRange ? `${prov.volumeRange} Orders` : (prov.volumeBand ? prov.volumeBand.toUpperCase() : t('result.notProvided'))}
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'bn' ? 'মার্চেন্ট রিপোর্ট' : 'Incident Reports'}</span>
                        <span className={`text-base font-bold font-mono ${prov.totalReports && prov.totalReports > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                          {prov.totalReports !== undefined ? `${prov.totalReports} Reports` : t('result.notProvided')}
                        </span>
                      </div>
                    </div>

                    {/* Fraud Categories Breakdown (If reported by provider) */}
                    {prov.fraudCategories && Object.keys(prov.fraudCategories).length > 0 && (
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs">
                        <div className="font-semibold text-red-300 mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          <span>{language === 'bn' ? 'মার্চেন্ট রিপোর্ট ক্যাটাগরি বিশ্লেষণ:' : 'Merchant Incident Breakdown:'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(prov.fraudCategories).map(([key, count]) => (
                            <div key={key} className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="font-bold font-mono text-red-300 ml-1">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Unsupported explanation */}
                {isUnsupported && (
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200 mt-2">
                    <div className="font-semibold mb-0.5">Provider Scope Notice:</div>
                    <p>{prov.unsupportedReason}</p>
                  </div>
                )}

                {/* Unavailable / Timeout / Quota Notice */}
                {isUnavailable && (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 mt-2 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-red-300 text-sm block mb-1">
                          {language === 'bn' ? (prov.statusLabelBn || 'কুরিয়ার গেটওয়ে এরর') : (prov.statusLabelEn || 'Gateway Error')}
                        </span>
                        <p className="text-[12px] text-red-200 leading-relaxed">
                          {prov.unsupportedReason}
                        </p>
                      </div>
                    </div>
                    {prov.notesBn && (
                      <div className="pt-2.5 border-t border-red-500/20 text-[11px] text-slate-300 leading-relaxed">
                        {language === 'bn' ? prov.notesBn : prov.notesEn}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {(prov.notesBn || prov.notesEn) && (
                  <div className="text-[11px] text-slate-400 mt-2">
                    {language === 'bn' ? prov.notesBn : prov.notesEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Legal & Privacy Disclaimer */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-white">স্বচ্ছতা ও গোপনীয়তা প্রতিশ্রুতি: </span>
          <span>{report.disclaimerBn}</span>
        </div>
      </div>

    </div>
  );
};
