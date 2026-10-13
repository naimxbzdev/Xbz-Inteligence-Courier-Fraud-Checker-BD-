import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LookupReport } from '../types';
import { 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Sparkles,
  PhoneCall,
  Activity,
  Layers,
  Check
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (phone: string, scenario?: string) => Promise<void>;
  isLoading: boolean;
  onClear: () => void;
  hasResult: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearch, 
  isLoading, 
  onClear, 
  hasResult 
}) => {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Bangladesh operator validation: 11 digits starting with 013-019 (supports Bengali & English numerals)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let val = e.target.value.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));
    val = val.replace(/[^0-9]/g, '');
    setPhone(val);
    setSelectedScenario(null);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setValidationError(
        language === 'bn' 
          ? 'অনুগ্রহ করে একটি মোবাইল নম্বর দিন।' 
          : 'Please enter a mobile phone number.'
      );
      return;
    }

    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let normalized = phone.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));
    normalized = normalized.replace(/[\s\-\(\)\.]/g, '');

    if (normalized.startsWith('+880')) {
      normalized = '0' + normalized.slice(4);
    } else if (normalized.startsWith('880')) {
      normalized = '0' + normalized.slice(3);
    } else if (!normalized.startsWith('0') && normalized.length === 10 && /^[1-9]/.test(normalized)) {
      normalized = '0' + normalized;
    }

    if (normalized.length !== 11 || !/^01[3-9]\d{8}$/.test(normalized)) {
      setValidationError(
        language === 'bn'
          ? 'সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).'
      );
      return;
    }

    setValidationError(null);
    onSearch(normalized, selectedScenario || undefined);
  };

  const handleScenarioPick = (scenario: string, demoNumber: string) => {
    setPhone(demoNumber);
    setSelectedScenario(scenario);
    setValidationError(null);
    onSearch(demoNumber, scenario);
  };

  const handleReset = () => {
    setPhone('');
    setSelectedScenario(null);
    setValidationError(null);
    onClear();
  };

  const scenarios = [
    { id: 'clean', number: '01711000001', labelBn: 'উচ্চ ডেলিভারি (৯৬%)', labelEn: 'Clean Record (96%)' },
    { id: 'high_cancellation', number: '01711000002', labelBn: 'উচ্চ ক্যানসেলেশন (৭৩%)', labelEn: 'High Cancellation' },
    { id: 'scoring_disabled', number: '01711000003', labelBn: 'স্কোরিং নিষ্ক্রিয়', labelEn: 'Scoring Disabled' },
    { id: 'no_record', number: '01711000004', labelBn: 'নতুন কাস্টমার', labelEn: 'No History' },
    { id: 'unavailable', number: '01711000005', labelBn: 'টাইমআউট সিমুলেশন', labelEn: 'Timeout Simulation' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-cyan-500/10">
      
      {/* Subtle ambient cyber glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & Phone Search Form */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Small Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline — EXACTLY as required without large "XBZ Intelligence" title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-2 text-balance">
              {t('hero.headline.line1')}
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 tracking-tight mb-5 cyan-text-glow">
              {t('hero.headline.line2')}
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
              {t('hero.description')}
            </p>

            {/* Phone Search Form */}
            <div className="w-full max-w-xl">
              <form 
                onSubmit={handleSubmit}
                className="p-2 sm:p-2.5 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(0,240,255,0.12)] backdrop-blur-xl transition-all focus-within:border-cyan-400 focus-within:shadow-[0_0_28px_rgba(0,240,255,0.25)]"
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  
                  {/* Country Code & Phone Input Group */}
                  <div className="flex items-center flex-1 bg-slate-950/80 rounded-xl px-3 border border-slate-800 focus-within:border-cyan-500/50">
                    <div className="flex items-center gap-1.5 pr-2.5 py-2.5 border-r border-slate-800 text-slate-300 font-semibold text-sm shrink-0">
                      <span className="text-base" role="img" aria-label="Bangladesh flag">🇧🇩</span>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent text-xs sm:text-sm font-semibold text-cyan-300 focus:outline-none cursor-pointer"
                      >
                        <option value="+880" className="bg-slate-900 text-white">+880 (BD)</option>
                      </select>
                    </div>

                    <input
                      type="tel"
                      value={phone}
                      onChange={handleInputChange}
                      placeholder={t('hero.phonePlaceholder')}
                      maxLength={14}
                      className="w-full bg-transparent px-3 py-3 text-white text-base sm:text-lg font-mono placeholder:text-slate-500 focus:outline-none"
                    />

                    {phone && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        title="Clear Input"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Primary Search Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>{t('hero.searchingBtn')}</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>{t('hero.searchBtn')}</span>
                      </>
                    )}
                  </button>

                </div>

                {/* Inline Validation Error */}
                {validationError && (
                  <div className="flex items-center gap-2 mt-2.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{validationError}</span>
                  </div>
                )}
              </form>

              {/* Sandbox Scenario Selector (Interactive for reviewers & merchants) */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {t('hero.testScenarios')}
                </span>
                {scenarios.map((sc) => {
                  const isSelected = selectedScenario === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleScenarioPick(sc.id, sc.number)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {language === 'bn' ? sc.labelBn : sc.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* 4 Small Benefit Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('benefit.secure')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('benefit.instant')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('benefit.verified')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t('benefit.privacy')}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Futuristic 3D Visual Asset */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Visual Container with 3D Border Glow */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden p-1.5 bg-gradient-to-b from-cyan-500/30 via-blue-600/20 to-slate-900/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,240,255,0.2)] group transition-transform duration-500 hover:scale-[1.01]">
              
              <div className="relative rounded-[22px] overflow-hidden bg-[#070d1e]">
                
                {/* Hero 3D Graphic Generated Specifically for XBZ */}
                <img
                  src="/src/assets/images/hero_courier_shield_1791896745009.jpg"
                  alt="XBZ Intelligence Futuristic Courier Security Shield and Delivery Telemetry"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Cyber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a17] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Floating Telemetry Glass Card: Live Status */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#090f23]/85 border border-cyan-500/25 backdrop-blur-md shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Courier Intelligence Engine</span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Steadfast · Pathao · REDX · Paperfly · eCourier
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Ready
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
