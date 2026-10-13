import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Truck, CheckCircle2, XCircle, AlertTriangle, Key, ExternalLink, ShieldCheck } from 'lucide-react';

export const CouriersPage: React.FC = () => {
  const { language } = useLanguage();

  const couriers = [
    {
      id: 'steadfast',
      name: 'Steadfast Courier',
      phoneLookup: true,
      orderTracking: true,
      officialEndpoint: 'GET /fraud_check/score/{phone}',
      status: 'Configured / Ready (Key Dependent)',
      statusBn: 'সাপোর্টেড এন্ডপয়েন্ট বিদ্যমান',
      envKeys: ['STEADFAST_API_KEY', 'STEADFAST_SECRET_KEY', 'STEADFAST_API_BASE_URL'],
      notesEn: 'Steadfast officially exposes a dedicated phone-based fraud scoring endpoint. Handles scoring_disabled: true respectfully.',
      notesBn: 'স্টেডফাস্ট সরাসরি ফোন নম্বর ভিত্তিক ফ্রড চেক স্কোর এন্ডপয়েন্ট সাপোর্ট করে। scoring_disabled সক্রিয় থাকলে কোনো মনগড়া স্কোর তৈরি করা হয় না।',
    },
    {
      id: 'pathao',
      name: 'Pathao Courier',
      phoneLookup: false,
      orderTracking: true,
      officialEndpoint: 'POST /aladdin/api/v1/orders/{consignment_id}/info',
      status: 'Consignment Tracking Only',
      statusBn: 'শুধুমাত্র কনসাইনমেন্ট ট্র্যাকিং সমর্থিত',
      envKeys: ['PATHAO_CLIENT_ID', 'PATHAO_CLIENT_SECRET', 'PATHAO_USERNAME', 'PATHAO_PASSWORD'],
      notesEn: 'Official Hermes API requires specific consignment IDs. Open phone-number fraud intelligence is restricted to enterprise partner pilots.',
      notesBn: 'পাঠাও অফিসিয়াল হার্মিস এপিআই শুধুমাত্র অর্ডার ট্র্যাকিং আইডি দ্বারা তথ্য প্রদান করে। উন্মুক্ত ফোন সার্চ পাবলিক এপিআইতে নেই।',
    },
    {
      id: 'redx',
      name: 'REDX Courier',
      phoneLookup: false,
      orderTracking: true,
      officialEndpoint: 'GET /v1.0.0-beta/parcels/{tracking_id}',
      status: 'Parcel Tracking Only',
      statusBn: 'শুধুমাত্র পার্সেল ট্র্যাকিং সমর্থিত',
      envKeys: ['REDX_API_KEY', 'REDX_API_BASE_URL'],
      notesEn: 'REDX OpenAPI supports parcel tracking by tracking ID. Phone lookup is unsupported in standard public API.',
      notesBn: 'রেডএক্স ওপেন এপিআই ট্র্যাকিং আইডির মাধ্যমে পার্সেল ট্র্যাক করে। ফোন নম্বর ভিত্তিক ইতিহাস অনুসন্ধানের উন্মুক্ত সুযোগ নেই।',
    },
    {
      id: 'paperfly',
      name: 'Paperfly Courier',
      phoneLookup: false,
      orderTracking: true,
      officialEndpoint: 'POST /API-Order-Tracking',
      status: 'Reference-Based Tracking Only',
      statusBn: 'রেফারেন্স ট্র্যাকিং সমর্থিত',
      envKeys: ['PAPERFLY_USERNAME', 'PAPERFLY_PASSWORD', 'PAPERFLY_API_KEY'],
      notesEn: 'Paperfly API processes consignment tracking via merchant reference numbers. Phone-based intelligence is not documented.',
      notesBn: 'পেপারফ্লাই রেফারেন্স নম্বরের মাধ্যমে অর্ডার ট্র্যাক করে। ফোন নম্বর দিয়ে সামগ্রিক সার্চ এপিআইতে সমর্থিত নয়।',
    },
    {
      id: 'ecourier',
      name: 'eCourier',
      phoneLookup: false,
      orderTracking: true,
      officialEndpoint: 'GET /api/track/{airway_bill}',
      status: 'Airway Bill Tracking Only',
      statusBn: 'এয়ারওয়ে বিল ট্র্যাকিং সমর্থিত',
      envKeys: ['ECOURIER_API_KEY', 'ECOURIER_USER_ID', 'ECOURIER_API_BASE_URL'],
      notesEn: 'eCourier public backoffice endpoints support tracking specific airway bills or order IDs. Consumer phone profiling is unsupported.',
      notesBn: 'ই-কুরিয়ারে শুধুমাত্র ট্র্যাকিং বিল আইডির মাধ্যমে তথ্য পাওয়া যায়; সরাসরি ফোন নম্বর ভিত্তিক হিস্ট্রি এপিআইতে অনুমোদিত নয়।',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Truck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Courier Capability Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {language === 'bn' ? 'কুরিয়ার ইন্টিগ্রেশন ও এপিআই নির্দেশিকা' : 'Courier Integration & API Specifications'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {language === 'bn'
            ? 'XBZ Intelligence অনুমোদিত প্রোটোকল মেনে চলে। আমরা কোনো কুরিয়ারের অপ্রমাণিত ফিচার দাবি করি না কিংবা পার্সেল ট্র্যাকিংকে ফোন সার্চ হিসেবে ভুল উপস্থাপন করি না।'
            : 'XBZ Intelligence enforces honest capability reporting. We never fabricate phone lookup support when an API only supports parcel tracking.'}
        </p>
      </div>

      {/* Grid of Courier Profiles */}
      <div className="space-y-6">
        {couriers.map((c) => (
          <div
            key={c.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 backdrop-blur-md shadow-xl transition-all hover:border-cyan-400/40"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center font-bold text-lg text-cyan-300 shadow-md">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    ID: <span className="text-cyan-300">{c.id}</span> · Endpoint: <span className="text-slate-300">{c.officialEndpoint}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  c.phoneLookup 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  {c.phoneLookup 
                    ? (language === 'bn' ? 'ফোন সার্চ সমর্থিত' : 'Phone Lookup Supported') 
                    : (language === 'bn' ? 'ফোন সার্চ নেই (ট্র্যাকিং অনলি)' : 'Tracking Only')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-300">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-white block mb-1">
                    {language === 'bn' ? 'সক্ষমতা ও সীমাবদ্ধতার বিবরণ:' : 'Capability & Scope Analysis:'}
                  </span>
                  <p className="leading-relaxed text-slate-300">
                    {language === 'bn' ? c.notesBn : c.notesEn}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-semibold text-white block mb-1">
                    {language === 'bn' ? 'অফিসিয়াল রিকোয়ার্ড ক্রেডেনশিয়াল:' : 'Required Environment Variables:'}
                  </span>
                  <div className="font-mono text-cyan-300 space-y-0.5 text-[11px]">
                    {c.envKeys.map((k) => (
                      <div key={k}>• {k}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'bn' ? 'মার্চেন্ট ইন্টিগ্রেশন পলিসি' : 'Merchant Integration Policy'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-cyan-100/90">
                    {language === 'bn'
                      ? 'আপনি যদি এই কুরিয়ারের একজন নিবন্ধিত মার্চেন্ট হন, তাহলে আপনার অ্যাডমিন প্যানেলে নিরাপদভাবে আপনার নিজস্ব অনুমোদিত এপিআই কী যুক্ত করতে পারেন।'
                      : 'Registered merchants holding active commercial agreements can configure private API credentials in server secrets.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
