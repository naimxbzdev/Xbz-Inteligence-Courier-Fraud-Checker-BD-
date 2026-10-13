import {
  LookupReport,
  NormalizedCourierResult,
  RiskAnalysisSummary,
  RiskLevel,
  OverallReportStatus,
  CourierCapabilityDeclaration,
} from './types.js';
import { ICourierAdapter } from './adapters/base.js';
import { SteadfastAdapter } from './adapters/steadfast.js';
import { PathaoAdapter } from './adapters/pathao.js';
import { RedxAdapter } from './adapters/redx.js';
import { PaperflyAdapter } from './adapters/paperfly.js';
import { EcourierAdapter } from './adapters/ecourier.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class CourierOrchestrator {
  private adapters: Map<string, ICourierAdapter> = new Map();
  private ipRateLimits: Map<string, RateLimitRecord> = new Map();
  private auditLogs: Array<{
    id: string;
    timestamp: string;
    action: string;
    status: 'success' | 'warning' | 'error';
    details: string;
  }> = [];

  constructor() {
    this.registerAdapter(new SteadfastAdapter());
    this.registerAdapter(new PathaoAdapter());
    this.registerAdapter(new RedxAdapter());
    this.registerAdapter(new PaperflyAdapter());
    this.registerAdapter(new EcourierAdapter());

    this.logAudit('System Startup', 'success', 'Courier Orchestrator initialized with 5 provider adapters.');
  }

  private registerAdapter(adapter: ICourierAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  public getCapabilities(): CourierCapabilityDeclaration[] {
    return Array.from(this.adapters.values()).map((adapter) => adapter.getDeclaration());
  }

  public getAuditLogs() {
    return this.auditLogs.slice(0, 50);
  }

  public logAudit(action: string, status: 'success' | 'warning' | 'error', details: string) {
    this.auditLogs.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      action,
      status,
      details,
    });
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  /**
   * Validates and normalizes Bangladesh mobile phone numbers.
   * Accepts: +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX, with optional spaces/dashes.
   * Returns { valid: boolean, normalized?: string, masked?: string, error?: string }
   */
  public normalizeBangladeshPhone(input: string): {
    valid: boolean;
    normalized?: string;
    masked?: string;
    errorEn?: string;
    errorBn?: string;
  } {
    if (!input || typeof input !== 'string') {
      return {
        valid: false,
        errorEn: 'Phone number is required.',
        errorBn: 'ফোন নম্বর প্রদান করা আবশ্যক।',
      };
    }

    // Convert Bangla numerals (০-৯) to standard ASCII digits (0-9)
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let cleaned = input.replace(/[০-৯]/g, (d) => String(banglaDigits.indexOf(d)));

    // Clean whitespace and common separators
    cleaned = cleaned.replace(/[\s\-\(\)\.]/g, '');

    // Handle country code prefixes
    if (cleaned.startsWith('+880')) {
      cleaned = '0' + cleaned.slice(4);
    } else if (cleaned.startsWith('880')) {
      cleaned = '0' + cleaned.slice(3);
    } else if (!cleaned.startsWith('0') && cleaned.length === 10 && /^[1-9]/.test(cleaned)) {
      cleaned = '0' + cleaned;
    }

    // Validate 11-digit Bangladesh phone starting with valid operator prefixes (013 - 019)
    const bdRegex = /^01[3-9]\d{8}$/;
    if (!bdRegex.test(cleaned)) {
      return {
        valid: false,
        errorEn: 'Invalid Bangladesh phone format. Please enter an 11-digit number starting with 013-019 (e.g. 017XXXXXXXX).',
        errorBn: 'সঠিক বাংলাদেশি ফোন নম্বর দিন। নম্বরটি ১১ ডিজিটের এবং ০১-দিয়ে শুরু হতে হবে (যেমন: 017XXXXXXXX)।',
      };
    }

    // Create privacy-conscious masked representation (e.g., 01712-***456)
    const masked = `${cleaned.slice(0, 5)}-***${cleaned.slice(8)}`;

    return {
      valid: true,
      normalized: cleaned,
      masked,
    };
  }

  /**
   * In-memory sliding rate limiting by IP address.
   */
  public checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetSeconds: number } {
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const maxRequests = 25; // 25 queries per 5 minutes per IP

    let record = this.ipRateLimits.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      this.ipRateLimits.set(ip, record);
      return { allowed: true, remaining: maxRequests - 1, resetSeconds: Math.ceil(windowMs / 1000) };
    }

    if (record.count >= maxRequests) {
      const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, resetSeconds };
    }

    record.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  public getRateLimiterStats() {
    return {
      windowMinutes: 5,
      maxRequestsPerWindow: 25,
      activeTrackingIPs: this.ipRateLimits.size,
    };
  }

  /**
   * Coordinates courier search across all adapters concurrently with bounded timeouts.
   */
  public async executeLookup(
    rawPhone: string,
    ip: string,
    options?: { sandboxScenario?: string; forceLive?: boolean }
  ): Promise<LookupReport> {
    const phoneNorm = this.normalizeBangladeshPhone(rawPhone);
    if (!phoneNorm.valid || !phoneNorm.normalized || !phoneNorm.masked) {
      throw new Error(phoneNorm.errorEn || 'Invalid phone number format');
    }

    const { normalized, masked } = phoneNorm;

    // Check rate limit
    const rateCheck = this.checkRateLimit(ip);
    if (!rateCheck.allowed) {
      this.logAudit('Rate Limit Exceeded', 'warning', `IP ${ip} exceeded lookup rate limit.`);
      const err = new Error(`Rate limit exceeded. Please wait ${rateCheck.resetSeconds} seconds before trying again.`);
      (err as any).statusCode = 429;
      throw err;
    }

    const requestId = `xbz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    // Query all registered adapters in parallel
    const adapterList = Array.from(this.adapters.values());
    const promises = adapterList.map(async (adapter) => {
      try {
        const timeoutPromise = new Promise<NormalizedCourierResult>((_, reject) =>
          setTimeout(() => reject(new Error('Provider lookup timeout')), 5500)
        );
        return await Promise.race([
          adapter.checkPhoneHistory(normalized, options?.sandboxScenario),
          timeoutPromise,
        ]);
      } catch (err: any) {
        return {
          provider: adapter.id,
          name: adapter.name,
          status: 'unavailable' as const,
          statusLabelEn: 'Provider Unavailable',
          statusLabelBn: 'প্রোভাইডার সংযোগ ব্যর্থ',
          dataSource: `${adapter.name} API`,
          checkedAt: nowIso,
          unsupportedReason: err.message || 'Timeout / Network Error',
        };
      }
    });

    const settledResults = await Promise.allSettled(promises);
    const providerResults: NormalizedCourierResult[] = settledResults.map((res, index) => {
      if (res.status === 'fulfilled') {
        return res.value;
      }
      const adapter = adapterList[index];
      return {
        provider: adapter.id,
        name: adapter.name,
        status: 'unavailable',
        statusLabelEn: 'Provider Error',
        statusLabelBn: 'প্রোভাইডার ত্রুটি',
        dataSource: `${adapter.name} Gateway`,
        checkedAt: nowIso,
        unsupportedReason: res.reason?.message || 'Unknown network error',
      };
    });

    // Compute metrics
    const totalProvidersChecked = providerResults.length;
    const verifiedResults = providerResults.filter((r) => r.status === 'verified_result');
    const verifiedProvidersCount = verifiedResults.length;
    const unavailableProvidersCount = providerResults.filter((r) => r.status === 'unavailable').length;
    const unsupportedProvidersCount = providerResults.filter((r) => r.status === 'unsupported').length;

    // Overall status computation
    let overallStatus: OverallReportStatus = 'complete';
    let statusLabelEn = 'Complete Report';
    let statusLabelBn = 'সম্পূর্ণ রিপোর্ট';

    if (unavailableProvidersCount > 0 && verifiedProvidersCount > 0) {
      overallStatus = 'partial_result';
      statusLabelEn = 'Partial Result (Some providers unavailable)';
      statusLabelBn = 'আংশিক ফলাফল (কিছু প্রোভাইডার অনুপলব্ধ)';
    } else if (verifiedProvidersCount === 0) {
      const hasNoRecords = providerResults.some((r) => r.status === 'no_record');
      if (hasNoRecords) {
        overallStatus = 'no_history_found';
        statusLabelEn = 'No Verified History Found';
        statusLabelBn = 'কোনো যাচাইকৃত হিস্ট্রি পাওয়া যায়নি';
      } else if (unavailableProvidersCount === totalProvidersChecked) {
        overallStatus = 'temporarily_unavailable';
        statusLabelEn = 'All Providers Temporarily Unavailable';
        statusLabelBn = 'সকল প্রোভাইডার সাময়িকভাবে অনুপলব্ধ';
      } else {
        overallStatus = 'no_supported_lookup';
        statusLabelEn = 'Phone Lookup Unsupported by Configured Couriers';
        statusLabelBn = 'সংযুক্ত কুরিয়ার সমূহে ফোন সার্চ সমর্থিত নয়';
      }
    }

    // Risk analysis computation
    const riskSummary = this.computeRiskAnalysis(verifiedResults);

    this.logAudit(
      'Phone History Query',
      'success',
      `Checked ${masked} across ${totalProvidersChecked} providers. Status: ${overallStatus}, Risk: ${riskSummary.level}`
    );

    return {
      requestId,
      normalizedPhone: normalized,
      maskedPhone: masked,
      timestamp: nowIso,
      overallStatus,
      statusLabelEn,
      statusLabelBn,
      totalProvidersChecked,
      verifiedProvidersCount,
      unavailableProvidersCount,
      unsupportedProvidersCount,
      riskSummary,
      providerResults,
      isSandboxMode: Boolean(options?.sandboxScenario || !process.env.STEADFAST_API_KEY),
      disclaimerEn:
        'This intelligence report is generated from available authorized courier data sources. A delivery indicator alone does not prove that an individual is fraudulent. Records may be incomplete or historical.',
      disclaimerBn:
        'এই রিপোর্ট অনুমোদিত উৎস থেকে পাওয়া উপলভ্য ডেলিভারি তথ্যের ভিত্তিতে তৈরি। কোনো ফলাফল একা কাউকে প্রতারক প্রমাণ করে না। তথ্য অসম্পূর্ণ বা পুরোনো হতে পারে।',
    };
  }

  /**
   * Transparent, documented mathematical risk assessment formula.
   */
  private computeRiskAnalysis(verifiedResults: NormalizedCourierResult[]): RiskAnalysisSummary {
    const scoringFormulaExplanationEn =
      'Formula: Delivery Rate = (Delivered Orders / Total Orders) * 100%. Low Risk: >= 85% delivery success. Moderate Risk: 60%-84% delivery or 20%-39% cancellation. High Review Recommended: < 60% delivery, >= 40% cancellation, or >= 2 merchant incident reports. Insufficient Data: No historical records found.';
    const scoringFormulaExplanationBn =
      'সূত্র: ডেলিভারি হার = (সফল ডেলিভারি / মোট অর্ডার) * ১০০%। কম ঝুঁকি: >= ৮৫% ডেলিভারি। মাঝারি ঝুঁকি: ৬০%-৮৪% ডেলিভারি বা ২০%-৩৯% ক্যানসেলেশন। উচ্চ সতর্কতা: < ৬০% ডেলিভারি, >= ৪০% ক্যানসেলেশন অথবা >= ২ মার্চেন্ট রিপোর্ট। পর্যাপ্ত ডেটা নেই: কোনো পূর্ববর্তী কুরিয়ার রেকর্ড না থাকলে।';

    const limitationsNoteEn =
      'Notice: Delivery history serves as a review indicator for cash-on-delivery risk management, not a definitive judgement of personal integrity.';
    const limitationsNoteBn =
      'সতর্কবার্তা: ডেলিভারি হিস্ট্রি ক্যাশ-অন-ডেলিভারি ঝুঁকি পর্যালোচনার একটি নির্দেশক মাত্র; এটি কোনো ব্যক্তির সামগ্রিক সততার চূড়ান্ত প্রমাণ নয়।';

    if (verifiedResults.length === 0) {
      return {
        level: 'insufficient_data',
        titleEn: 'No Verified Records Found / New Customer Indicator',
        titleBn: 'কোনো যাচাইকৃত রেকর্ড নেই / নতুন গ্রাহক নির্দেশক',
        confidenceEn: 'Low (No records across supported couriers)',
        confidenceBn: 'কম (যাচাইকৃত কুরিয়ারসমূহে কোনো রেকর্ড পাওয়া যায়নি)',
        reasonsEn: [
          'No order or delivery records found for this phone number across verified couriers.',
          'This phone number may belong to a new customer or someone who has not ordered through supported courier networks.',
        ],
        reasonsBn: [
          'যাচাইকৃত কুরিয়ারসমূহে এই ফোন নম্বরের কোনো ডেলিভারি ইতিহাস বা রিপোর্ট পাওয়া যায়নি।',
          'গ্রাহকটি নতুন ই-কমার্স ক্রেতা হতে পারেন অথবা সংযুক্ত কুরিয়ারের মাধ্যমে পার্সেল গ্রহণ করেননি।',
        ],
        scoringFormulaExplanationEn,
        scoringFormulaExplanationBn,
        limitationsNoteEn,
        limitationsNoteBn,
      };
    }

    let aggregateDelivered = 0;
    let aggregateCancelled = 0;
    let aggregateTotal = 0;
    let hasCountData = false;

    let aggregateDeliveryRatio: number | null = null;
    let aggregateCancellationRatio: number | null = null;
    let totalIncidentReports = 0;
    let volumeBandDesc: string | null = null;

    for (const res of verifiedResults) {
      if (res.deliveredCount !== undefined && res.cancelledCount !== undefined) {
        aggregateDelivered += res.deliveredCount;
        aggregateCancelled += res.cancelledCount;
        aggregateTotal += (res.totalOrders || (res.deliveredCount + res.cancelledCount));
        hasCountData = true;
      }
      if (res.deliveryRatio !== undefined) aggregateDeliveryRatio = res.deliveryRatio;
      if (res.cancellationRatio !== undefined) aggregateCancellationRatio = res.cancellationRatio;
      if (res.totalReports !== undefined) totalIncidentReports += res.totalReports;
      if (res.volumeRange || res.volumeBand) volumeBandDesc = res.volumeRange || res.volumeBand || null;
    }

    const reasonsEn: string[] = [];
    const reasonsBn: string[] = [];

    // Use ratio directly if counts are not explicitly broken down
    const deliveryRatio = hasCountData && aggregateTotal > 0 ? (aggregateDelivered / aggregateTotal) : (aggregateDeliveryRatio ?? 0);
    const cancellationRatio = hasCountData && aggregateTotal > 0 ? (aggregateCancelled / aggregateTotal) : (aggregateCancellationRatio ?? 0);

    const deliveryPercent = Math.round(deliveryRatio * 100);
    const cancellationPercent = Math.round(cancellationRatio * 100);

    if (aggregateDeliveryRatio !== null) {
      reasonsEn.push(`Verified courier delivery success rate is ${deliveryPercent}%.`);
      reasonsBn.push(`কুরিয়ার নেটওয়ার্কে ডেলিভারি সাফল্যের হার ${deliveryPercent}%।`);
    }

    if (aggregateCancellationRatio !== null) {
      reasonsEn.push(`Recorded cancellation & return rate is ${cancellationPercent}%.`);
      reasonsBn.push(`ক্যানসেলেশন ও পার্সেল ফেরত আসার হার ${cancellationPercent}%।`);
    }

    if (totalIncidentReports > 0) {
      reasonsEn.push(`${totalIncidentReports} merchant fraud/incident report(s) logged by online retailers.`);
      reasonsBn.push(`অনলাইন মার্চেন্টদের দায়ের করা মোট ${totalIncidentReports}টি ফ্রড/অর্ডার ক্যানসেলেশন রিপোর্ট পাওয়া গেছে।`);
    }

    if (volumeBandDesc && volumeBandDesc !== 'none') {
      reasonsEn.push(`Parcel shipment volume band: ${volumeBandDesc}.`);
      reasonsBn.push(`ঐতিহাসিক পার্সেল ভলিউম: ${volumeBandDesc}।`);
    }

    // High Risk Decision
    if (
      totalIncidentReports >= 2 ||
      (aggregateCancellationRatio !== null && cancellationRatio >= 0.4) ||
      (aggregateDeliveryRatio !== null && deliveryRatio < 0.6)
    ) {
      reasonsEn.push('Merchant recommendation: Request advance delivery fee (e.g. 100-200 BDT) and confirm order via direct call before fulfillment.');
      reasonsBn.push('মার্চেন্টদের জন্য পরামর্শ: ক্যাশ অন ডেলিভারিতে পণ্য প্রেরণের পূর্বে কুরিয়ার চার্জ অগ্রিম গ্রহণ করুন এবং ফোনে অর্ডার নিশ্চিত করুন।');

      return {
        level: 'high',
        titleEn: 'High Review Recommended (High Cancellation / Risk History)',
        titleBn: 'উচ্চ সতর্কতা প্রয়োজন (অতিরিক্ত ক্যানসেলেশন বা রিপোর্ট রেকর্ড)',
        confidenceEn: 'High (Backed by verified courier telemetry)',
        confidenceBn: 'উচ্চ (যাচাইকৃত কুরিয়ার নেটওয়ার্ক পরিসংখ্যানের ভিত্তিতে)',
        reasonsEn,
        reasonsBn,
        scoringFormulaExplanationEn,
        scoringFormulaExplanationBn,
        limitationsNoteEn,
        limitationsNoteBn,
      };
    }

    // Moderate Risk Decision
    if (
      totalIncidentReports === 1 ||
      (aggregateCancellationRatio !== null && cancellationRatio >= 0.2) ||
      (aggregateDeliveryRatio !== null && deliveryRatio < 0.85)
    ) {
      reasonsEn.push('Merchant recommendation: Standard order verification is advisable before dispatching.');
      reasonsBn.push('মার্চেন্টদের জন্য পরামর্শ: স্বাভাবিক যাচাইকরণ সম্পন্ন করে অর্ডার প্রসেস করুন।');

      return {
        level: 'moderate',
        titleEn: 'Moderate Risk Indicator',
        titleBn: 'মাঝারি ঝুঁকি নির্দেশক',
        confidenceEn: 'Medium',
        confidenceBn: 'মাঝারি',
        reasonsEn,
        reasonsBn,
        scoringFormulaExplanationEn,
        scoringFormulaExplanationBn,
        limitationsNoteEn,
        limitationsNoteBn,
      };
    }

    // Low Risk Decision
    if (aggregateDeliveryRatio !== null && deliveryRatio >= 0.85) {
      reasonsEn.push('Merchant recommendation: Favorable candidate for standard Cash-on-Delivery fulfillment.');
      reasonsBn.push('মার্চেন্টদের জন্য পরামর্শ: ক্যাশ অন ডেলিভারিতে পণ্য প্রেরণের জন্য অনুকূল বিশ্বস্ত ক্রেতা।');

      return {
        level: 'low',
        titleEn: 'Low Risk Indicator (High Delivery Success)',
        titleBn: 'স্বাভাবিক / কম ঝুঁকি নির্দেশক (উচ্চ ডেলিভারি সাফল্য)',
        confidenceEn: 'High',
        confidenceBn: 'উচ্চ',
        reasonsEn,
        reasonsBn,
        scoringFormulaExplanationEn,
        scoringFormulaExplanationBn,
        limitationsNoteEn,
        limitationsNoteBn,
      };
    }

    return {
      level: 'insufficient_data',
      titleEn: 'Insufficient Historical Data',
      titleBn: 'পর্যাপ্ত ডেটা নেই',
      confidenceEn: 'Low',
      confidenceBn: 'কম',
      reasonsEn: reasonsEn.length ? reasonsEn : ['Insufficient transaction records to compute pattern.'],
      reasonsBn: reasonsBn.length ? reasonsBn : ['পরিসংখ্যানগত ঝুঁকি নির্ধারণের জন্য পর্যাপ্ত তথ্য পাওয়া যায়নি।'],
      scoringFormulaExplanationEn,
      scoringFormulaExplanationBn,
      limitationsNoteEn,
      limitationsNoteBn,
    };
  }
}
