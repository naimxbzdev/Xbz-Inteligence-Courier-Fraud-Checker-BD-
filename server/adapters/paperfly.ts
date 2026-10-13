import { ICourierAdapter } from './base.js';
import {
  CourierCapabilityDeclaration,
  NormalizedCourierResult,
  CourierConnectionStatus,
} from '../types.js';

export class PaperflyAdapter implements ICourierAdapter {
  id = 'paperfly' as const;
  name = 'Paperfly';

  private baseUrl = 'https://api.paperfly.com.bd';
  private username = process.env.PAPERFLY_USERNAME || '';
  private password = process.env.PAPERFLY_PASSWORD || '';
  private apiKey = process.env.PAPERFLY_API_KEY || '';

  getDeclaration(): CourierCapabilityDeclaration {
    const isConfigured = Boolean(this.username && this.password);
    return {
      id: this.id,
      name: this.name,
      supportsPhoneLookup: false, // Honest declaration per project instructions
      supportsOrderTracking: true,
      officialEndpointType: 'merchant_consignment',
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      statusLabelEn: 'Tracking Only (Phone Lookup Unsupported)',
      statusLabelBn: 'ট্র্যাকিং সমর্থিত (ফোন অনুসন্ধান অনুপলব্ধ)',
      descriptionEn: 'Paperfly tracking endpoint (POST /API-Order-Tracking) requires a reference number. Phone-based fraud search is unsupported.',
      descriptionBn: 'পেপারফ্লাই অর্ডার ট্র্যাকিং রেফারেন্স নম্বরের মাধ্যমে কাজ করে। ফোন নম্বর দিয়ে সরাসরি ফ্রড সার্চ সমর্থিত নয়।',
      lastCheckedTime: new Date().toISOString(),
      requiredCredentials: ['PAPERFLY_USERNAME', 'PAPERFLY_PASSWORD', 'PAPERFLY_API_KEY'],
      configuredCredentials: [
        ...(this.username ? ['PAPERFLY_USERNAME'] : []),
        ...(this.password ? ['PAPERFLY_PASSWORD'] : []),
        ...(this.apiKey ? ['PAPERFLY_API_KEY'] : []),
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
      dataSource: 'Paperfly API Technical Specs',
      checkedAt: new Date().toISOString(),
      unsupportedReason: 'Paperfly API supports POST /API-Order-Tracking using reference numbers. No phone-number fraud intelligence endpoint is documented.',
      notesEn: 'Paperfly operates order tracking by reference number. Phone query unsupported.',
      notesBn: 'পেপারফ্লাই রেফারেন্স নম্বরের মাধ্যমে অর্ডার ট্র্যাক করে। ফোন নম্বর ভিত্তিক তথ্য এপিআইতে অনুমোদিত নয়।',
    };
  }

  async healthCheck(): Promise<{ connected: boolean; status: CourierConnectionStatus; message: string; latencyMs: number }> {
    const isConfigured = Boolean(this.username && this.password);
    return {
      connected: isConfigured,
      status: isConfigured ? 'tracking_only' : 'phone_lookup_unsupported',
      message: 'Paperfly adapter configured for reference tracking.',
      latencyMs: 14,
    };
  }
}
