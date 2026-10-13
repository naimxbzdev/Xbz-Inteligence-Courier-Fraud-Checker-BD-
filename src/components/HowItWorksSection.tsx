import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  PhoneCall, 
  Server, 
  Cpu, 
  CheckSquare, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { language, t } = useLanguage();

  const steps = [
    {
      num: t('how.step1.num'),
      title: t('how.step1.title'),
      desc: t('how.step1.desc'),
      icon: <PhoneCall className="w-5 h-5 text-cyan-400" />,
    },
    {
      num: t('how.step2.num'),
      title: t('how.step2.title'),
      desc: t('how.step2.desc'),
      icon: <Server className="w-5 h-5 text-blue-400" />,
    },
    {
      num: t('how.step3.num'),
      title: t('how.step3.title'),
      desc: t('how.step3.desc'),
      icon: <Cpu className="w-5 h-5 text-sky-400" />,
    },
    {
      num: t('how.step4.num'),
      title: t('how.step4.title'),
      desc: t('how.step4.desc'),
      icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <section className="py-20 bg-[#070c18] relative overflow-hidden border-b border-cyan-500/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            {t('how.heading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('how.subtitle')}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              
              <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/15 hover:border-cyan-400/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg h-full flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-cyan-400/80 font-mono">
                  ধাপ {idx + 1} সম্পন্ন
                </div>

              </div>

              {/* Connecting arrow for desktop between steps */}
              {idx < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#050811] border border-cyan-500/30 items-center justify-center text-cyan-400 shadow-md">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
