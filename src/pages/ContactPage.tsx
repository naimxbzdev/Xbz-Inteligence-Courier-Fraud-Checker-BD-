import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, MapPin, Send, CheckCircle2, Building, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          {language === 'bn' ? 'যোগাযোগ ও মার্চেন্ট সাপোর্ট' : 'Contact & Merchant Support'}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {language === 'bn'
            ? 'কুরিয়ার ইন্টিগ্রেশন, কাস্টম এপিআই বা মার্চেন্ট অ্যাকাউন্ট সংক্রান্ত যেকোনো তথ্যে যোগাযোগ করুন।'
            : 'Get in touch for enterprise courier integrations, partnership inquiries, or merchant assistance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white mb-2">
              XBZ Intelligence HQ
            </h3>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Location</span>
                <span>Banani, Dhaka-1213, Bangladesh</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Direct Desk</span>
                <span className="font-mono text-cyan-300">naeem@webxpress.com.bd</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <Building className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Engineering & Brand</span>
                <span>XBZ Intelligence · Branded by Naim Xbz</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
            <span className="font-bold text-cyan-300 block mb-1">
              {language === 'bn' ? 'মার্চেন্ট ডেটা সুরক্ষা নোট' : 'Merchant Data Privacy'}
            </span>
            {language === 'bn'
              ? 'আপনার পাঠানো বার্তা ও ব্যবসায়িক তথ্য শুধুমাত্র অভ্যন্তরীণ পর্যালোচনার জন্য ব্যবহৃত হবে।'
              : 'Messages and inquiries submitted are handled in accordance with our strict data privacy standards.'}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {language === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {language === 'bn'
                    ? 'আমাদের টেকনিক্যাল সাপোর্ট টিম দ্রুত আপনার সাথে ইমেইলে যোগাযোগ করবে।'
                    : 'Our technical support team will follow up via your email shortly.'}
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  {language === 'bn' ? 'আরেকটি বার্তা লিখুন' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Naimul Hasan"
                    className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-white text-xs border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-white text-xs border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'ই-কমার্স প্রতিষ্ঠান (ঐচ্ছিক)' : 'Store Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    placeholder="Smart BD Shop"
                    className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-white text-xs border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'আপনার বার্তা' : 'Message'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার জিজ্ঞাসা লিখুন...' : 'Describe your inquiry...'}
                    className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-white text-xs border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
