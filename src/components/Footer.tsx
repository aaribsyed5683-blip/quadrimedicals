import React from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from './Logo';
import { Phone, MapPin, Clock, MessageCircle, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content, setActivePage, isAdminAuthenticated } = useContent();
  const settings = content?.settings;

  const phone1 = settings?.phone1 || '9885588593';
  const phone2 = settings?.phone2 || '8074992911';
  const address = settings?.address || '20-4-367, Himmatpura Road, Hyderabad, T.G';
  const mapsUrl = settings?.googleMapsUrl || 'https://maps.google.com/maps?q=17.3550829%2C78.4689213&z=17&hl=en';
  const whatsappNumber = settings?.whatsappNumber || '9885588593';
  const cleanWa = whatsappNumber.replace(/[^\d]/g, '');

  const handleNavClick = (page: 'home' | 'about' | 'services' | 'contact') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Core Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white p-3 rounded-xl inline-block shadow-xs">
              <Logo size="md" customLogoUrl={settings?.logoUrl} />
            </div>
            <p className="text-emerald-400 font-medium text-sm leading-snug">
              “{settings?.tagline || '30 Years of Trusted Service — Your Health, Our Commitment.'}”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {settings?.footerText ||
                'Serving generations of families in Himmatpura and Hyderabad with genuine medications, personal wellness care, and dependable service.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-emerald-400 transition-colors text-left text-slate-300 cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-emerald-400 transition-colors text-left text-slate-300 cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('services')}
                  className="hover:text-emerald-400 transition-colors text-left text-slate-300 cursor-pointer"
                >
                  Services &amp; Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-emerald-400 transition-colors text-left text-slate-300 cursor-pointer"
                >
                  Contact &amp; Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Phones */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Contact &amp; Orders
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Phone Numbers:</span>
                  <a
                    href={`tel:${phone1.replace(/\s+/g, '')}`}
                    className="text-white font-medium hover:text-emerald-400 transition-colors"
                  >
                    {phone1}
                  </a>
                  {phone2 && (
                    <a
                      href={`tel:${phone2.replace(/\s+/g, '')}`}
                      className="text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                      {phone2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">WhatsApp Prescription:</span>
                  <a
                    href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20have%20an%20order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>+91 {whatsappNumber}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Timings */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase border-b border-slate-800 pb-2">
              Store Location
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings?.workingHours || 'Monday – Sunday: 9:00 AM – 11:30 PM'}</span>
              </div>

              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors text-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Admin Access */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <span>&copy; {new Date().getFullYear()} Quadri Medical &amp; General Store. All rights reserved.</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Himmatpura, Hyderabad</span>
          </div>

          {/* Admin access trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActivePage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px] py-1 px-2 rounded hover:bg-slate-800/60 cursor-pointer"
              title="Store Owner & Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Store Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
