export type Language = 'bn' | 'en';

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
  deliveryRatio?: number;
  cancellationRatio?: number;
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

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: 'merchant' | 'admin';
  createdAt: string;
  savedSearches: Array<{
    id: string;
    phone: string;
    maskedPhone: string;
    timestamp: string;
    riskLevel: string;
    verifiedCouriers: number;
  }>;
}
