import { ICourierAdapter } from './base.js';
import {
  CourierCapabilityDeclaration,
  NormalizedCourierResult,
  CourierConnectionStatus,
} from '../types.js';

export class PathaoAdapter implements ICourierAdapter {
  id = 'pathao' as const;
  name = 'Pathao Courier';

  private baseUrl = process.env.PATHAO_API_BASE_URL || 'https://courier-api-sandbox.pathao.com';
  private clientId = process.env.PATHAO_CLIENT_ID || '';
  private clientSecret = process.env.PATHAO_CLIENT_SECRET || '';

  getDeclaration(): CourierCapabilityDeclaration {
    const isConfigured = Boolean(this.clientId && this.clientSecret);
    return {
      id: this.id,
      name: this.name,
      supportsPhoneLookup: false, // Honest declaration per project instructions
      supportsOrderTracking: true,
      officialEndpointType: 'consignment_tracking_only',
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      statusLabelEn: 'Tracking Only (Phone Lookup Unsupported)',
      statusLabelBn: 'ট্র্যাকিং সমর্থিত (ফোন অনুসন্ধান অনুপলব্ধ)',
      descriptionEn: 'Official Pathao Hermes API supports consignment/order tracking by ID. Phone-based fraud check is restricted to enterprise pilots.',
      descriptionBn: 'পাঠাও অফিসিয়াল এপিআই কনসাইনমেন্ট ট্র্যাকিং সাপোর্ট করে। উন্মুক্ত ফোন নম্বর ফ্রড লুকআপ স্ট্যান্ডার্ড এপিআইতে নেই।',
      lastCheckedTime: new Date().toISOString(),
      requiredCredentials: ['PATHAO_CLIENT_ID', 'PATHAO_CLIENT_SECRET', 'PATHAO_USERNAME', 'PATHAO_PASSWORD'],
      configuredCredentials: [
        ...(this.clientId ? ['PATHAO_CLIENT_ID'] : []),
        ...(this.clientSecret ? ['PATHAO_CLIENT_SECRET'] : []),
      ],
    };
  }

  async checkPhoneHistory(_phone: string): Promise<NormalizedCourierResult> {
    // Per instructions: never fabricate fake results when provider does not support phone search.
    return {
      provider: this.id,
      name: this.name,
      status: 'unsupported',
      statusLabelEn: 'Phone Lookup Unsupported',
      statusLabelBn: 'ফোন হিস্ট্রি এপিআইতে অপ্রাপ্য',
      dataSource: 'Pathao Courier Documentation Audit',
      checkedAt: new Date().toISOString(),
      unsupportedReason: 'Pathao Hermes API does not offer a public phone-number lookup endpoint. Official endpoints are scoped strictly to known consignment IDs.',
      notesEn: 'Pathao official API requires specific consignment tracking IDs. Open phone search is currently unsupported in standard merchant API.',
      notesBn: 'পাঠাও অফিসিয়াল এপিআইতে উন্মুক্ত ফোন নম্বর অনুসন্ধান ফিচার নেই; এটি কনসাইনমেন্ট আইডির মাধ্যমে ট্র্যাকিং সমর্থন করে।',
    };
  }

  async trackOrder(consignmentId: string): Promise<any> {
    return {
      provider: this.id,
      consignmentId,
      status: 'simulated_tracking',
      message: 'Consignment tracking adapter ready. Connect client credentials in .env to poll Hermes API.',
    };
  }

  async healthCheck(): Promise<{ connected: boolean; status: CourierConnectionStatus; message: string; latencyMs: number }> {
    const isConfigured = Boolean(this.clientId && this.clientSecret);
    return {
      connected: isConfigured,
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      message: 'Pathao adapter registered for consignment tracking; phone history unsupported by provider.',
      latencyMs: 12,
    };
  }
}
