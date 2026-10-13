import {
  CourierProviderId,
  CourierCapabilityDeclaration,
  NormalizedCourierResult,
  CourierConnectionStatus,
} from '../types.js';

export interface ICourierAdapter {
  id: CourierProviderId;
  name: string;
  getDeclaration(): CourierCapabilityDeclaration;
  checkPhoneHistory(phone: string, sandboxScenario?: string): Promise<NormalizedCourierResult>;
  trackOrder?(reference: string): Promise<any>;
  healthCheck(): Promise<{
    connected: boolean;
    status: CourierConnectionStatus;
    message: string;
    latencyMs: number;
  }>;
}
