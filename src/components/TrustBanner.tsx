import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, MapPin, Headphones, CheckCircle2 } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden border-b border-cyan-500/10">
      
      {/* Background Dhaka Cyber Skyline generated image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/dhaka_skyline_cyber_1791896744917.jpg"
          alt="Dhaka Bangladesh Logistics Skyline"
          className="w-full h-full object-cover opacity-20 filter brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/90 to-[#050811]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl p-8 sm:p-12 bg-[#090f23]/80 border border-cyan-500/25 backdrop-blur-xl shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bangladesh Delivery Network</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
                {t('banner.heading')}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {t('banner.desc')}
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-center">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mx-auto mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">
                  {t('banner.card1')}
                </div>
                <div className="text-[10px] text-slate-400">
                  Strictly Authorized
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-center">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300 mx-auto mb-2.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">
                  {t('banner.card2')}
                </div>
                <div className="text-[10px] text-slate-400">
                  National Coverage
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-center">
                <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-300 mx-auto mb-2.5">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-white mb-0.5">
                  {t('banner.card3')}
                </div>
                <div className="text-[10px] text-slate-400">
                  Merchant Guidance
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
