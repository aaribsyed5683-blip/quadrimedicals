import React from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { Phone, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Logo } from './components/Logo';

const AppContent: React.FC = () => {
  const { content, loading, error, activePage, isAdminAuthenticated, reloadContent } = useContent();

  if (loading && !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center space-y-4 max-w-sm text-center">
          <Logo size="lg" />
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">
            Loading Quadri Medical &amp; General Store...
          </p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-rose-200 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Connection Error</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => reloadContent()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin View
  if (activePage === 'admin') {
    if (isAdminAuthenticated) {
      return <AdminDashboard />;
    }
    return <AdminLogin />;
  }

  const phone1 = content?.settings?.phone1 || '9885588593';
  const whatsappNumber = content?.settings?.whatsappNumber || '9885588593';
  const cleanPhone = phone1.replace(/\s+/g, '');
  const cleanWa = whatsappNumber.replace(/[^\d]/g, '');

  // Public Website View
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'services' && <ServicesPage />}
        {activePage === 'contact' && <ContactPage />}
      </main>

      <Footer />

      {/* Floating Mobile Fast Actions (respecting 15% mobile sticky cap) */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 flex flex-col gap-2.5">
        <a
          href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20have%20an%20inquiry`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="WhatsApp Store"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={`tel:${cleanPhone}`}
          className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Call Store"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}
