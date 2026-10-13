import React, { useRef } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CourierStatusStrip } from '../components/CourierStatusStrip';
import { SearchResultView } from '../components/SearchResultView';
import { FeatureSection } from '../components/FeatureSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TrustBanner } from '../components/TrustBanner';
import { LookupReport } from '../types';

interface HomePageProps {
  onSearch: (phone: string, scenario?: string) => Promise<void>;
  isLoading: boolean;
  report: LookupReport | null;
  error?: string | null;
  onClear: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  isLoading,
  report,
  error,
  onClear,
  onNavigateTab,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSearchAndScroll = async (phone: string, scenario?: string) => {
    await onSearch(phone, scenario);
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
        hasResult={Boolean(report)}
      />

      {/* Search Error Banner (If any) */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
            <span>{error}</span>
            <button
              onClick={onClear}
              className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search Result (If available) */}
      {report && (
        <div ref={resultRef} className="py-8 bg-[#060a17]/95 border-b border-cyan-500/20">
          <SearchResultView report={report} onReset={onClear} />
        </div>
      )}

      {/* Courier Status Strip */}
      <CourierStatusStrip onSelectCourier={() => onNavigateTab('couriers')} />

      {/* Feature Cards */}
      <FeatureSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Trust & Security Banner */}
      <TrustBanner />
    </div>
  );
};
