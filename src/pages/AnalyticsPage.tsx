import React from 'react';
import { RiskAnalyticsDashboard } from '../components/RiskAnalyticsDashboard';
import { useLanguage } from '../context/LanguageContext';
import { Search, ShieldCheck, ArrowRight, Truck } from 'lucide-react';

interface AnalyticsPageProps {
  onSearchPhone?: (phone: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onSearchPhone, onNavigateTab }) => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in">
      
      {/* Top Banner with Quick Actions */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#090f23] via-[#0b1535] to-[#070b1a] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>XBZ Intelligence · National Logistics Risk Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'bn' 
              ? 'ডেলিভারি রিস্ক অ্যানালিটিক্স ও কুরিয়ার পারফরম্যান্স' 
              : 'Delivery Risk Analytics & Courier Benchmarks'}
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {language === 'bn'
              ? 'বাংলাদেশের শীর্ষ কুরিয়ারসমূহের ডেলিভারি সাফল্যের হার, এলাকাভিত্তিক ঝুঁকি এবং অনলাইন মার্চেন্টদের দায়ের করা ফ্রড রিপোর্ট বিশ্লেষণ করে আপনার ই-কমার্স ব্যবসাকে সুরক্ষিত রাখুন।'
              : 'Empower your Cash-on-Delivery fulfillment decisions with aggregated delivery success telemetry, cancellation trends, and common customer risk factor insights.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('home')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ফোন নম্বর দিয়ে চেক করুন' : 'Lookup Customer Phone'}</span>
              </button>
            )}

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('couriers')}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'bn' ? 'কুরিয়ার ইন্টিগ্রেশন দেখুন' : 'View Courier Adapters'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient glow decorative circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Analytics Dashboard Component with Recharts */}
      <RiskAnalyticsDashboard onSearchPhone={onSearchPhone} />

    </div>
  );
};
