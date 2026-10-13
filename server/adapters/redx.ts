import { ICourierAdapter } from './base.js';
import {
  CourierCapabilityDeclaration,
  NormalizedCourierResult,
  CourierConnectionStatus,
} from '../types.js';

export class RedxAdapter implements ICourierAdapter {
  id = 'redx' as const;
  name = 'REDX Courier';

  private baseUrl = process.env.REDX_API_BASE_URL || 'https://openapi.redx.com.bd';
  private apiKey = process.env.REDX_API_KEY || '';

  getDeclaration(): CourierCapabilityDeclaration {
    const isConfigured = Boolean(this.apiKey);
    return {
      id: this.id,
      name: this.name,
      supportsPhoneLookup: false, // Honest declaration per project instructions
      supportsOrderTracking: true,
      officialEndpointType: 'consignment_tracking_only',
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      statusLabelEn: 'Tracking Only (Phone Lookup Unsupported)',
      statusLabelBn: 'ট্র্যাকিং সমর্থিত (ফোন অনুসন্ধান অনুপলব্ধ)',
      descriptionEn: 'REDX OpenAPI supports parcel tracking by tracking ID (/v1.0.0-beta/parcels/{tracking_id}). Phone-number history is not an open API endpoint.',
      descriptionBn: 'রেডএক্স ওপেন এপিআই ট্র্যাকিং আইডির মাধ্যমে পার্সেল ট্র্যাক করে। সরাসরি ফোন নম্বর হিস্ট্রি ফিচার নেই।',
      lastCheckedTime: new Date().toISOString(),
      requiredCredentials: ['REDX_API_KEY'],
      configuredCredentials: [...(this.apiKey ? ['REDX_API_KEY'] : [])],
    };
  }

  async checkPhoneHistory(_phone: string): Promise<NormalizedCourierResult> {
    return {
      provider: this.id,
      name: this.name,
      status: 'unsupported',
      statusLabelEn: 'Phone Lookup Unsupported',
      statusLabelBn: 'ফোন হিস্ট্রি এপিআইতে অপ্রাপ্য',
      dataSource: 'REDX OpenAPI Documentation',
      checkedAt: new Date().toISOString(),
      unsupportedReason: 'REDX API documentation exposes parcel tracking by tracking ID only. It does not provide an endpoint to query aggregate customer history by phone.',
      notesEn: 'Phone-based history lookup is not offered by REDX standard OpenAPI.',
      notesBn: 'রেডএক্সের স্ট্যান্ডার্ড এপিআইতে ফোন নম্বর ভিত্তিক পূর্ববর্তী ডেলিভারি রেকর্ড চেক করার অপশন নেই।',
    };
  }

  async healthCheck(): Promise<{ connected: boolean; status: CourierConnectionStatus; message: string; latencyMs: number }> {
    const isConfigured = Boolean(this.apiKey);
    return {
      connected: isConfigured,
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      message: 'REDX adapter declared for parcel tracking. Phone lookup unsupported.',
      latencyMs: 15,
    };
  }
}
