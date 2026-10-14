export type CourierProviderId = 'steadfast' | 'pathao' | 'redx' | 'paperfly' | 'ecourier';

export type CourierConnectionStatus = 
  | 'connected' 
  | 'configured' 
  | 'not_configured' 
  | 'temporarily_unavailable' 
  | 'auth_failed' 
  | 'phone_lookup_unsupported' 
  | 'tracking_only';

export type CourierResultStatus = 
  | 'verified_result' 
  | 'partial_result' 
  | 'unavailable' 
  | 'unsupported' 
  | 'no_record';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'insufficient_data';

export type OverallReportStatus = 
  | 'complete' 
  | 'partial_result' 
  | 'no_history_found' 
  | 'temporarily_unavailable' 
  | 'no_supported_lookup' 
  | 'invalid_input';

export interface CourierCapabilityDeclaration {
  id: CourierProviderId;
  name: string;
  supportsPhoneLookup: boolean;
  supportsOrderTracking: boolean;
  officialEndpointType: 'fraud_check_score' | 'consignment_tracking_only' | 'merchant_consignment';
  status: CourierConnectionStatus;
  statusLabelEn: string;
  statusLabelBn: string;
  descriptionEn: string;
  descriptionBn: string;
  lastCheckedTime?: string;
  requiredCredentials: string[];
  configuredCredentials: string[];
}

export interface NormalizedCourierResult {
  provider: CourierProviderId;
  name: string;
  status: CourierResultStatus;
  statusLabelEn: string;
  statusLabelBn: string;
  totalOrders?: number;
  deliveredCount?: number;
  cancelledCount?: number;
  returnedCount?: number;
  deliveryRatio?: number; // 0.0 - 1.0 (percentage)
  cancellationRatio?: number; // 0.0 - 1.0 (percentage)
  volumeBand?: string;
  volumeRange?: string;
  totalReports?: number;
  doubtfulReports?: boolean;
  fraudCategories?: Record<string, number>;
  scoringDisabled?: boolean;
  providerReportedScore?: number | null;
  internalRiskIndicator?: RiskLevel;
  dataSource: string;
  checkedAt: string;
  notesEn?: string;
  notesBn?: string;
  unsupportedReason?: string;
  rawSample?: Record<string, any>;
}

export interface RiskAnalysisSummary {
  level: RiskLevel;
  titleEn: string;
  titleBn: string;
  confidenceEn: string;
  confidenceBn: string;
  reasonsEn: string[];
  reasonsBn: string[];
  scoringFormulaExplanationEn: string;
  scoringFormulaExplanationBn: string;
  limitationsNoteEn: string;
  limitationsNoteBn: string;
}

export interface LookupReport {
  requestId: string;
  normalizedPhone: string;
  maskedPhone: string;
  timestamp: string;
  overallStatus: OverallReportStatus;
  statusLabelEn: string;
  statusLabelBn: string;
  totalProvidersChecked: number;
  verifiedProvidersCount: number;
  unavailableProvidersCount: number;
  unsupportedProvidersCount: number;
  riskSummary: RiskAnalysisSummary;
  providerResults: NormalizedCourierResult[];
  isSandboxMode: boolean;
  disclaimerEn: string;
  disclaimerBn: string;
}

export interface AdminSystemHealth {
  uptimeSeconds: number;
  serverTime: string;
  environment: 'development' | 'production';
  rateLimiter: {
    windowMinutes: number;
    maxRequestsPerWindow: number;
    activeTrackingIPs: number;
  };
  providers: CourierCapabilityDeclaration[];
  recentAuditLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    status: 'success' | 'warning' | 'error';
    details: string;
  }>;
}

export interface CourierPerformanceStat {
  courier: string;
  courierId: CourierProviderId;
  delivered: number;
  cancelled: number;
  returned: number;
  successRate: number;
  returnRate: number;
  avgHoursDhaka: number;
  avgHoursOutside: number;
  totalParcels: number;
}

export interface RiskFactorStat {
  factor: string;
  factorBn: string;
  percentage: number;
  count: number;
  severity: 'high' | 'moderate' | 'low';
  recommendationEn: string;
  recommendationBn: string;
}

export interface RiskTierStat {
  tier: string;
  tierBn: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HistoricalTrendStat {
  period: string;
  periodBn: string;
  successRate: number;
  returnRate: number;
  riskIncidents: number;
  totalLookups: number;
}

export interface RegionalPerformanceStat {
  division: string;
  divisionBn: string;
  successRate: number;
  returnRate: number;
  avgDeliveryDays: number;
}

export interface RiskAnalyticsData {
  timeframe: string;
  lastUpdated: string;
  summary: {
    totalLookupsEvaluated: number;
    avgDeliverySuccessRate: number;
    avgReturnCancellationRate: number;
    highRiskIncidentsFlagged: number;
    activeMonitoredCouriers: number;
    estimatedLossPreventedBDT: number;
  };
  courierPerformance: CourierPerformanceStat[];
  commonRiskFactors: RiskFactorStat[];
  riskTierDistribution: RiskTierStat[];
  historicalTrends: HistoricalTrendStat[];
  regionalPerformance: RegionalPerformanceStat[];
}
