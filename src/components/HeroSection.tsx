import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SearchType, CourierFilter } from '../types';
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
  Check,
  Package,
  FileText,
  ChevronDown,
  Truck,
  Radio,
  ExternalLink
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (
    query: string,
    searchType: SearchType,
    courier: string,
    scenario?: string
  ) => Promise<void>;
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
  
  // Search Mode & Courier State
  const [searchType, setSearchType] = useState<SearchType>('auto');
  const [selectedCourier, setSelectedCourier] = useState<string>('all');
  
  // Input & validation
  const [inputValue, setInputValue] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Dynamic input classification
  const detectedFormat = (() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return null;
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let norm = trimmed.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));
    norm = norm.replace(/[\s\-\(\)\.]/g, '');
    if (norm.startsWith('+880')) norm = '0' + norm.slice(4);
    else if (norm.startsWith('880')) norm = '0' + norm.slice(3);
    else if (!norm.startsWith('0') && norm.length === 10 && /^[1-9]/.test(norm)) norm = '0' + norm;

    if (norm.length === 11 && /^01[3-9]\d{8}$/.test(norm)) {
      return { type: 'phone' as const, normalized: norm };
    }
    if (/[a-zA-Z\-_]/.test(trimmed) || (norm.length > 0 && norm.length !== 11)) {
      return { type: 'consignment' as const, normalized: trimmed };
    }
    return { type: 'unknown' as const, normalized: trimmed };
  })();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Normalize Bangla digits if entered
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    val = val.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));
    setInputValue(val);
    setSelectedScenario(null);
    if (validationError) setValidationError(null);
  };

  const handleSearchTypeChange = (newType: SearchType) => {
    setSearchType(newType);
    setSelectedScenario(null);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();

    if (!val) {
      setValidationError(
        language === 'bn' 
          ? 'অনুগ্রহ করে মোবাইল নম্বর, কনসাইনমেন্ট আইডি অথবা ট্র্যাকিং কোড দিন।' 
          : 'Please enter a mobile phone number, consignment ID, or tracking code.'
      );
      return;
    }

    // Determine if input is a valid Bangladeshi phone number
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let normalized = val.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));
    normalized = normalized.replace(/[\s\-\(\)\.]/g, '');

    if (normalized.startsWith('+880')) {
      normalized = '0' + normalized.slice(4);
    } else if (normalized.startsWith('880')) {
      normalized = '0' + normalized.slice(3);
    } else if (!normalized.startsWith('0') && normalized.length === 10 && /^[1-9]/.test(normalized)) {
      normalized = '0' + normalized;
    }

    const isPhone = normalized.length === 11 && /^01[3-9]\d{8}$/.test(normalized);

    // Auto routing logic
    let targetType: SearchType = searchType;
    if (searchType === 'auto') {
      targetType = isPhone ? 'phone' : 'consignment';
    } else if (searchType === 'phone') {
      // If user had phone selected, but entered a tracking code like CID-1234
      targetType = isPhone ? 'phone' : 'consignment';
    } else {
      // Consignment or Parcel
      targetType = isPhone ? 'phone' : searchType;
    }

    if (targetType === 'phone') {
      if (!isPhone) {
        setValidationError(
          language === 'bn'
            ? 'সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।'
            : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).'
        );
        return;
      }
      setValidationError(null);
      onSearch(normalized, 'phone', selectedCourier, selectedScenario || undefined);
    } else {
      if (val.length < 3) {
        setValidationError(
          language === 'bn'
            ? 'অনুগ্রহ করে সঠিক আইডি দিন (কমপক্ষে ৩ অক্ষর)।'
            : 'Please enter a valid ID (at least 3 characters).'
        );
        return;
      }
      setValidationError(null);
      onSearch(val, targetType, selectedCourier);
    }
  };

  const handleScenarioPick = (scenario: string, demoNumber: string) => {
    setSearchType('phone');
    setInputValue(demoNumber);
    setSelectedScenario(scenario);
    setValidationError(null);
    onSearch(demoNumber, 'phone', selectedCourier, scenario);
  };

  const handleSampleParcelPick = (trackingCode: string, courier: string, type: SearchType) => {
    setSearchType(type);
    setSelectedCourier(courier);
    setInputValue(trackingCode);
    setValidationError(null);
    onSearch(trackingCode, type, courier);
  };

  const handleReset = () => {
    setInputValue('');
    setSelectedScenario(null);
    setValidationError(null);
    onClear();
  };

  const phoneScenarios = [
    { id: 'clean', number: '01711000001', labelBn: 'উচ্চ ডেলিভারি (৯৬%)', labelEn: 'Clean Record (96%)' },
    { id: 'high_cancellation', number: '01711000002', labelBn: 'উচ্চ ক্যানসেলেশন (৭৩%)', labelEn: 'High Cancellation' },
    { id: 'scoring_disabled', number: '01711000003', labelBn: 'স্কোরিং নিষ্ক্রিয়', labelEn: 'Scoring Disabled' },
    { id: 'no_record', number: '01711000004', labelBn: 'নতুন কাস্টমার', labelEn: 'No History' },
    { id: 'unavailable', number: '01711000005', labelBn: 'টাইমআউট সিমুলেশন', labelEn: 'Timeout Simulation' },
  ];

  const sampleParcels = [
    { id: 'CID-774920', courier: 'steadfast', type: 'consignment' as const, label: 'Steadfast (CID-774920 · Delivered)' },
    { id: 'PTH-892140', courier: 'pathao', type: 'consignment' as const, label: 'Pathao (PTH-892140 · Out for Delivery)' },
    { id: 'RDX-551029', courier: 'redx', type: 'parcel' as const, label: 'REDX (RDX-551029 · Returned)' },
    { id: 'PFL-99120', courier: 'paperfly', type: 'consignment' as const, label: 'Paperfly (PFL-99120 · In Transit)' },
    { id: 'EC-110948', courier: 'ecourier', type: 'parcel' as const, label: 'eCourier (EC-110948 · Delivered)' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-cyan-500/10">
      
      {/* Ambient cyber glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & Universal Search Form */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Small Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline — STRICTLY as required by project specification */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-2 text-balance">
              {t('hero.headline.line1')}
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 tracking-tight mb-3 cyan-text-glow">
              {t('hero.headline.line2')}
            </div>

            {/* Sub-tagline for parcel/consignment multi-courier tracking */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4 animate-in fade-in duration-300">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {language === 'bn' 
                  ? 'অথবা কনসাইনমেন্ট ও পার্সেল ট্র্যাকিং কোড দিয়ে সকল কুরিয়ারে খুঁজুন' 
                  : 'Or search via Consignment ID & Tracking Code across all courier APIs'}
              </span>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-6 max-w-2xl">
              {t('hero.description')}
            </p>

            {/* Universal Search Container */}
            <div className="w-full max-w-xl">
              
              <form 
                onSubmit={handleSubmit}
                className="p-2 sm:p-2.5 rounded-2xl bg-[#090f23]/95 border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(0,240,255,0.12)] backdrop-blur-xl transition-all focus-within:border-cyan-400 focus-within:shadow-[0_0_28px_rgba(0,240,255,0.25)]"
              >
                {/* Top Control Bar: Search Type & Courier Provider Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  
                  {/* Dropdown 1: Search Type */}
                  <div className="relative">
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 px-2 pt-0.5">
                      {t('search.typeLabel')}
                    </label>
                    <div className="flex items-center px-2 py-1">
                      {searchType === 'auto' ? (
                        <Zap className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      ) : searchType === 'phone' ? (
                        <PhoneCall className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      ) : searchType === 'consignment' ? (
                        <FileText className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      ) : (
                        <Package className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      )}
                      <select
                        value={searchType}
                        onChange={(e) => handleSearchTypeChange(e.target.value as SearchType)}
                        className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-4"
                      >
                        <option value="auto" className="bg-slate-900 text-white">
                          ⚡ {t('search.type.auto')}
                        </option>
                        <option value="phone" className="bg-slate-900 text-white">
                          📱 {t('search.type.phone')}
                        </option>
                        <option value="consignment" className="bg-slate-900 text-white">
                          🔖 {t('search.type.consignment')}
                        </option>
                        <option value="parcel" className="bg-slate-900 text-white">
                          📦 {t('search.type.parcel')}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Dropdown 2: Courier Provider Selector */}
                  <div className="relative border-t sm:border-t-0 sm:border-l border-slate-800 pl-0 sm:pl-2">
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 px-2 pt-0.5">
                      {t('search.courierLabel')}
                    </label>
                    <div className="flex items-center px-2 py-1">
                      <Truck className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
                      <select
                        value={selectedCourier}
                        onChange={(e) => setSelectedCourier(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer pr-4"
                      >
                        <option value="all" className="bg-slate-900 text-white">
                          🌐 {t('search.courier.all')}
                        </option>
                        <option value="steadfast" className="bg-slate-900 text-white">
                          🟢 {t('search.courier.steadfast')}
                        </option>
                        <option value="pathao" className="bg-slate-900 text-white">
                          🔴 {t('search.courier.pathao')}
                        </option>
                        <option value="redx" className="bg-slate-900 text-white">
                          🟠 {t('search.courier.redx')}
                        </option>
                        <option value="paperfly" className="bg-slate-900 text-white">
                          🔵 {t('search.courier.paperfly')}
                        </option>
                        <option value="ecourier" className="bg-slate-900 text-white">
                          🟣 {t('search.courier.ecourier')}
                        </option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Input Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  
                  {/* Phone Input or Alphanumeric Tracking Input */}
                  <div className="flex items-center flex-1 bg-slate-950/90 rounded-xl px-3 border border-slate-800 focus-within:border-cyan-500/50">
                    
                    {/* Prefix indicator */}
                    {searchType === 'phone' ? (
                      <div className="flex items-center gap-1.5 pr-2.5 py-2.5 border-r border-slate-800 text-slate-300 font-semibold text-sm shrink-0">
                        <span className="text-base" role="img" aria-label="Bangladesh flag">🇧🇩</span>
                        <span className="text-xs font-semibold text-cyan-300">+880</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 pr-2.5 py-2.5 border-r border-slate-800 text-cyan-400 font-semibold text-xs shrink-0">
                        {detectedFormat?.type === 'phone' ? (
                          <PhoneCall className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Package className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="uppercase text-[10px] font-mono">
                          {detectedFormat?.type === 'phone' ? 'BD' : 'ID'}
                        </span>
                      </div>
                    )}

                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder={
                        searchType === 'phone'
                          ? t('hero.phonePlaceholder')
                          : searchType === 'consignment'
                          ? t('search.consignmentPlaceholder')
                          : searchType === 'parcel'
                          ? t('search.parcelPlaceholder')
                          : t('search.autoPlaceholder')
                      }
                      maxLength={35}
                      className="w-full bg-transparent px-3 py-3 text-white text-base sm:text-lg font-mono placeholder:text-slate-500 focus:outline-none"
                    />

                    {inputValue && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
                        <span>
                          {detectedFormat?.type === 'phone' || searchType === 'phone'
                            ? t('hero.searchBtn')
                            : t('search.trackBtn')}
                        </span>
                      </>
                    )}
                  </button>

                </div>

                {/* Smart Detected Badge under input */}
                {inputValue && detectedFormat && (
                  <div className="mt-2 px-2 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {detectedFormat.type === 'phone' ? (
                        <span>
                          {language === 'bn' 
                            ? 'মোবাইল নম্বর সনাক্ত হয়েছে · সকল কুরিয়ারে ফ্রড হিস্ট্রি চেক হবে' 
                            : 'Phone Number detected · Fraud history will be queried across couriers'}
                        </span>
                      ) : (
                        <span>
                          {language === 'bn'
                            ? 'কনসাইনমেন্ট / ট্র্যাকিং আইডি সনাক্ত হয়েছে · সকল কুরিয়ার গেটওয়েতে খোঁজা হবে'
                            : 'Tracking/Consignment ID detected · Will search all courier gateways'}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Courier: {selectedCourier === 'all' ? 'All Couriers' : selectedCourier}
                    </span>
                  </div>
                )}

                {/* Inline Validation Error */}
                {validationError && (
                  <div className="flex items-center gap-2 mt-2.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{validationError}</span>
                  </div>
                )}
              </form>

              {/* Sample Quick Chips: Both Phone Scenarios & Parcel Tracking IDs */}
              <div className="mt-4 space-y-2">
                {/* Phone Scenarios */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-cyan-400" />
                    {language === 'bn' ? 'ফোন টেস্ট সিনারিও:' : 'Phone Presets:'}
                  </span>
                  {phoneScenarios.map((sc) => {
                    const isSelected = selectedScenario === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleScenarioPick(sc.id, sc.number)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
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

                {/* Parcel Tracking Samples */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                    <Package className="w-3 h-3 text-cyan-400" />
                    {language === 'bn' ? 'পার্সেল ট্র্যাকিং স্যাম্পল:' : 'Parcel Samples:'}
                  </span>
                  {sampleParcels.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSampleParcelPick(sp.id, sp.courier, sp.type)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 text-cyan-400/90 hover:text-cyan-200 hover:bg-slate-800 border border-cyan-500/20 transition-all cursor-pointer"
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick 4 Trust Points */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('benefit.secure')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('benefit.instant')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('benefit.verified')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t('benefit.privacy')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Courier Intelligence Hub Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-[#09112a] to-[#040817] border border-cyan-500/30 p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden group">
              
              {/* Animated Radar Scanning Grid Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Hub Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider uppercase">
                    LIVE INTELLIGENCE RADAR
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>5 GATEWAYS READY</span>
                </div>
              </div>

              {/* Central 3D Card Stack with Courier Logos */}
              <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
                
                {/* Central Floating Node */}
                <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-slate-900 border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.4)] flex flex-col items-center justify-center backdrop-blur-xl transform transition-transform hover:scale-105 duration-300">
                  <Activity className="w-10 h-10 text-cyan-300 animate-pulse mb-1" />
                  <span className="text-[10px] font-mono font-extrabold text-white tracking-widest">
                    XBZ RADAR
                  </span>
                  <span className="text-[8px] font-mono text-cyan-400">
                    5 COURIERS
                  </span>
                </div>

                {/* 5 Orbiting Courier Badges */}
                <div className="grid grid-cols-3 gap-2.5 mt-6 w-full text-center">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Steadfast</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-red-500/30 text-red-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Pathao</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>REDX</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-sky-500/30 text-sky-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Paperfly</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm col-span-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>eCourier Airway Bill</span>
                  </div>
                </div>

              </div>

              {/* Hub Footer Live Metric */}
              <div className="relative z-10 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PARCEL & FRAUD TELEMETRY</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <span>99.9% UPTIME</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
