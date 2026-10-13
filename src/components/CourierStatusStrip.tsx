import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CourierCapabilityDeclaration } from '../types';
import { 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Radio, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

interface CourierStatusStripProps {
  onSelectCourier?: (courierId: string) => void;
}

export const CourierStatusStrip: React.FC<CourierStatusStripProps> = ({ onSelectCourier }) => {
  const { language, t } = useLanguage();
  const [providers, setProviders] = useState<CourierCapabilityDeclaration[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CourierCapabilityDeclaration | null>(null);

  useEffect(() => {
    fetch('/api/courier/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.providers) {
          setProviders(data.providers);
        }
      })
      .catch(() => {
        // Fallback default honest declarations if server call is pending
        setProviders([
          {
            id: 'steadfast',
            name: 'Steadfast',
            supportsPhoneLookup: true,
            supportsOrderTracking: true,
            officialEndpointType: 'fraud_check_score',
            status: 'not_configured',
            statusLabelEn: 'Not Configured (Requires Keys)',
            statusLabelBn: 'কনফিগার করা হয়নি',
            descriptionEn: 'Supports dedicated phone fraud check score endpoint (/fraud_check/score/{phone}).',
            descriptionBn: 'ফোন নম্বর ভিত্তিক ফ্রড চেক স্কোর এন্ডপয়েন্ট সমর্থন করে।',
            requiredCredentials: ['STEADFAST_API_KEY', 'STEADFAST_SECRET_KEY'],
            configuredCredentials: [],
          },
          {
            id: 'pathao',
            name: 'Pathao',
            supportsPhoneLookup: false,
            supportsOrderTracking: true,
            officialEndpointType: 'consignment_tracking_only',
            status: 'tracking_only',
            statusLabelEn: 'Tracking Only (Phone Lookup Unsupported)',
            statusLabelBn: 'ট্র্যাকিং সমর্থিত (ফোন সার্চ নেই)',
            descriptionEn: 'Hermes API supports consignment tracking. Open phone lookup is restricted to enterprise pilots.',
            descriptionBn: 'অফিসিয়াল এপিআই কনসাইনমেন্ট ট্র্যাকিং সমর্থন করে। সাধারণ ফোন সার্চ নেই।',
            requiredCredentials: ['PATHAO_CLIENT_ID', 'PATHAO_CLIENT_SECRET'],
            configuredCredentials: [],
          },
          {
            id: 'redx',
            name: 'REDX',
            supportsPhoneLookup: false,
            supportsOrderTracking: true,
            officialEndpointType: 'consignment_tracking_only',
            status: 'phone_lookup_unsupported',
            statusLabelEn: 'Phone Lookup Unsupported',
            statusLabelBn: 'ফোন সার্চ অনুপলব্ধ',
            descriptionEn: 'REDX OpenAPI supports parcel tracking by tracking ID.',
            descriptionBn: 'রেডএক্স এপিআই ট্র্যাকিং আইডির মাধ্যমে পার্সেল ট্র্যাক করে।',
            requiredCredentials: ['REDX_API_KEY'],
            configuredCredentials: [],
          },
          {
            id: 'paperfly',
            name: 'Paperfly',
            supportsPhoneLookup: false,
            supportsOrderTracking: true,
            officialEndpointType: 'merchant_consignment',
            status: 'phone_lookup_unsupported',
            statusLabelEn: 'Phone Lookup Unsupported',
            statusLabelBn: 'ফোন সার্চ অনুপলব্ধ',
            descriptionEn: 'Order tracking by reference number. Open phone search unsupported.',
            descriptionBn: 'রেফারেন্স নম্বরের মাধ্যমে ট্র্যাকিং। ফোন সার্চ অনুপলব্ধ।',
            requiredCredentials: ['PAPERFLY_USERNAME', 'PAPERFLY_PASSWORD'],
            configuredCredentials: [],
          },
          {
            id: 'ecourier',
            name: 'eCourier',
            supportsPhoneLookup: false,
            supportsOrderTracking: true,
            officialEndpointType: 'consignment_tracking_only',
            status: 'phone_lookup_unsupported',
            statusLabelEn: 'Phone Lookup Unsupported',
            statusLabelBn: 'ফোন সার্চ অনুপলব্ধ',
            descriptionEn: 'Consignment airway bill tracking only.',
            descriptionBn: 'কনসাইনমেন্ট এয়ারওয়ে বিল ট্র্যাকিং সমর্থিত।',
            requiredCredentials: ['ECOURIER_API_KEY', 'ECOURIER_USER_ID'],
            configuredCredentials: [],
          },
        ]);
      });
  }, []);

  const getStatusBadge = (status: string, supportsPhone: boolean) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>{t('status.connected')}</span>
          </span>
        );
      case 'configured':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>{t('status.configured')}</span>
          </span>
        );
      case 'tracking_only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950/70 text-blue-300 border border-blue-500/30">
            <Radio className="w-3 h-3 text-blue-400" />
            <span>{t('status.tracking_only')}</span>
          </span>
        );
      case 'phone_lookup_unsupported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>{t('status.phone_lookup_unsupported')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3 h-3" />
            <span>{t('status.not_configured')}</span>
          </span>
        );
    }
  };

  const getCourierColor = (id: string) => {
    switch (id) {
      case 'steadfast':
        return 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-400';
      case 'pathao':
        return 'from-red-500/10 to-orange-500/10 border-red-500/20 hover:border-red-400/50';
      case 'redx':
        return 'from-amber-500/10 to-yellow-500/10 border-amber-500/20 hover:border-amber-400/50';
      case 'paperfly':
        return 'from-sky-500/10 to-indigo-500/10 border-sky-500/20 hover:border-sky-400/50';
      case 'ecourier':
        return 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-400/50';
      default:
        return 'from-slate-800 to-slate-900 border-slate-800';
    }
  };

  return (
    <section className="py-8 bg-[#050811]/90 border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>{t('couriers.stripTitle')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('couriers.stripSubtitle')}
            </p>
          </div>
          <div className="text-[11px] text-cyan-400/80 font-mono flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Honest API Status & Capability Ledger</span>
          </div>
        </div>

        {/* 5 Courier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {providers.map((p) => {
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProvider(p)}
                className={`p-4 rounded-xl bg-gradient-to-b ${getCourierColor(p.id)} border backdrop-blur-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-white">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-white">{p.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>{getStatusBadge(p.status, p.supportsPhoneLookup)}</div>

                  <div className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {language === 'bn' ? p.descriptionBn : p.descriptionEn}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      {p.supportsPhoneLookup 
                        ? (language === 'bn' ? 'ফোন সার্চ: হ্যাঁ' : 'Phone Search: Yes') 
                        : (language === 'bn' ? 'ফোন সার্চ: নেই' : 'Phone Search: No')}
                    </span>
                    <span className="text-cyan-400 hover:underline">বিস্তারিত →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Provider Details Modal when clicked */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-[#090f23] border border-cyan-500/40 p-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedProvider(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-extrabold text-cyan-300">
                  {selectedProvider.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedProvider.name} Integration Audit</h3>
                  <div className="mt-1">{getStatusBadge(selectedProvider.status, selectedProvider.supportsPhoneLookup)}</div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-white mb-1">Official Capability Scope:</div>
                  <p>{language === 'bn' ? selectedProvider.descriptionBn : selectedProvider.descriptionEn}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-semibold text-white">Required Server Environment Credentials:</div>
                  <div className="font-mono text-cyan-300 space-y-0.5">
                    {selectedProvider.requiredCredentials.map((c) => (
                      <div key={c}>• {c}</div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-cyan-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>XBZ Compliance Guarantee:</span>
                  </div>
                  <p>
                    {language === 'bn'
                      ? 'XBZ Intelligence কখনো কোনো কুরিয়ারের অনিবন্ধিত বা অসত্য কানেকশন স্ট্যাটাস প্রদর্শন করে না। এপিআই অনুমতি ও ডকুমেন্টেশন ছাড়া অনুমানভিত্তিক ডেটা দেওয়া নিষিদ্ধ।'
                      : 'XBZ Intelligence never displays simulated connection statuses as active production links. Unauthorized scraping or unverified status reporting is strictly prohibited.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
