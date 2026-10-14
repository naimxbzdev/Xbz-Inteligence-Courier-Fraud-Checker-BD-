import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { CouriersPage } from './pages/CouriersPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { AccountPage } from './pages/AccountPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

import { LookupReport, ParcelTrackingReport, SearchType } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Search state (Phone History & Parcel Tracking)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchReport, setSearchReport] = useState<LookupReport | null>(null);
  const [parcelReport, setParcelReport] = useState<ParcelTrackingReport | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { language } = useLanguage();
  const { token, refreshSavedSearches } = useAuth();

  const handleSearch = async (
    query: string,
    searchType: SearchType = 'phone',
    courier: string = 'all',
    scenario?: string
  ) => {
    setIsLoadingSearch(true);
    setSearchError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const bodyPayload = {
        query,
        identifier: query,
        phone: query,
        searchType,
        courier,
        sandboxScenario: scenario,
      };

      const res = await fetch('/api/courier/check', {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyPayload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          language === 'bn'
            ? 'সার্ভার এপিআই থেকে বৈধ JSON রেসপন্স পাওয়া যায়নি (Netlify Functions বা ব্যাকএন্ড সার্ভার চালু আছে কি না নিশ্চিত করুন)।'
            : 'Non-JSON response received from server. Please verify Netlify Functions or backend server deployment.'
        );
      }

      const data = await res.json();
      if (data.success && data.data) {
        if (data.searchType === 'consignment' || data.searchType === 'parcel' || data.data.timeline) {
          setParcelReport(data.data as ParcelTrackingReport);
          setSearchReport(null);
        } else {
          setSearchReport(data.data as LookupReport);
          setParcelReport(null);
        }
        if (token) {
          refreshSavedSearches();
        }
      } else {
        setSearchError(data.error || (language === 'bn' ? 'তথ্য যাচাই করা সম্ভব হয়নি।' : 'Failed to query courier intelligence'));
      }
    } catch (err: any) {
      setSearchError(err.message || (language === 'bn' ? 'নেটওয়ার্ক এরর বা সার্ভার সংযোগ ত্রুটি ঘটেছে।' : 'Network error occurred during lookup'));
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleClear = () => {
    setSearchReport(null);
    setParcelReport(null);
    setSearchError(null);
  };

  const handleReQueryFromAccount = (phone: string) => {
    setCurrentTab('home');
    handleSearch(phone, 'phone', 'all');
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'couriers':
        return <CouriersPage />;
      case 'documentation':
        return <DocumentationPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPage />;
      case 'account':
        return <AccountPage onSearchPhone={handleReQueryFromAccount} />;
      case 'analytics':
        return <AnalyticsPage onSearchPhone={handleReQueryFromAccount} onNavigateTab={setCurrentTab} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'features':
      case 'home':
      default:
        return (
          <HomePage
            onSearch={handleSearch}
            isLoading={isLoadingSearch}
            report={searchReport}
            parcelReport={parcelReport}
            error={searchError}
            onClear={handleClear}
            onNavigateTab={setCurrentTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 cyber-grid">
      {/* Sticky Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentTab('account');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
