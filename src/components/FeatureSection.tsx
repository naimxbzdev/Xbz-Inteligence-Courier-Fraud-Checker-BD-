import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  LockKeyhole,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const { language, t } = useLanguage();

  const cards = [
    {
      id: 1,
      title: t('features.card1.title'),
      desc: t('features.card1.desc'),
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      gradient: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/25',
      kicker: '01 · Instant Telemetry',
    },
    {
      id: 2,
      title: t('features.card2.title'),
      desc: t('features.card2.desc'),
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      gradient: 'from-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/25',
      kicker: '02 · Authorized Endpoints',
    },
    {
      id: 3,
      title: t('features.card3.title'),
      desc: t('features.card3.desc'),
      icon: <Smartphone className="w-6 h-6 text-sky-400" />,
      gradient: 'from-sky-500/10 to-transparent',
      borderColor: 'border-sky-500/25',
      kicker: '03 · Cross-Platform',
    },
    {
      id: 4,
      title: t('features.card4.title'),
      desc: t('features.card4.desc'),
      icon: <LockKeyhole className="w-6 h-6 text-teal-400" />,
      gradient: 'from-teal-500/10 to-transparent',
      borderColor: 'border-teal-500/25',
      kicker: '04 · Privacy First',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#050811] relative overflow-hidden border-b border-cyan-500/10">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('features.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {t('features.heading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {language === 'bn' 
              ? 'ক্যাশ-অন-ডেলিভারি রিটার্ন ঝুঁকি কমাতে অনুমোদিত কুরিয়ার ডেটার স্বচ্ছ সমন্বয়।'
              : 'Transparent courier intelligence engineered to minimize Return to Origin (RTO) friction.'}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-2xl bg-gradient-to-b ${c.gradient} via-[#090f23]/80 to-[#070c18] border ${c.borderColor} backdrop-blur-md shadow-lg group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,240,255,0.15)] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all">
                    {c.icon}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 tracking-wider">
                    {c.kicker}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                  {c.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="text-[11px] text-cyan-400/80">যাচাইকৃত মান</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
