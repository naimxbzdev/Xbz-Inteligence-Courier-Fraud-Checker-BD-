import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Brand & Header
    'brand.name': 'XBZ Intelligence',
    'brand.credit': 'by Naim Xbz',
    'brand.subtitle': 'Courier Intelligence Platform',
    'brand.tagline': 'Smarter. Safer. Faster.',
    'nav.home': 'হোম',
    'nav.features': 'ফিচার',
    'nav.analytics': 'রিস্ক অ্যানালিটিক্স',
    'nav.couriers': 'কুরিয়ার ইন্টিগ্রেশন',
    'nav.documentation': 'ডকুমেন্টেশন',
    'nav.contact': 'যোগাযোগ',
    'nav.login': 'লগইন / সাইন আপ',
    'nav.admin': 'অ্যাডমিন প্যানেল',
    'nav.account': 'মার্চেন্ট ড্যাশবোর্ড',
    'nav.logout': 'লগআউট',

    // Hero Section
    'hero.badge': "Bangladesh's Trusted Intelligence Platform",
    'hero.headline.line1': 'কুরিয়ার ডেলিভারি হিস্ট্রি যাচাই করুন',
    'hero.headline.line2': 'ফোন নম্বর দিয়ে',
    'hero.description': 'অনুমোদিত কুরিয়ার API থেকে প্রাপ্ত তথ্যের ভিত্তিতে ডেলিভারি হিস্ট্রি, ক্যানসেলেশন রেকর্ড এবং সম্ভাব্য ঝুঁকি সম্পর্কে জানুন।',
    'hero.phonePlaceholder': '০১৭১২-৩৪৫৬৭৮',
    'hero.searchBtn': 'ফ্রড হিস্ট্রি চেক করুন',
    'hero.searchingBtn': 'যাচাই করা হচ্ছে...',
    'hero.clearBtn': 'মুছে ফেলুন',
    'hero.testScenarios': 'টেস্ট সিনারিও বেছে নিন:',
    'hero.scenario.clean': 'নরমাল কাস্টমার (উচ্চ ডেলিভারি)',
    'hero.scenario.highCancel': 'উচ্চ ক্যানসেলেশন প্রোফাইল',
    'hero.scenario.scoringDisabled': 'স্কোরিং নিষ্ক্রিয় প্রোফাইল',
    'hero.scenario.new': 'নতুন কাস্টমার / কোনো হিস্ট্রি নেই',
    'hero.scenario.timeout': 'টাইমআউট / সার্ভার ত্রুটি',

    // Search Types & Courier Selectors
    'search.typeLabel': 'অনুসন্ধানের মাধ্যম নির্বাচন',
    'search.type.auto': 'স্বয়ংক্রিয় সনাক্তকরণ (Auto-Detect)',
    'search.type.phone': 'ফোন নম্বর (Phone Number)',
    'search.type.consignment': 'কনসাইনমেন্ট আইডি (Consignment ID)',
    'search.type.parcel': 'পার্সেল আইডি / ট্র্যাকিং কোড (Parcel ID)',
    'search.courierLabel': 'কুরিয়ার নির্বাচন',
    'search.courier.all': 'সকল কুরিয়ার (স্বয়ংক্রিয় অনুসন্ধান)',
    'search.courier.steadfast': 'Steadfast Courier (স্টেডফাস্ট)',
    'search.courier.pathao': 'Pathao Courier (পাঠাও)',
    'search.courier.redx': 'REDX Courier (রেডএক্স)',
    'search.courier.paperfly': 'Paperfly (পেপারফ্লাই)',
    'search.courier.ecourier': 'eCourier (ই-কুরিয়ার)',
    'search.consignmentPlaceholder': 'কনসাইনমেন্ট আইডি দিন (যেমন: CID-774920)...',
    'search.parcelPlaceholder': 'পার্সেল আইডি বা ট্র্যাকিং কোড দিন (যেমন: TRK-882104)...',
    'search.autoPlaceholder': 'মোবাইল নম্বর, কনসাইনমেন্ট বা ট্র্যাকিং কোড দিন...',
    'search.trackBtn': 'পার্সেল ট্র্যাক করুন',
    'search.trackingBtn': 'ট্র্যাক করা হচ্ছে...',
    'search.sampleParcels': 'টেস্ট পার্সেল ট্র্যাকিং কোড:',
    'search.tagline.parcel': 'পার্সেল স্ট্যাটাস, অবস্থান ও ডেলিভারি হিস্ট্রি ট্র্যাক করুন',
    'search.tagline.consignment': 'কুরিয়ার কনসাইনমেন্ট ট্র্যাকিং ও গ্রাহক রিস্ক যাচাই',

    // Parcel Tracking Details
    'parcel.cardTitle': 'পার্সেল ট্র্যাকিং ও বিস্তারিত হিস্ট্রি',
    'parcel.allCouriersAuditTitle': 'সকল কুরিয়ার এপিআই অডিট ও গেটওয়ে রেসপন্স',
    'parcel.allCouriersAuditDesc': 'স্বচ্ছতা যাচাই: সকল কানেক্টেড কুরিয়ার এপিআই গেটওয়েতে একযোগে অনুসন্ধান করা হয়েছে। কোনো ফেক ডাটা তৈরি করা হয়নি।',
    'parcel.notFoundTitle': 'কোনো কুরিয়ারে সক্রিয় পার্সেল ডাটা পাওয়া যায়নি',
    'parcel.notFoundDesc': 'অনুসন্ধানকৃত কোনো কুরিয়ার গেটওয়েতে এই ট্র্যাকিং বা কনসাইনমেন্ট নম্বরের সক্রিয় কোনো পার্সেল পাওয়া যায়নি। পার্সেলটি সম্প্রতি বুকিং করা হয়ে থাকলে সিস্টেমের স্ক্যান আপডেটের জন্য কিছু সময় অপেক্ষা করতে হতে পারে।',
    'parcel.trackingId': 'ট্র্যাকিং / কনসাইনমেন্ট আইডি',
    'parcel.status': 'বর্তমান স্ট্যাটাস',
    'parcel.courier': 'কুরিয়ার সার্ভিস',
    'parcel.codAmount': 'ক্যাশ অন ডেলিভারি (COD)',
    'parcel.weight': 'পার্সেল ওজন',
    'parcel.deliveryCharge': 'ডেলিভারি চার্জ',
    'parcel.bookingDate': 'বুকিং সময়',
    'parcel.estDelivery': 'সম্ভাব্য ডেলিভারি',
    'parcel.deliveredAt': 'ডেলিভারি সম্পন্ন',
    'parcel.itemDesc': 'পণ্য বিবরণ',
    'parcel.sender': 'প্রেরক / মার্চেন্ট',
    'parcel.recipient': 'প্রাপক / কাস্টমার',
    'parcel.deliveryAddress': 'ডেলিভারি ঠিকানা',
    'parcel.timelineTitle': 'লাইভ ডেলিভারি টাইমলাইন ও ইভেন্ট হিস্ট্রি',
    'parcel.riskSnapshotTitle': 'প্রাপকের ডেলিভারি রিস্ক প্রোফাইল',
    'parcel.printWaybill': 'ওয়েবিল / চালান প্রিন্ট',
    'parcel.copyLink': 'ট্র্যাকিং লিঙ্ক কপি',
    'parcel.copied': 'কপি সম্পন্ন!',
    'parcel.newSearch': 'নতুন পার্সেল ট্র্যাক করুন',

    // Hero Benefits
    'benefit.secure': 'নিরাপদ ও এনক্রিপ্টেড',
    'benefit.instant': 'দ্রুত ফলাফল',
    'benefit.verified': 'সঠিক ডেটা সোর্স',
    'benefit.privacy': 'আপনার তথ্য সুরক্ষিত',

    // Couriers Strip
    'couriers.stripTitle': 'কুরিয়ার ইন্টিগ্রেশন স্ট্যাটাস',
    'couriers.stripSubtitle': 'স্বীকৃত কুরিয়ার এপিআই সংযোগ ও ফোন সার্চ সক্ষমতার স্বচ্ছ বিবরণ',
    'status.connected': 'কানেক্টেড',
    'status.configured': 'কনফিগার করা আছে',
    'status.not_configured': 'কনফিগার করা হয়নি',
    'status.temporarily_unavailable': 'সাময়িকভাবে অনুপলব্ধ',
    'status.auth_failed': 'অথেনটিকেশন ব্যর্থ',
    'status.phone_lookup_unsupported': 'ফোন অনুসন্ধান অনুপলব্ধ',
    'status.tracking_only': 'ট্র্যাকিং সমর্থিত',

    // Search Result
    'result.reportTitle': 'কুরিয়ার ডেলিভারি হিস্ট্রি ও রিস্ক রিপোর্ট',
    'result.maskedNumber': 'অনুসন্ধানকৃত নম্বর',
    'result.timestamp': 'যাচাইয়ের সময়',
    'result.providersChecked': 'যাচাইকৃত কুরিয়ার',
    'result.verifiedProviders': 'সফল হিস্ট্রি পাওয়া গেছে',
    'result.unsupportedProviders': 'ফোন সার্চ অনুপলব্ধ',
    'result.unavailableProviders': 'সার্ভিস এরর / টাইমআউট',
    'result.riskTitle': 'ডেলিভারি রিস্ক অ্যানালাইসিস',
    'result.formula': 'হিসাবের সূত্র ও নীতিমালা',
    'result.limitations': 'সীমাবদ্ধতা ও সতর্কতা',
    'result.exportBtn': 'রিপোর্ট প্রিন্ট / সেভ করুন',
    'result.retryBtn': 'পুনরায় অনুসন্ধান করুন',
    'result.disclaimer': 'এই রিপোর্ট অনুমোদিত উৎস থেকে পাওয়া উপলভ্য ডেলিভারি তথ্যের ভিত্তিতে তৈরি। কোনো ফলাফল একা কাউকে প্রতারক প্রমাণ করে না। তথ্য অসম্পূর্ণ বা পুরোনো হতে পারে।',
    'result.courierDetails': 'কুরিয়ার ভিত্তিক বিস্তারিত বিবরণ',
    'result.delivered': 'সফল ডেলিভারি',
    'result.cancelled': 'বাতিল অর্ডার',
    'result.returned': 'ফেরত অর্ডার',
    'result.successRatio': 'ডেলিভারি সাফল্যের হার',
    'result.providerScore': 'কুরিয়ার স্কোর',
    'result.notProvided': 'প্রযোজ্য নয়',
    'result.scoringDisabledNotice': 'প্রোভাইডারে স্কোরিং নিষ্ক্রিয় রয়েছে (কোনো অনুমানভিত্তিক স্কোর যুক্ত করা হয়নি)',

    // Features Section
    'features.badge': 'প্ল্যাটফর্ম সুবিধা',
    'features.heading': 'ই-কমার্স মার্চেন্টদের জন্য শক্তিশালী সমাধান',
    'features.card1.title': 'দ্রুত ও নির্ভুল যাচাই',
    'features.card1.desc': 'সঠিক ডেটা সোর্সের ভিত্তিতে কুরিয়ার ডেলিভারি হিস্ট্রি ও সম্ভাব্য ঝুঁকি সম্পর্কে জানুন।',
    'features.card2.title': 'বিশ্বস্ত কুরিয়ার API',
    'features.card2.desc': 'অনুমোদিত কুরিয়ার API থেকে প্রাপ্ত যাচাইকৃত তথ্য দেখুন।',
    'features.card3.title': 'সকল ডিভাইসে ব্যবহারযোগ্য',
    'features.card3.desc': 'মোবাইল, ট্যাবলেট ও ডেস্কটপে সহজে ব্যবহার করুন।',
    'features.card4.title': 'আপনার তথ্য সুরক্ষিত',
    'features.card4.desc': 'নিরাপদ API সংযোগ, সীমিত ডেটা সংগ্রহ ও সুরক্ষিত ব্যবস্থাপনা।',

    // How It Works
    'how.heading': 'কিভাবে কাজ করে?',
    'how.subtitle': 'মাত্র কয়েকটি ধাপে কুরিয়ার ডেলিভারি হিস্ট্রি যাচাই করুন।',
    'how.step1.num': '০১',
    'how.step1.title': 'ফোন নম্বর দিন',
    'how.step1.desc': 'সঠিক বাংলাদেশের মোবাইল নম্বর ইনপুট করুন।',
    'how.step2.num': '০২',
    'how.step2.title': 'API থেকে ডেটা সংগ্রহ',
    'how.step2.desc': 'সমর্থিত ও অনুমোদিত কুরিয়ার API-তে নিরাপদ অনুরোধ পাঠানো হয়।',
    'how.step3.num': '০৩',
    'how.step3.title': 'ডেটা বিশ্লেষণ',
    'how.step3.desc': 'প্রাপ্ত তথ্য যাচাই করে delivery history এবং সমর্থিত risk indicators সাজানো হয়।',
    'how.step4.num': '০৪',
    'how.step4.title': 'রিপোর্ট দেখুন',
    'how.step4.desc': 'উপলব্ধ ফলাফল, অসম্পূর্ণ ডেটা ও সংশ্লিষ্ট সতর্কতা দেখুন।',

    // Trust Banner
    'banner.heading': 'বিশ্বস্ত তথ্য, নিরাপদ সিদ্ধান্ত',
    'banner.desc': 'XBZ Intelligence — অনুমোদিত কুরিয়ার ডেটার ভিত্তিতে আরও সচেতন সিদ্ধান্ত নিতে সহায়তা করে।',
    'banner.card1': 'নিরাপদ API ব্যবস্থাপনা',
    'banner.card2': 'বাংলাদেশ ভিত্তিক বিশেষায়িত',
    'banner.card3': '২৪/৭ ডকুমেন্টেশন ও সহায়তা',

    // Risk Analytics Dashboard
    'analytics.badge': 'সিস্টেম রিস্ক অ্যানালিটিক্স',
    'analytics.title': 'কুরিয়ার ডেলিভারি পারফরম্যান্স ও রিস্ক অ্যানালিটিক্স',
    'analytics.subtitle': 'বাংলাদেশের শীর্ষ কুরিয়ারসমূহের ডেলিভারি সাফল্যের হার, রিটার্ন ঝুঁকি ও সাধারণ রিস্ক ফ্যাক্টরের সামগ্রিক পরিসংখ্যান',
    'analytics.filterTimeframe': 'সময়সীমা',
    'analytics.filterCourier': 'কুরিয়ার নির্বাচন',
    'analytics.allCouriers': 'সকল কুরিয়ার',
    'analytics.refresh': 'রিফ্রেশ মেট্রিক্স',
    'analytics.kpi.totalQueries': 'মোট মূল্যায়িত লুকআপ',
    'analytics.kpi.avgSuccess': 'গড় ডেলিভারি সাফল্যের হার',
    'analytics.kpi.avgReturn': 'গড় রিটার্ন / ক্যানসেলেশন হার',
    'analytics.kpi.highRisk': 'উচ্চ ঝুঁকি শনাক্তকরণ',
    'analytics.kpi.monitoredGateways': 'সক্রিয় কুরিয়ার গেটওয়ে',
    'analytics.kpi.lossPrevented': 'আনুমানিক সেভ হওয়া ডেলিভারি ফি',
    'analytics.chart.courierSuccessTitle': 'কুরিয়ার ভিত্তিক ডেলিভারি বনাম রিটার্ন হার',
    'analytics.chart.riskFactorsTitle': 'শীর্ষ সাধারণ রিস্ক ফ্যাক্টর ও প্রতিরোধ টিপস',
    'analytics.chart.tierTitle': 'সামগ্রিক ঝুঁকি ক্যাটাগরি বণ্টন',
    'analytics.chart.trendTitle': 'ঐতিহাসিক ডেলিভারি পারফরম্যান্স ট্রেন্ড',
    'analytics.chart.regionalTitle': 'বিভাগভিত্তিক ডেলিভারি সম্পন্নতার হার',
    'analytics.table.courierName': 'কুরিয়ার',
    'analytics.table.delivered': 'ডেলিভার্ড পার্সেল',
    'analytics.table.returned': 'রিটার্ন পার্সেল',
    'analytics.table.successRate': 'সাফল্য হার',
    'analytics.table.dhakaSLA': 'ঢাকা ট্রানজিট',
    'analytics.table.outsideSLA': 'ঢাকার বাইরে ট্রানজিট',
    'analytics.factor.severity': 'ঝুঁকির মাত্রা',
    'analytics.factor.impact': 'প্রভাব',
    'analytics.factor.advice': 'মার্চেন্টদের জন্য সুরক্ষা পরামর্শ',
    'analytics.hours': 'ঘণ্টা',
    'analytics.days': 'দিন',
    'analytics.disclaimer': 'এই অ্যানালিটিক্স মেট্রিক্স বিভিন্ন কুরিয়ারের সামগ্রিক কর্মক্ষমতা এবং সিস্টেমে মূল্যায়িত লেনদেনের ভিত্তিতে সংকলিত। এটি মার্চেন্টদের ক্যাশ অন ডেলিভারি ডিসিশন নিতে সহায়তা করে।',

    // Footer
    'footer.description': 'বাংলাদেশের ই-কমার্স ব্যবসায়ীদের ক্যাশ অন ডেলিভারি ক্ষতি কমাতে অনুমোদিত কুরিয়ার ইন্টেলিজেন্স ও ডেলিভারি হিস্ট্রি বিশ্লেষণ প্ল্যাটফর্ম।',
    'footer.quickLinks': 'প্রয়োজনীয় লিংক',
    'footer.privacy': 'গোপনীয়তা নীতি',
    'footer.terms': 'ব্যবহারের শর্তাবলী',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',
  },
  en: {
    // Brand & Header
    'brand.name': 'XBZ Intelligence',
    'brand.credit': 'by Naim Xbz',
    'brand.subtitle': 'Courier Intelligence Platform',
    'brand.tagline': 'Smarter. Safer. Faster.',
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.analytics': 'Risk Analytics',
    'nav.couriers': 'Couriers',
    'nav.documentation': 'Documentation',
    'nav.contact': 'Contact',
    'nav.login': 'Login / Sign Up',
    'nav.admin': 'Admin Panel',
    'nav.account': 'Merchant Dashboard',
    'nav.logout': 'Logout',

    // Hero Section
    'hero.badge': "Bangladesh's Trusted Intelligence Platform",
    'hero.headline.line1': 'Verify Courier Delivery History',
    'hero.headline.line2': 'Using Phone Number',
    'hero.description': 'Inspect delivery history, cancellation ratios, and transparent delivery-risk indicators directly from authorized courier APIs.',
    'hero.phonePlaceholder': '01712-345678',
    'hero.searchBtn': 'Check Fraud History',
    'hero.searchingBtn': 'Verifying...',
    'hero.clearBtn': 'Clear',
    'hero.testScenarios': 'Select Test Scenario:',
    'hero.scenario.clean': 'Normal Customer (High Delivery)',
    'hero.scenario.highCancel': 'High Cancellation Profile',
    'hero.scenario.scoringDisabled': 'Scoring Disabled by Provider',
    'hero.scenario.new': 'New Customer / No History',
    'hero.scenario.timeout': 'Gateway Timeout / Provider Error',

    // Search Types & Courier Selectors
    'search.typeLabel': 'Select Search Type',
    'search.type.auto': 'Auto-Detect (Smart Routing)',
    'search.type.phone': 'Phone Number',
    'search.type.consignment': 'Consignment ID',
    'search.type.parcel': 'Parcel ID / Tracking Code',
    'search.courierLabel': 'Select Courier',
    'search.courier.all': 'All Couriers (Auto-Detect Across Gateways)',
    'search.courier.steadfast': 'Steadfast Courier',
    'search.courier.pathao': 'Pathao Courier',
    'search.courier.redx': 'REDX Courier',
    'search.courier.paperfly': 'Paperfly',
    'search.courier.ecourier': 'eCourier',
    'search.consignmentPlaceholder': 'Enter Consignment ID (e.g. CID-774920)...',
    'search.parcelPlaceholder': 'Enter Parcel ID / Tracking Code (e.g. TRK-882104)...',
    'search.autoPlaceholder': 'Enter mobile number, consignment ID, or tracking code...',
    'search.trackBtn': 'Track Parcel',
    'search.trackingBtn': 'Tracking...',
    'search.sampleParcels': 'Sample Tracking Codes:',
    'search.tagline.parcel': 'Track parcel status, location & chronological history',
    'search.tagline.consignment': 'Consignment tracking & recipient delivery risk telemetry',

    // Parcel Tracking Details
    'parcel.cardTitle': 'Parcel Tracking & Event History',
    'parcel.allCouriersAuditTitle': 'All Courier Gateways API Audit & Live Responses',
    'parcel.allCouriersAuditDesc': 'Transparency Verification: All connected courier API gateways were queried simultaneously. Zero fabricated data.',
    'parcel.notFoundTitle': 'No Active Parcel Found Across Queried Couriers',
    'parcel.notFoundDesc': 'None of the queried official courier API gateways returned an active manifest or shipment for this tracking reference. If booked recently, please allow 15-30 minutes for hub scanners to update.',
    'parcel.trackingId': 'Tracking / Consignment ID',
    'parcel.status': 'Current Status',
    'parcel.courier': 'Courier Service',
    'parcel.codAmount': 'Cash on Delivery (COD)',
    'parcel.weight': 'Parcel Weight',
    'parcel.deliveryCharge': 'Delivery Charge',
    'parcel.bookingDate': 'Booking Date',
    'parcel.estDelivery': 'Estimated Delivery',
    'parcel.deliveredAt': 'Delivered At',
    'parcel.itemDesc': 'Item Description',
    'parcel.sender': 'Sender / Merchant',
    'parcel.recipient': 'Recipient / Customer',
    'parcel.deliveryAddress': 'Delivery Address',
    'parcel.timelineTitle': 'Live Delivery Timeline & Milestone Events',
    'parcel.riskSnapshotTitle': 'Recipient Delivery Risk Telemetry',
    'parcel.printWaybill': 'Print Waybill / Receipt',
    'parcel.copyLink': 'Copy Tracking Link',
    'parcel.copied': 'Copied!',
    'parcel.newSearch': 'Track Another Parcel',

    // Hero Benefits
    'benefit.secure': 'Secure & Encrypted',
    'benefit.instant': 'Instant Results',
    'benefit.verified': 'Verified Sources',
    'benefit.privacy': 'Privacy Protected',

    // Couriers Strip
    'couriers.stripTitle': 'Courier Integration Status',
    'couriers.stripSubtitle': 'Transparent overview of supported courier APIs and phone-lookup capabilities',
    'status.connected': 'Connected',
    'status.configured': 'Configured',
    'status.not_configured': 'Not Configured',
    'status.temporarily_unavailable': 'Temporarily Unavailable',
    'status.auth_failed': 'Auth Failed',
    'status.phone_lookup_unsupported': 'Phone Lookup Unsupported',
    'status.tracking_only': 'Tracking Only',

    // Search Result
    'result.reportTitle': 'Delivery Intelligence & Risk Report',
    'result.maskedNumber': 'Queried Phone Number',
    'result.timestamp': 'Lookup Timestamp',
    'result.providersChecked': 'Providers Checked',
    'result.verifiedProviders': 'Verified History Found',
    'result.unsupportedProviders': 'Phone Lookup Unsupported',
    'result.unavailableProviders': 'Unavailable / Timeout',
    'result.riskTitle': 'Delivery Risk Analysis',
    'result.formula': 'Formula & Scoring Rationale',
    'result.limitations': 'Limitations & Review Guidelines',
    'result.exportBtn': 'Print / Save Report',
    'result.retryBtn': 'New Lookup',
    'result.disclaimer': 'This intelligence report is generated from available authorized courier data sources. A delivery indicator alone does not prove that an individual is fraudulent. Records may be incomplete or historical.',
    'result.courierDetails': 'Provider Breakdown',
    'result.delivered': 'Delivered Orders',
    'result.cancelled': 'Cancelled Orders',
    'result.returned': 'Returned Orders',
    'result.successRatio': 'Delivery Success Ratio',
    'result.providerScore': 'Provider Score',
    'result.notProvided': 'Not Applicable',
    'result.scoringDisabledNotice': 'Provider has disabled scoring (no score has been hallucinated)',

    // Features Section
    'features.badge': 'Platform Capabilities',
    'features.heading': 'Engineered for Bangladesh E-Commerce Merchants',
    'features.card1.title': 'Fast & Accurate Verification',
    'features.card1.desc': 'Inspect authentic delivery history and return risks backed by authorized courier gateways.',
    'features.card2.title': 'Authorized Courier APIs',
    'features.card2.desc': 'Direct integrations with recognized logistics providers without scraping or unauthorized access.',
    'features.card3.title': 'Every Device Ready',
    'features.card3.desc': 'Smooth, lightning-fast experience on mobile, tablet, and widescreen desktops.',
    'features.card4.title': 'Your Data Is Protected',
    'features.card4.desc': 'Server-side secret storage, masked phone presentation, and strict rate-limiting.',

    // How It Works
    'how.heading': 'How Does It Work?',
    'how.subtitle': 'Verify delivery history in four straightforward steps.',
    'how.step1.num': '01',
    'how.step1.title': 'Enter Phone Number',
    'how.step1.desc': 'Input a valid 11-digit Bangladeshi mobile number.',
    'how.step2.num': '02',
    'how.step2.title': 'Secure API Query',
    'how.step2.desc': 'Encrypted requests are sent to supported, authorized courier adapters.',
    'how.step3.num': '03',
    'how.step3.title': 'Data Synthesis',
    'how.step3.desc': 'Delivered and cancelled order ratios are compiled into transparent review indicators.',
    'how.step4.num': '04',
    'how.step4.title': 'View Intelligence Report',
    'how.step4.desc': 'Examine verified records, unsupported provider notices, and actionable recommendations.',

    // Trust Banner
    'banner.heading': 'Trusted Data, Confident Decisions',
    'banner.desc': 'XBZ Intelligence helps merchants make informed Cash-on-Delivery fulfillment decisions.',
    'banner.card1': 'Secure API Handling',
    'banner.card2': 'Bangladesh Focused',
    'banner.card3': 'Support & Documentation',

    // Risk Analytics Dashboard
    'analytics.badge': 'System Risk Analytics',
    'analytics.title': 'Courier Delivery Performance & Risk Analytics',
    'analytics.subtitle': 'Aggregated telemetry of courier delivery success rates, return risks, and common cash-on-delivery risk factors across Bangladesh',
    'analytics.filterTimeframe': 'Timeframe',
    'analytics.filterCourier': 'Select Courier',
    'analytics.allCouriers': 'All Couriers',
    'analytics.refresh': 'Refresh Metrics',
    'analytics.kpi.totalQueries': 'Total Lookups Evaluated',
    'analytics.kpi.avgSuccess': 'Avg Delivery Success Rate',
    'analytics.kpi.avgReturn': 'Avg Return / Cancellation Rate',
    'analytics.kpi.highRisk': 'High-Risk Interceptions',
    'analytics.kpi.monitoredGateways': 'Monitored Courier Gateways',
    'analytics.kpi.lossPrevented': 'Estimated Merchant Loss Prevented',
    'analytics.chart.courierSuccessTitle': 'Courier-Wise Delivery vs Return Performance',
    'analytics.chart.riskFactorsTitle': 'Common COD Risk Factors & Mitigation Tips',
    'analytics.chart.tierTitle': 'Risk Tier Distribution',
    'analytics.chart.trendTitle': 'Historical Delivery Success Trends',
    'analytics.chart.regionalTitle': 'Regional Delivery Completion by Division',
    'analytics.table.courierName': 'Courier',
    'analytics.table.delivered': 'Delivered Parcels',
    'analytics.table.returned': 'Returned Parcels',
    'analytics.table.successRate': 'Success Rate',
    'analytics.table.dhakaSLA': 'Dhaka Transit',
    'analytics.table.outsideSLA': 'Outside Dhaka Transit',
    'analytics.factor.severity': 'Severity',
    'analytics.factor.impact': 'Incidence',
    'analytics.factor.advice': 'Merchant Recommendation',
    'analytics.hours': 'hrs',
    'analytics.days': 'days',
    'analytics.disclaimer': 'These analytics reflect aggregated operational delivery rates and anonymized merchant telemetry to assist in cash-on-delivery loss prevention.',

    // Footer
    'footer.description': 'Bangladesh courier intelligence and delivery-risk analysis platform by Naim Xbz. Built for modern merchants.',
    'footer.quickLinks': 'Navigation',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('xbz_language');
    return (saved === 'en' ? 'en' : 'bn');
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('xbz_language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
