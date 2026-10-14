import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
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

import { LookupReport } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Search state
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchReport, setSearchReport] = useState<LookupReport | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { token, refreshSavedSearches } = useAuth();

  const handleSearch = async (phone: string, scenario?: string) => {
    setIsLoadingSearch(true);
    setSearchError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/courier/check', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          phone,
          sandboxScenario: scenario,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSearchReport(data.data);
        if (token) {
          refreshSavedSearches();
        }
      } else {
        setSearchError(data.error || 'Failed to query courier intelligence');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Network error occurred during lookup');
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleClear = () => {
    setSearchReport(null);
    setSearchError(null);
  };

  const handleReQueryFromAccount = (phone: string) => {
    setCurrentTab('home');
    handleSearch(phone);
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
