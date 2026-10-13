import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Cpu, Shield, AlertTriangle, CheckCircle, Terminal, HelpCircle } from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Technical Whitepaper & Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {language === 'bn' ? 'ডকুমেন্টেশন ও সিস্টেম আর্কিটেকচার' : 'Documentation & System Architecture'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {language === 'bn'
            ? 'XBZ Intelligence কীভাবে কাজ করে, কীভাবে ফোন নম্বর ফিল্টারিং ও রিস্ক অ্যানালাইসিস সম্পন্ন হয় এবং এর নিরাপত্তা নির্দেশিকা।'
            : 'Detailed guide on phone number normalization, transparent scoring models, adapter patterns, and compliance.'}
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1: Phone Normalization */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2>{language === 'bn' ? '১. ফোন নম্বর ভ্যালিডেশন ও নরমালাইজেশন' : '1. Phone Normalization & Privacy Masking'}</h2>
          </div>
          <p>
            {language === 'bn'
              ? 'সার্ভার-সাইডে প্রতিটি ইনপুট কঠোরভাবে স্যানিটাইজ করা হয়। বাংলাদেশের ১১ ডিজিটের মোবাইল নম্বর (যেমন: 013, 014, 015, 016, 017, 018, 019) ছাড়া অন্য কোনো ফরম্যাট গৃহীত হয় না। +880 বা স্পেস স্বয়ংক্রিয়ভাবে প্রমিত ফরম্যাটে রূপান্তর করা হয়।'
              : 'All user inputs are normalized server-side. Valid Bangladeshi mobile numbers must have exactly 11 digits starting with authorized prefixes (013 through 019). Non-compliant inputs are rejected prior to querying.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
            <div>// Normalization Example:</div>
            <div>Raw: "+880 1712-345678" ➔ Cleaned: "01712345678"</div>
            <div>Masked Representation: "01712-***678" (Preserves Consumer Privacy)</div>
          </div>
        </section>

        {/* Section 2: Mathematical Risk Formula */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2>{language === 'bn' ? '২. স্বচ্ছ রিস্ক অ্যানালাইসিস সূত্র (Scoring Formula)' : '2. Transparent Mathematical Risk Model'}</h2>
          </div>
          <p>
            {language === 'bn'
              ? 'আমরা কখনো অনুমানভিত্তিক কোনো ফ্রড স্কোর তৈরি করি না। প্রোভাইডারের প্রাপ্ত পরিসংখ্যানের ওপর ভিত্তি করে নিচের সূত্র অনুসরণ করা হয়:'
              : 'XBZ Intelligence never invents artificial scores. When providers disable scoring or return raw delivery numbers, the following formula applies:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold block">Low Risk (স্বাভাবিক)</span>
              <p className="text-slate-300">Delivery Rate &ge; 85% এবং ন্যূনতম ৩টি ঐতিহাসিক পার্সেল রেকর্ড।</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
              <span className="text-amber-400 font-bold block">Moderate Risk (মাঝারি)</span>
              <p className="text-slate-300">Delivery Rate 60%–84% অথবা Cancellation Rate 20%–39%।</p>
            </div>
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 space-y-1">
              <span className="text-red-400 font-bold block">High Review (উচ্চ সতর্কতা)</span>
              <p className="text-slate-300">Cancellation Rate &ge; 40% অথবা Delivery Rate &lt; 60%।</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">Insufficient Data: </span>
            {language === 'bn'
              ? 'যদি মোট অর্ডারের সংখ্যা ২টির কম হয়, তবে ঝুঁকি লেভেলকে "পর্যাপ্ত ডেটা নেই" হিসেবে দেখানো হয়।'
              : 'If total verifiable orders are less than 2, the status is Insufficient Data to prevent false profiling.'}
          </div>
        </section>

        {/* Section 3: Non-Blacklist Architecture */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2>{language === 'bn' ? '৩. নন-ব্ল্যাকলিস্ট এবং আইনি নীতি' : '3. Non-Blacklist Governance Policy'}</h2>
          </div>
          <p>
            {language === 'bn'
              ? 'কুরিয়ার ডেলিভারি ইতিহাস কেবল ক্যাশ অন ডেলিভারি ব্যবসায় ঝুঁকি মূল্যায়নের একটি পরিসংখ্যান মাত্র। কোনো অবস্থাতেই কোনো ক্রেতাকে "প্রতারক" বা ব্ল্যাকলিস্টেড হিসেবে তালিকাভুক্ত করা হয় না। গ্রাহকের ঠিকানা পরিবর্তন, শারীরিক অসুস্থতা বা জরুরি কারণে অর্ডার বাতিল হতে পারে।'
              : 'Delivery history is strictly a fulfillment advisory indicator for merchants, not proof that an individual is fraudulent. Orders may be returned due to merchant delay, defective goods, or emergencies.'}
          </p>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
            {language === 'bn'
              ? 'নীতিমালা: গণহারে ফোন নম্বর সংগ্রহ, ব্যক্তিগত প্রোফাইল ডিরেক্টরি তৈরি এবং পরিচয় প্রকাশ কঠোরভাবে নিষিদ্ধ।'
              : 'Policy: Bulk phone scraping, public blacklist publishing, and revealing consumer names or addresses is strictly prohibited.'}
          </div>
        </section>

      </div>
    </div>
  );
};
