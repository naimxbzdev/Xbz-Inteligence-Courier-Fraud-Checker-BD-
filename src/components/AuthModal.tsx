import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, Building, User, Key, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          onSuccess();
          onClose();
        } else {
          setError(
            language === 'bn' 
              ? 'ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।' 
              : 'Invalid email or password. Please try again.'
          );
        }
      } else {
        if (!name || !businessName) {
          setError(
            language === 'bn'
              ? 'সকল প্রয়োজনীয় তথ্য পূরণ করুন।'
              : 'Please fill in all required fields.'
          );
          setIsLoading(false);
          return;
        }
        const ok = await register(email, password, name, businessName);
        if (ok) {
          onSuccess();
          onClose();
        } else {
          setError(
            language === 'bn'
              ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। ইমেইলটি ইতোমধ্যে নিবন্ধিত হতে পারে।'
              : 'Registration failed. Email may already be in use.'
          );
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('merchant@xbz.intelligence');
    setPassword('merchant123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#090f23] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' 
              ? (language === 'bn' ? 'মার্চেন্ট অ্যাকাউন্টে লগইন' : 'Merchant Login')
              : (language === 'bn' ? 'নতুন মার্চেন্ট সাইন আপ' : 'Merchant Sign Up')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? (language === 'bn' ? 'সংরক্ষিত সার্চ ইতিহাস ও মার্চেন্ট টুলস অ্যাক্সেস করুন' : 'Access saved searches and merchant delivery tools')
              : (language === 'bn' ? 'কুরিয়ার ইন্টেলিজেন্স প্ল্যাটফর্মে বিনামূল্যে অ্যাকাউন্ট তৈরি করুন' : 'Create a merchant account to manage delivery risk')}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'লগইন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'সাইন আপ' : 'Create Account'}
          </button>
        </div>

        {/* Quick Demo Credentials Autofill */}
        {mode === 'login' && (
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full mb-4 py-2 px-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-950/70 transition-all flex items-center justify-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>ডেমো ক্রেডেনশিয়াল ব্যবহার করুন (Fill Demo Merchant)</span>
          </button>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                </label>
                <div className="flex items-center bg-slate-950 rounded-lg px-3 border border-slate-800 focus-within:border-cyan-500/50">
                  <User className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Naimul Hasan"
                    className="w-full bg-transparent py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'bn' ? 'ব্যবসা / ই-কমার্স শপের নাম' : 'Business / Shop Name'}
                </label>
                <div className="flex items-center bg-slate-950 rounded-lg px-3 border border-slate-800 focus-within:border-cyan-500/50">
                  <Building className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Dhaka Style Fashion"
                    className="w-full bg-transparent py-2.5 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
            </label>
            <div className="flex items-center bg-slate-950 rounded-lg px-3 border border-slate-800 focus-within:border-cyan-500/50">
              <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@xbz.intelligence"
                className="w-full bg-transparent py-2.5 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="flex items-center bg-slate-950 rounded-lg px-3 border border-slate-800 focus-within:border-cyan-500/50">
              <Key className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-2.5 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer disabled:opacity-60 mt-2"
          >
            {isLoading 
              ? (language === 'bn' ? 'যাচাই হচ্ছে...' : 'Processing...') 
              : (mode === 'login' ? (language === 'bn' ? 'লগইন করুন' : 'Sign In') : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'))}
          </button>

        </form>

      </div>
    </div>
  );
};
