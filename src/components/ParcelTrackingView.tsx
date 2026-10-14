import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ParcelTrackingReport, ParcelStatus, RiskLevel } from '../types';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  CreditCard,
  Weight,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  User,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Radio,
  XCircle
} from 'lucide-react';

interface ParcelTrackingViewProps {
  report: ParcelTrackingReport;
  onReset: () => void;
}

export const ParcelTrackingView: React.FC<ParcelTrackingViewProps> = ({ report, onReset }) => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: ParcelStatus) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/50',
          text: 'text-emerald-300',
          indicator: 'bg-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        };
      case 'out_for_delivery':
        return {
          bg: 'bg-blue-950/80',
          border: 'border-blue-500/50',
          text: 'text-blue-300',
          indicator: 'bg-blue-400 animate-pulse',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
          icon: <Truck className="w-5 h-5 text-blue-400" />,
        };
      case 'in_transit':
        return {
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/50',
          text: 'text-cyan-300',
          indicator: 'bg-cyan-400 animate-pulse',
          glow: 'shadow-[0_0_20px_rgba(0,240,255,0.35)]',
          icon: <Clock className="w-5 h-5 text-cyan-400" />,
        };
      case 'returned':
      case 'cancelled':
        return {
          bg: 'bg-red-950/80',
          border: 'border-red-500/50',
          text: 'text-red-300',
          indicator: 'bg-red-400',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        };
      default:
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/50',
          text: 'text-amber-300',
          indicator: 'bg-amber-400',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
          icon: <Package className="w-5 h-5 text-amber-400" />,
        };
    }
  };

  const getCourierColor = (courier: string) => {
    switch (courier) {
      case 'steadfast':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'pathao':
        return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'redx':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'paperfly':
        return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      case 'ecourier':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    }
  };

  const getRiskBadge = (level?: RiskLevel) => {
    switch (level) {
      case 'low':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          labelEn: 'Low Risk Recipient',
          labelBn: 'বিশ্বস্ত গ্রাহক (স্বাভাবিক ঝুঁকি)',
        };
      case 'moderate':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          labelEn: 'Moderate Risk Recipient',
          labelBn: 'মাঝারি ঝুঁকি (অর্ডার কনফার্ম করুন)',
        };
      case 'high':
        return {
          badge: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
          labelEn: 'High Cancellation Risk',
          labelBn: 'উচ্চ ক্যানসেলেশন ঝুঁকি রয়েছে',
        };
      default:
        return {
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
          labelEn: 'Standard Profile',
          labelBn: 'স্বাভাবিক প্রোফাইল',
        };
    }
  };

  const statusTheme = getStatusBadge(report.currentStatus);
  const riskTheme = getRiskBadge(report.customerRiskTelemetry?.overallRisk);

  const handleCopy = () => {
    const text = `XBZ Intelligence Parcel Tracking\nIdentifier: ${report.identifier}\nCourier: ${report.courierName}\nStatus: ${report.statusLabelEn}\nCOD: ৳${report.packageDetails.codAmount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090f23]/90 border border-cyan-500/25 shadow-xl backdrop-blur-md mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t('parcel.cardTitle')}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCourierColor(report.courier)}`}>
                {report.courierName}
              </span>
              {report.isSandboxMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  SANDBOX / VERIFIED DEMO
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span>{report.searchType === 'parcel' ? 'Parcel ID' : 'Consignment ID'}: <strong className="text-cyan-300">{report.trackingId}</strong></span>
              {report.invoiceId && (
                <>
                  <span>·</span>
                  <span>Invoice: {report.invoiceId}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t('parcel.copied') : t('parcel.copyLink')}</span>
          </button>

          {report.found && (
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{t('parcel.printWaybill')}</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('result.retryBtn')}</span>
          </button>
        </div>
      </div>

      {/* CASE 1: PARCEL NOT FOUND IN ANY COURIER */}
      {!report.found ? (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/40 border border-amber-500/40 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {t('parcel.notFoundTitle')}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {t('parcel.notFoundDesc')}
                </p>
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-300/90 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {language === 'bn' 
                      ? 'XBZ Intelligence সততা নীতি: কোনো ফেক বা অনুমানভিত্তিক ডাটা তৈরি করা হয় না। সকল অফিসিয়াল এপিআই এর সঠিক অডিট লগ নিচে প্রদর্শিত হলো।' 
                      : 'XBZ Zero-Fabrication Policy: We never invent fake tracking events. Live courier gateway audit logs are detailed below.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Courier Probe Log */}
          {report.probedCouriers && report.probedCouriers.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t('parcel.allCouriersAuditTitle')}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {report.probedCouriers.length} Gateways Queried
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {report.probedCouriers.map((cp, idx) => {
                  const isFound = cp.status === 'found';
                  const isNotConfigured = cp.status === 'not_configured';

                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isFound
                          ? 'bg-emerald-950/40 border-emerald-500/40'
                          : isNotConfigured
                          ? 'bg-slate-950/60 border-slate-800'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isFound ? 'bg-emerald-400' : isNotConfigured ? 'bg-slate-600' : 'bg-amber-400'}`} />
                          {cp.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          isFound
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isNotConfigured
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {cp.status.replace('_', ' ')} {cp.httpStatus ? `(${cp.httpStatus})` : ''}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-cyan-400/80 truncate mb-1">
                        Endpoint: {cp.queriedEndpoint}
                      </div>

                      <div className="text-xs text-slate-400">
                        {language === 'bn' ? cp.messageBn : cp.messageEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CASE 2: REAL PARCEL FOUND IN COURIER API */
        <>
          {/* Main Status & Telemetry Card */}
          <div className={`p-6 sm:p-8 rounded-3xl ${statusTheme.bg} border ${statusTheme.border} ${statusTheme.glow} backdrop-blur-xl mb-6 relative overflow-hidden`}>
            
            {/* Glow ambient accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${statusTheme.indicator}`} />
                  <span>{t('parcel.status')}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                  {statusTheme.icon}
                  <span>{language === 'bn' ? report.statusLabelBn : report.statusLabelEn}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                  {report.timeline[report.timeline.length - 1]?.noteBn && language === 'bn'
                    ? report.timeline[report.timeline.length - 1]?.noteBn
                    : report.timeline[report.timeline.length - 1]?.noteEn || 'Gateway status updated via official courier API.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
                <div className="text-xs text-slate-400 font-mono">
                  COD Collection:
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 cyan-text-glow">
                  ৳ {report.packageDetails.codAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  Weight: {report.packageDetails.weightKg} kg · Delivery Fee: ৳{report.packageDetails.deliveryCharge}
                </div>
              </div>
            </div>

            {/* Linked Recipient Delivery Risk Telemetry Banner */}
            {report.customerRiskTelemetry && (
              <div className="mt-6 p-4 rounded-2xl bg-[#060a17]/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {t('parcel.riskSnapshotTitle')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1 ${riskTheme.badge}`}>
                        {riskTheme.icon}
                        <span>{language === 'bn' ? riskTheme.labelBn : riskTheme.labelEn}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {language === 'bn' ? report.customerRiskTelemetry.noteBn : report.customerRiskTelemetry.noteEn}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <div className="text-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Success Rate</div>
                    <div className="text-sm font-bold text-emerald-400">
                      {report.customerRiskTelemetry.deliverySuccessRate}%
                    </div>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Shipments</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {report.customerRiskTelemetry.totalHistoricalParcels}
                    </div>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Cancelled</div>
                    <div className="text-sm font-bold text-amber-400">
                      {report.customerRiskTelemetry.cancelledParcels}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Two Column Layout: Timeline (Left) & Package/Route Details (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* Left Column (7 cols): Milestone Timeline */}
            <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-slate-800 mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>{t('parcel.timelineTitle')}</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {report.timeline.length} Events Logged
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500 before:to-slate-800">
                {report.timeline.map((event, idx) => {
                  const isCompleted = event.status === 'completed';
                  const isCurrent = event.status === 'current';

                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Point */}
                      <div className={`absolute -left-6 sm:-left-8 top-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 animate-pulse'
                          : isCompleted
                          ? 'bg-cyan-950 text-cyan-400 border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'bg-slate-900 text-slate-600 border border-slate-700'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                        )}
                      </div>

                      {/* Event Content Card */}
                      <div className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                          <h4 className="text-sm font-bold text-white">
                            {language === 'bn' ? event.titleBn : event.titleEn}
                          </h4>
                          <time className="text-[11px] font-mono text-slate-400 shrink-0">
                            {new Date(event.timestamp).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-cyan-300/90 font-medium mb-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{language === 'bn' ? event.locationBn : event.locationEn}</span>
                        </div>

                        {(event.noteBn || event.noteEn) && (
                          <p className="text-xs text-slate-400 leading-relaxed mt-1.5 pt-1.5 border-t border-slate-800/80">
                            {language === 'bn' ? event.noteBn : event.noteEn}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (5 cols): Sender, Recipient & Parcel Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Recipient Information Card */}
              <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>{t('parcel.recipient')}</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Customer Name:</span>
                    <span className="font-semibold text-white font-mono">{report.recipient.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Phone (Masked):</span>
                    <span className="font-semibold text-cyan-300 font-mono">{report.recipient.maskedPhone}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Destination Area:</span>
                    <span className="font-semibold text-white">{report.recipient.area}, {report.recipient.district}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1">Delivery Address:</span>
                    <span className="text-slate-300 leading-relaxed block p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-[11px]">
                      {report.recipient.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sender & Package Metadata Card */}
              <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>{t('parcel.sender')} & Shipment</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Merchant Store:</span>
                    <span className="font-semibold text-white">{report.sender.merchant}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Booking Origin:</span>
                    <span className="font-semibold text-slate-300">{report.sender.district} Hub</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Item Description:</span>
                    <span className="font-semibold text-slate-200">{report.packageDetails.itemDescription}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Package Weight:</span>
                    <span className="font-semibold text-cyan-300 font-mono">{report.packageDetails.weightKg} KG</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Booking Date:</span>
                    <span className="font-semibold text-slate-300 font-mono">
                      {new Date(report.bookingDate).toLocaleDateString([], { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparency Notice */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300 block mb-1">
                  {language === 'bn' ? 'স্বচ্ছতা ও সত্যনিষ্ঠতা নোটিশ:' : 'Transparency Notice:'}
                </span>
                {language === 'bn' ? report.disclaimerBn : report.disclaimerEn}
              </div>

            </div>

          </div>

          {/* All Probed Couriers Breakdown (Audit Log) */}
          {report.probedCouriers && report.probedCouriers.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#090f23]/90 border border-cyan-500/20 shadow-xl mb-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t('parcel.allCouriersAuditTitle')}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {report.probedCouriers.length} Courier Gateways Probed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {report.probedCouriers.map((cp, idx) => {
                  const isFound = cp.status === 'found';
                  const isNotConfigured = cp.status === 'not_configured';

                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isFound
                          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                          : isNotConfigured
                          ? 'bg-slate-950/50 border-slate-800'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isFound ? 'bg-emerald-400 animate-pulse' : isNotConfigured ? 'bg-slate-600' : 'bg-amber-400'}`} />
                          {cp.name}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                          isFound
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isNotConfigured
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {cp.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-cyan-400/80 truncate mb-1">
                        {cp.queriedEndpoint}
                      </div>

                      <div className="text-[11px] text-slate-400">
                        {language === 'bn' ? cp.messageBn : cp.messageEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
