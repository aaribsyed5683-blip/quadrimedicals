import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from './Logo';
import { Phone, MessageCircle, Menu, X, Shield, Clock, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { content, activePage, setActivePage, isAdminAuthenticated } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settings = content?.settings;
  const phone1 = settings?.phone1 || '9885588593';
  const whatsappNumber = settings?.whatsappNumber || '9885588593';
  const cleanPhone = phone1.replace(/\s+/g, '');
  const cleanWa = whatsappNumber.replace(/[^\d]/g, '');

  const navItems: { id: 'home' | 'about' | 'services' | 'contact'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: 'home' | 'about' | 'services' | 'contact') => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro-bar for quick contact info and hours */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings?.workingHours || 'Mon – Sun: 9:00 AM – 11:30 PM'}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Himmatpura Road, Hyderabad</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${cleanPhone}`}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call: {settings?.phone1 || '9885588593'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20need%20medicines`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Order</span>
            </a>
            {isAdminAuthenticated && (
              <button
                onClick={() => setActivePage('admin')}
                className="ml-3 px-2 py-0.5 rounded bg-emerald-700/80 hover:bg-emerald-600 text-[11px] font-medium text-white flex items-center gap-1 transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar complying with Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Quadri Medical & General Store Home"
        >
          <Logo size="md" customLogoUrl={settings?.logoUrl} />
        </button>

        {/* Zone 2: Navigation Links (Clean text links with active underlines) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors py-2 relative cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick WhatsApp action */}
          <a
            href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20have%20an%20inquiry`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Primary Call Now Action */}
          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-white" />
            <span className="hidden xs:inline">Call Now</span>
            <span className="xs:hidden">Call</span>
          </a>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="text-xs text-slate-500 px-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{settings?.workingHours || 'Mon – Sun: 9:00 AM – 11:30 PM'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-700 text-white font-medium text-sm shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store</span>
              </a>
              <a
                href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20need%20medicines`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 text-white font-medium text-sm shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setActivePage('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Open Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
