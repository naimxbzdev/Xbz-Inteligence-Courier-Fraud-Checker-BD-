import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#03060d] border-t border-cyan-500/15 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-extrabold text-cyan-300">
                X
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">
                  XBZ Intelligence
                </span>
                <span className="text-[10px] text-cyan-400 font-medium">
                  {t('brand.credit')} · {t('brand.tagline')}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {t('footer.description')}
            </p>

            <div className="text-[11px] text-slate-500 font-mono">
              Designed & Engineered for Bangladesh E-Commerce Logistics · Dhaka, Bangladesh
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('nav.features')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('couriers')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('nav.couriers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('documentation')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('nav.documentation')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Legal & Privacy
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {t('footer.terms')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-cyan-300 transition-colors font-mono"
                >
                  Admin Portal (Protected)
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Dynamic Year */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-500 text-[11px]">
            © {currentYear} XBZ Intelligence. {t('footer.rights')} Branded by Naim Xbz.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Powered by authorized courier telemetry</span>
            <span>·</span>
            <span className="text-cyan-400">Strictly Non-Blacklist Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
