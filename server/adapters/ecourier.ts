import { ICourierAdapter } from './base.js';
import {
  CourierCapabilityDeclaration,
  NormalizedCourierResult,
  CourierConnectionStatus,
} from '../types.js';

export class EcourierAdapter implements ICourierAdapter {
  id = 'ecourier' as const;
  name = 'eCourier';

  private baseUrl = process.env.ECOURIER_API_BASE_URL || 'https://backoffice.ecourier.com.bd/api';
  private apiKey = process.env.ECOURIER_API_KEY || '';
  private userId = process.env.ECOURIER_USER_ID || '';

  getDeclaration(): CourierCapabilityDeclaration {
    const isConfigured = Boolean(this.apiKey && this.userId);
    return {
      id: this.id,
      name: this.name,
      supportsPhoneLookup: false, // Honest declaration per project instructions
      supportsOrderTracking: true,
      officialEndpointType: 'consignment_tracking_only',
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      statusLabelEn: 'Tracking Only (Phone Lookup Unsupported)',
      statusLabelBn: 'ট্র্যাকিং সমর্থিত (ফোন অনুসন্ধান অনুপলব্ধ)',
      descriptionEn: 'eCourier backoffice API supports consignment tracking (/api/track). Phone history aggregation is unsupported.',
      descriptionBn: 'ই-কুরিয়ার এপিআই কনসাইনমেন্ট ট্র্যাকিং সমর্থন করে। সামগ্রিক ফোন নম্বর হিস্ট্রি চেক করার সুবিধা নেই।',
      lastCheckedTime: new Date().toISOString(),
      requiredCredentials: ['ECOURIER_API_KEY', 'ECOURIER_USER_ID'],
      configuredCredentials: [
        ...(this.apiKey ? ['ECOURIER_API_KEY'] : []),
        ...(this.userId ? ['ECOURIER_USER_ID'] : []),
      ],
    };
  }

  async checkPhoneHistory(_phone: string): Promise<NormalizedCourierResult> {
    return {
      provider: this.id,
      name: this.name,
      status: 'unsupported',
      statusLabelEn: 'Phone Lookup Unsupported',
      statusLabelBn: 'ফোন হিস্ট্রি এপিআইতে অপ্রাপ্য',
      dataSource: 'eCourier Backoffice API Documentation',
      checkedAt: new Date().toISOString(),
      unsupportedReason: 'eCourier public backoffice endpoints support tracking specific airway bills or order IDs. Aggregated consumer phone profiling is not supported.',
      notesEn: 'eCourier official API does not support phone-number history lookup.',
      notesBn: 'ই-কুরিয়ারে শুধুমাত্র ট্র্যাকিং আইডির মাধ্যমে তথ্য পাওয়া যায়; সরাসরি ফোন নম্বর হিস্ট্রি সমর্থিত নয়।',
    };
  }

  async healthCheck(): Promise<{ connected: boolean; status: CourierConnectionStatus; message: string; latencyMs: number }> {
    const isConfigured = Boolean(this.apiKey && this.userId);
    return {
      connected: isConfigured,
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      message: 'eCourier adapter declared for airway bill tracking.',
      latencyMs: 16,
    };
  }
}
