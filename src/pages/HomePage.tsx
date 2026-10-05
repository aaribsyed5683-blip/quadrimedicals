import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { Phone, MessageCircle, MapPin, ArrowRight, ShieldCheck, Clock, Award, CheckCircle, ChevronRight, X, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { content, setActivePage } = useContent();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  if (!content) return null;

  const { settings, home, services, gallery } = content;
  const cleanPhone = (settings.phone1 || '9885588593').replace(/\s+/g, '');
  const cleanWa = (settings.whatsappNumber || '9885588593').replace(/[^\d]/g, '');

  const topServices = [...services].sort((a, b) => a.order - b.order).slice(0, 6);
  const galleryImages = gallery.filter((img) => img.section === 'gallery' || !img.section);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Announcement Banner if enabled */}
      {settings.showBannerNotice && settings.bannerNotice && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white py-2 px-4 text-xs md:text-sm font-medium text-center shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>{settings.bannerNotice}</span>
            <a
              href={`https://wa.me/91${cleanWa}?text=Hello%2C%20I%20have%20a%20prescription%20to%20send`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-emerald-100 ml-1 inline-flex items-center gap-0.5"
            >
              Order on WhatsApp &rarr;
            </a>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm font-semibold shadow-2xs">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{home.trustBadgeText || '30 Years of Trusted Community Healthcare'}</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {home.heroHeading || 'Quadri Medical & General Store'}
                </h1>
                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-blue-700 bg-clip-text text-transparent">
                  “{home.heroSubtitle || '30 Years of Trusted Service — Your Health, Our Commitment.'}”
                </p>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {home.heroDescription ||
                  'Your trusted healthcare partner in Himmatpura, Hyderabad. We provide genuine branded medications, quality OTC remedies, daily wellness essentials, and attentive pharmacist support.'}
              </p>

              {/* Quick Trust Attributes */}
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  100% Genuine Medicines
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Open 7 Days a Week
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Himmatpura, Hyderabad
                </span>
              </div>

              {/* Prominent Action Buttons: Call Now, WhatsApp, Get Directions */}
              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                {/* 1. Call Now */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-white" />
                  <span>{home.callButtonText || 'Call Now'}</span>
                </a>

                {/* 2. WhatsApp */}
                <a
                  href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20would%20like%20to%20order%20medicines`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>{home.whatsappButtonText || 'WhatsApp'}</span>
                </a>

                {/* 3. Get Directions */}
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:shadow transition-all text-sm sm:text-base cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-rose-600" />
                  <span>{home.directionsButtonText || 'Get Directions'}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Backdrop Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white aspect-4/3 sm:aspect-16/11 group">
                  <img
                    src={home.heroImageUrl || '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg'}
                    alt="Quadri Medical & General Store Interior"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image path fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Measured Scrim for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase">
                      Himmatpura Landmark
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold leading-tight">
                      Quadri Medical &amp; General Store
                    </h3>
                    <p className="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-lg shrink-0">
                    30+
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Serving Hyderabad</p>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Since 1994</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Reliable Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {home.highlightsTitle || '30 Years of Trusted Healthcare'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {home.highlightsSubtitle || 'What sets Quadri Medical apart for our community in Hyderabad'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {home.highlights.map((card) => (
              <div
                key={card.id}
                className="p-6 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-white transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center">
                      <DynamicIcon name={card.iconName} className="w-6 h-6" />
                    </div>
                    {card.badge && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Pharmaceutical &amp; Healthcare Range
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                Our Services &amp; Products
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Authentic medicines and healthcare essentials available every day
              </p>
            </div>
            <button
              onClick={() => {
                setActivePage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-300 text-blue-800 font-semibold text-sm transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4 text-blue-700" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                {service.imageUrl && (
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-xs">
                      {service.category}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <DynamicIcon name={service.iconName} className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mt-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Authentic Stock
                    </span>
                    <a
                      href={`https://wa.me/91${cleanWa}?text=Inquiring%20about%20${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prescription Help Callout */}
          <div className="mt-10 bg-linear-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Fast WhatsApp Prescription Fulfillment
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Need Medicines Promptly? Send Us Your Prescription
                </h3>
                <p className="text-sm text-slate-300 max-w-xl">
                  Take a photo of your doctor’s slip and WhatsApp it to{' '}
                  <span className="text-white font-semibold">9885588593</span>. Our pharmacists will review it and keep your medicines ready for quick pickup or delivery.
                </p>
              </div>

              <a
                href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20here%20is%20my%20prescription%20photo%3A`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Prescription Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left explanatory */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Community Trust
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {home.whyChooseUsTitle || 'Why Our Community Trusts Us'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {home.whyChooseUsSubtitle ||
                  'Your reliable neighborhood medical store committed to your health and peace of mind since 1994.'}
              </p>
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Working Hours</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {settings.workingHours}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Store Address</p>
                    <p className="text-sm font-semibold text-slate-900">{settings.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right bento items */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {home.whyChooseUs.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 w-6 h-6 rounded-full flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORE IMAGE GALLERY */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Visual Tour
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {home.galleryTitle || 'Store Gallery & Dispensary'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {home.gallerySubtitle ||
                'Take a look inside our clean, well-stocked medical dispensary and healthcare retail aisles.'}
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedGalleryImage(image.url)}
                  className="group relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-lg transition-all cursor-pointer aspect-4/3"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-semibold">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-8 text-slate-500">
              <p>No store photos uploaded yet. Administrator can add photos in Admin Dashboard &rarr; Image Manager.</p>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-2 text-sm flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
            <img
              src={selectedGalleryImage}
              alt="Enlarged Store Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
