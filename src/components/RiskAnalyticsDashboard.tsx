import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  RiskAnalyticsData, 
  CourierPerformanceStat, 
  RiskFactorStat, 
  RiskTierStat, 
  HistoricalTrendStat, 
  RegionalPerformanceStat 
} from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Truck,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Filter,
  ArrowUpRight,
  Info,
  ChevronRight,
  Award
} from 'lucide-react';

interface RiskAnalyticsDashboardProps {
  onSearchPhone?: (phone: string) => void;
  compact?: boolean;
}

export const RiskAnalyticsDashboard: React.FC<RiskAnalyticsDashboardProps> = ({ 
  onSearchPhone,
  compact = false 
}) => {
  const { language, t } = useLanguage();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedCourier, setSelectedCourier] = useState<string>('all');
  const [analyticsData, setAnalyticsData] = useState<RiskAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFactor, setSelectedFactor] = useState<RiskFactorStat | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courier/analytics?timeframe=${timeframe}&courier=${selectedCourier}`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.warn('Analytics API response is non-JSON (Netlify Functions or backend server may be offline).');
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setAnalyticsData(data.data);
        if (data.data.commonRiskFactors?.length > 0 && !selectedFactor) {
          setSelectedFactor(data.data.commonRiskFactors[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load risk analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe, selectedCourier]);

  // Fallback state if still loading or error
  const summary = analyticsData?.summary || {
    totalLookupsEvaluated: 4120,
    avgDeliverySuccessRate: 86.8,
    avgReturnCancellationRate: 13.2,
    highRiskIncidentsFlagged: 412,
    activeMonitoredCouriers: 5,
    estimatedLossPreventedBDT: 74160,
  };

  const courierStats: CourierPerformanceStat[] = analyticsData?.courierPerformance || [];
  const riskFactors: RiskFactorStat[] = analyticsData?.commonRiskFactors || [];
  const riskTiers: RiskTierStat[] = analyticsData?.riskTierDistribution || [];
  const trends: HistoricalTrendStat[] = analyticsData?.historicalTrends || [];
  const regionalStats: RegionalPerformanceStat[] = analyticsData?.regionalPerformance || [];

  // Custom Dark Glassmorphism Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-[#090f23]/95 border border-cyan-500/30 shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-white mb-1.5 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.value}
                {typeof entry.value === 'number' && entry.value <= 100 && entry.name.includes('%') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      
      {/* Dashboard Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#080d1f]/90 border border-cyan-500/20 shadow-xl backdrop-blur-md">
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('analytics.badge')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t('analytics.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t('analytics.subtitle')}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Timeframe selector */}
          <div className="flex items-center bg-[#050814] p-1 rounded-xl border border-slate-700/80 text-xs font-medium">
            {(['7d', '30d', '90d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '7d' ? (language === 'bn' ? '৭ দিন' : '7 Days') :
                 tf === '30d' ? (language === 'bn' ? '৩০ দিন' : '30 Days') :
                 tf === '90d' ? (language === 'bn' ? '৯০ দিন' : '90 Days') :
                 (language === 'bn' ? 'সর্বমোট' : 'All')}
              </button>
            ))}
          </div>

          {/* Courier filter dropdown */}
          <div className="relative">
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="bg-[#050814] text-slate-200 text-xs px-3 py-2 pr-8 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">{t('analytics.allCouriers')}</option>
              <option value="steadfast">Steadfast Courier</option>
              <option value="pathao">Pathao Courier</option>
              <option value="redx">REDX Logistics</option>
              <option value="paperfly">Paperfly Private</option>
              <option value="ecourier">eCourier Limited</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Action */}
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title={t('analytics.refresh')}
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* KPI 1: Avg Delivery Success */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.avgSuccess')}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
            {summary.avgDeliverySuccessRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">↑ 2.4%</span>
            <span>vs last month</span>
          </div>
        </div>

        {/* KPI 2: Avg Return Rate */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.avgReturn')}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-400">
            {summary.avgReturnCancellationRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">↓ 1.8%</span>
            <span>national return index</span>
          </div>
        </div>

        {/* KPI 3: Total Evaluated Lookups */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.totalQueries')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300">
            {summary.totalLookupsEvaluated.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {language === 'bn' ? 'যাচাইকৃত ফোন কুয়েরি' : 'Audited phone queries'}
          </div>
        </div>

        {/* KPI 4: High-Risk Interceptions */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.highRisk')}</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-red-400">
            {summary.highRiskIncidentsFlagged.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {language === 'bn' ? 'সতর্কতা নির্দেশিত প্রোফাইল' : 'High review profiles'}
          </div>
        </div>

        {/* KPI 5: Monitored Couriers */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.monitoredGateways')}</span>
            <Truck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-300">
            {summary.activeMonitoredCouriers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {language === 'bn' ? 'স্বীকৃত কুরিয়ার প্রোভাইডার' : 'Connected gateways'}
          </div>
        </div>

        {/* KPI 6: Saved Loss for Merchants */}
        <div className="p-4 rounded-xl bg-[#090f24] border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>{t('analytics.kpi.lossPrevented')}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-300">
            ৳{summary.estimatedLossPreventedBDT.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {language === 'bn' ? 'কুরিয়ার রিটার্ন ফি সাশ্রয়' : 'Return fee loss avoided'}
          </div>
        </div>

      </div>

      {/* Main Charts Row 1: Courier Success Rates & Overall Risk Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Courier-Wise Delivery Success vs Return Rate (BarChart) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#080d1f]/95 border border-cyan-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>{t('analytics.chart.courierSuccessTitle')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' 
                  ? 'প্রতিটি কুরিয়ারের ডেলিভারি সাফল্য হার (%) এবং ক্যানসেলেশন/রিটার্ন অনুপাত' 
                  : 'Delivered success rate (%) vs cancellation & return percentage per courier'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-medium text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              SLA Benchmark
            </span>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courierStats.map((c) => ({
                  name: c.courier.replace(' Courier', '').replace(' Logistics', '').replace(' Private', '').replace(' Limited', ''),
                  'Success Rate %': c.successRate,
                  'Return Rate %': c.returnRate,
                  deliveredCount: c.delivered,
                  returnedCount: c.returned,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#172554" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  domain={[0, 100]} 
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="Success Rate %" 
                  fill="#00f0ff" 
                  radius={[6, 6, 0, 0]} 
                  barSize={22}
                />
                <Bar 
                  dataKey="Return Rate %" 
                  fill="#f43f5e" 
                  radius={[6, 6, 0, 0]} 
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Tier Distribution (Donut / PieChart) */}
        <div className="p-6 rounded-2xl bg-[#080d1f]/95 border border-cyan-500/20 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('analytics.chart.tierTitle')}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {language === 'bn' 
                ? 'সিস্টেমে মূল্যায়িত ক্রেতাদের ঝুঁকি ক্যাটাগরি বণ্টন' 
                : 'Customer distribution across evaluated risk rating tiers'}
            </p>
          </div>

          <div className="w-full h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskTiers.map((tier) => ({
                    name: language === 'bn' ? tier.tierBn : tier.tier,
                    value: tier.percentage,
                    count: tier.count,
                    color: tier.color,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskTiers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#050811" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-white">64%</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {language === 'bn' ? 'স্বাভাবিক ক্রেতা' : 'Low Risk'}
              </span>
            </div>
          </div>

          {/* Tier Legend Labels */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
            {riskTiers.map((tier, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                  <span className="truncate max-w-[170px]">
                    {language === 'bn' ? tier.tierBn.split('(')[0] : tier.tier.split('(')[0]}
                  </span>
                </div>
                <span className="font-mono font-bold text-white">{tier.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Charts Row 2: Common COD Risk Factors & Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 3: Common COD Risk Factors Breakdown */}
        <div className="p-6 rounded-2xl bg-[#080d1f]/95 border border-cyan-500/20 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t('analytics.chart.riskFactorsTitle')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' 
                  ? 'ক্যাশ অন ডেলিভারিতে পার্সেল রিটার্নের প্রধান কারণ ও প্রতিরোধ পরামর্শ' 
                  : 'Highest reported return triggers and merchant mitigation strategies'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {riskFactors.map((factor, idx) => {
              const isSelected = selectedFactor?.factor === factor.factor;
              const severityColor = 
                factor.severity === 'high' ? 'border-red-500/40 bg-red-950/20 text-red-300' :
                factor.severity === 'moderate' ? 'border-amber-500/40 bg-amber-950/20 text-amber-300' :
                'border-cyan-500/40 bg-cyan-950/20 text-cyan-300';

              const barColor = 
                factor.severity === 'high' ? 'bg-red-500' :
                factor.severity === 'moderate' ? 'bg-amber-500' :
                'bg-cyan-400';

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedFactor(factor)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                      : 'border-slate-800 hover:border-slate-700 bg-[#060a17]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">
                      {language === 'bn' ? factor.factorBn : factor.factor}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {factor.percentage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full ${barColor}`} 
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>

                  {/* Expanded Recommendation View */}
                  {isSelected && (
                    <div className="pt-2 mt-2 border-t border-slate-800/80 text-[11px] text-cyan-200/90 flex items-start gap-2 animate-in fade-in">
                      <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-300">
                          {t('analytics.factor.advice')}:
                        </span>{' '}
                        {language === 'bn' ? factor.recommendationBn : factor.recommendationEn}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Historical Delivery Performance Trends (AreaChart) */}
        <div className="p-6 rounded-2xl bg-[#080d1f]/95 border border-cyan-500/20 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>{t('analytics.chart.trendTitle')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'bn' 
                    ? 'গত ৬ মাসের সার্বিক ডেলিভারি হার ও ঝুঁকি চিহ্নিতকরণের ধারাবাহিক ধারা' 
                    : '6-month rolling delivery success rate and high-risk incident monitoring'}
                </p>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trends.map((t) => ({
                    period: language === 'bn' ? t.periodBn : t.period,
                    'Delivery Success %': t.successRate,
                    'Return Rate %': t.returnRate,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#172554" vertical={false} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="Delivery Success %"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Return Rate %"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorReturn)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Snapshot Indicators */}
          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('analytics.chart.regionalTitle')}</span>
              </span>
              <span className="text-[10px] text-slate-400">8 Divisions</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {regionalStats.map((reg, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-[#060a17] border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 truncate">
                    {language === 'bn' ? reg.divisionBn : reg.division}
                  </div>
                  <div className="text-xs font-bold font-mono text-cyan-300 mt-0.5">
                    {reg.successRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Courier Transit SLA & Performance Table */}
      <div className="p-6 rounded-2xl bg-[#080d1f]/95 border border-cyan-500/20 shadow-xl backdrop-blur-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{language === 'bn' ? 'কুরিয়ারভিত্তিক পূর্ণাঙ্গ কর্মক্ষমতা ও ট্রানজিট সময়' : 'Comprehensive Courier Performance & Transit SLA Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn' 
                ? 'অনুমোদিত কুরিয়ার নেটওয়ার্কে পার্সেল ডেলিভারি সাফল্যের হার ও গড় ট্রানজিট সময়' 
                : 'Verified telemetry benchmarks across major delivery networks in Bangladesh'}
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 self-start sm:self-center">
            Updated: {new Date(analyticsData?.lastUpdated || Date.now()).toLocaleDateString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">{t('analytics.table.courierName')}</th>
                <th className="py-3 px-3 text-right">{t('analytics.table.delivered')}</th>
                <th className="py-3 px-3 text-right">{t('analytics.table.returned')}</th>
                <th className="py-3 px-3 text-right">{t('analytics.table.successRate')}</th>
                <th className="py-3 px-3 text-right">{t('analytics.table.dhakaSLA')}</th>
                <th className="py-3 px-3 text-right">{t('analytics.table.outsideSLA')}</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {courierStats.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{c.courier}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold">
                    {c.delivered.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 font-semibold">
                    {c.returned.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      {c.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {c.avgHoursDhaka} {t('analytics.hours')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {c.avgHoursOutside} {t('analytics.hours')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>{t('analytics.disclaimer')}</span>
        </div>
      </div>

    </div>
  );
};
