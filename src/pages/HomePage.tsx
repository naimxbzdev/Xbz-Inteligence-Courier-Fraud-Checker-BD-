import React, { useRef } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CourierStatusStrip } from '../components/CourierStatusStrip';
import { SearchResultView } from '../components/SearchResultView';
import { ParcelTrackingView } from '../components/ParcelTrackingView';
import { FeatureSection } from '../components/FeatureSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TrustBanner } from '../components/TrustBanner';
import { RiskAnalyticsDashboard } from '../components/RiskAnalyticsDashboard';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { LookupReport, ParcelTrackingReport, SearchType } from '../types';

interface HomePageProps {
  onSearch: (
    query: string,
    searchType: SearchType,
    courier: string,
    scenario?: string
  ) => Promise<void>;
  isLoading: boolean;
  report: LookupReport | null;
  parcelReport: ParcelTrackingReport | null;
  error?: string | null;
  onClear: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  isLoading,
  report,
  parcelReport,
  error,
  onClear,
  onNavigateTab,
}) => {
  const { language } = useLanguage();
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSearchAndScroll = async (
    query: string,
    searchType: SearchType,
    courier: string,
    scenario?: string
  ) => {
    await onSearch(query, searchType, courier, scenario);
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection
        onSearch={handleSearchAndScroll}
        isLoading={isLoading}
        onClear={onClear}
        hasResult={Boolean(report || parcelReport)}
      />

      {/* Search Error Banner (If any) */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
            <span>{error}</span>
            <button
              onClick={onClear}
              className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Phone Search Result (If available) */}
      {report && (
        <div ref={resultRef} className="py-8 bg-[#060a17]/95 border-b border-cyan-500/20">
          <SearchResultView report={report} onReset={onClear} />
        </div>
      )}

      {/* Parcel Tracking Result (If available) */}
      {parcelReport && (
        <div ref={resultRef} className="py-8 bg-[#060a17]/95 border-b border-cyan-500/20">
          <ParcelTrackingView report={parcelReport} onReset={onClear} />
        </div>
      )}

      {/* Courier Status Strip */}
      <CourierStatusStrip onSelectCourier={() => onNavigateTab('couriers')} />

      {/* Risk Analytics Section on Home */}
      <section className="py-12 border-b border-cyan-500/15 bg-gradient-to-b from-[#050811] via-[#060c22] to-[#050811]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'bn' ? 'জাতীয় কুরিয়ার ইন্টেলিজেন্স' : 'National Logistics Risk Telemetry'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {language === 'bn' ? 'কুরিয়ার ডেলিভারি পারফরম্যান্স ও রিস্ক অ্যানালিটিক্স' : 'Courier Delivery Performance & Risk Analytics'}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-center cursor-pointer"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ ড্যাশবোর্ড দেখুন' : 'Explore Full Analytics'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <RiskAnalyticsDashboard />
        </div>
      </section>

      {/* Feature Cards */}
      <FeatureSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Trust & Security Banner */}
      <TrustBanner />
    </div>
  );
};
