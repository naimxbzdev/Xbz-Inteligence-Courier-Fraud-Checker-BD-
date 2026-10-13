import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-300 text-xs sm:text-sm leading-relaxed">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          {language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service'}
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Platform: XBZ Intelligence · by Naim Xbz · Dhaka, Bangladesh
        </p>
      </div>

      <div className="space-y-8">
        <section className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-md space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>১. প্ল্যাটফর্ম ব্যবহারের উদ্দেশ্য</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'XBZ Intelligence শুধুমাত্র অনুমোদিত ই-কমার্স মার্চেন্ট ও গ্রাহকদের ক্যাশ-অন-ডেলিভারি পার্সেল ঝুঁকি বিশ্লেষণের জন্য ব্যবহৃত হতে হবে। এটি কোনো অপরাধমূলক নজরদারি বা অনুপযুক্ত নজরদারির জন্য ব্যবহার করা যাবে না।'
              : 'XBZ Intelligence is provided exclusively for merchant delivery fulfillment verification and risk assessment. Misuse for unauthorized harassment or stalking is strictly barred.'}
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-md space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>২. তথ্যের নির্ভুলতা ও দায়বদ্ধতা</span>
          </h2>
          <p>
            {language === 'bn'
              ? 'কুরিয়ার হিস্ট্রি রিপোর্ট সংশ্লিষ্ট কুরিয়ারের সিস্টেম ও অনুমোদিত এপিআই রেসপন্সের ওপর নির্ভরশীল। কোনো ব্যক্তি সম্পর্কে চূড়ান্ত সিদ্ধান্ত নেওয়ার ক্ষেত্রে মার্চেন্টদের নিজস্ব বিবেচনা প্রয়োগ করতে হবে।'
              : 'Delivery intelligence reports reflect the telemetry provided by third-party courier APIs. XBZ Intelligence does not warrant 100% historical completeness and acts as a decision support utility.'}
          </p>
        </section>
      </div>

    </div>
  );
};
