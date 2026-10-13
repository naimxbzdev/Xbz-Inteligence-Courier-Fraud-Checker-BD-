import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-300 text-xs sm:text-sm leading-relaxed">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy & Data Governance Policy'}
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Last Updated: March 2026 · Jurisdiction: Bangladesh
        </p>
      </div>

      <div className="space-y-8">
        <section className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-md space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>১. তথ্যের গোপনীয়তা ও ফোন নম্বর মাস্কিং</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'XBZ Intelligence ব্যবহারকারীর ফোন নম্বরকে সংবেদনশীল ব্যক্তিগত তথ্য হিসেবে বিবেচনা করে। পাবলিক রিপোর্টে কখনো সম্পূর্ণ ফোন নম্বর প্রদর্শিত হয় না; এটি 01712-***456 আকারে মাস্ক করে রাখা হয়।'
              : 'XBZ Intelligence considers mobile phone numbers sensitive telemetry data. Public reports mask phone numbers by default (e.g. 01712-***456) to prevent unsolicited scraping.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-md space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-cyan-400" />
            <span>২. নন-ব্ল্যাকলিস্ট নীতি (Non-Blacklist Policy)</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'আমরা কোনো সাধারণ গ্রাহকের ব্যক্তিগত ব্ল্যাকলিস্ট সংরক্ষণ করি না। প্রাপ্ত তথ্য শুধুমাত্র অনুমোদিত কুরিয়ার এপিআই থেকে আনা ডেলিভারি হিস্ট্রির একটি পরিসংখ্যানগত নির্দেশক মাত্র।'
              : 'We strictly maintain a non-blacklist architecture. We do not construct a public directory of individuals or accuse consumers of malice.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-md space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>৩. সার্ভার-সাইড নিরাপত্তা ও সীমিত সংরক্ষণ</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'সার্ভারে কোনো ক্রেডেনশিয়াল বা গোপন তথ্য ব্রাউজারে পাঠানো হয় না। সকল কুরিয়ার এপিআই কল কঠোরভাবে সার্ভার-সাইডে সম্পন্ন হয় এবং মেমরিতে সাময়িকভাবে সুরক্ষিত থাকে।'
              : 'All API keys and credentials are strictly stored on the server. No secrets are leaked to client bundles, and access logs automatically redact sensitive phone details.'}
          </p>
        </section>
      </div>

    </div>
  );
};
