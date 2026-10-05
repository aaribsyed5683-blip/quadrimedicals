import React from 'react';
import { useContent } from '../context/ContentContext';
import { Award, ShieldCheck, HeartPulse, Clock, MapPin, CheckCircle, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { content, setActivePage } = useContent();

  if (!content) return null;

  const { about, settings } = content;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>30 Years of Heritage · Established 1994</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {about.title || 'About Quadri Medical & General Store'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            {about.subtitle ||
              'A landmark of trust, care, and quality healthcare in Himmatpura, Hyderabad for 30 years.'}
          </p>
        </div>
      </section>

      {/* Main Story & Presentation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Story text */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Our Heritage &amp; Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {about.storyHeading || 'Three Decades of Serving Our Community'}
              </h2>

              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>{about.storyParagraph1}</p>
                <p>{about.storyParagraph2}</p>
                <p>{about.storyParagraph3}</p>
              </div>

              {/* Pharmacist pledge quote */}
              {about.pharmacistMessage && (
                <div className="p-5 rounded-xl bg-emerald-50/70 border-l-4 border-emerald-600 text-slate-800 text-sm sm:text-base italic leading-relaxed">
                  {about.pharmacistMessage}
                  <div className="mt-2 text-xs font-bold not-italic text-emerald-900 uppercase tracking-wider">
                    — Quadri Medical &amp; General Store Management
                  </div>
                </div>
              )}
            </div>

            {/* Banner/Store Image and Stats */}
            <div className="lg:col-span-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
              <div className="p-6 sm:p-8">
                <div className="rounded-xl overflow-hidden shadow-xs border border-slate-200 aspect-4/3 mb-6 bg-slate-200">
                  <img
                    src={about.bannerImageUrl || '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg'}
                    alt="Quadri Medical Store Interior"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {about.missionHeading || 'Our Mission & Ethical Commitment'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {about.missionText}
                  </p>
                </div>
              </div>

              {/* Key numbers / stats */}
              <div className="grid grid-cols-2 gap-px bg-slate-200 border-t border-slate-200">
                {(about.stats || []).map((stat, i) => (
                  <div key={i} className="bg-white p-4 text-center">
                    <p className="text-2xl font-extrabold text-blue-900">{stat.value}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Our Healthcare Values
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Built on Integrity &amp; Care
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Every customer interaction is guided by our three core principles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Uncompromising Quality</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We reject substandard or gray-market products. We only stock authentic, batch-verified pharmaceuticals procured from authorized channels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Patient-First Service</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We take the time to review your prescriptions, explain dosage timings, provide clear warnings, and guide you on generic alternatives if requested.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Neighborhood Accessibility</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Open 7 days a week from 9:00 AM to 11:30 PM with telephone and WhatsApp assistance for prompt emergency and maintenance medicine access.
            </p>
          </div>
        </div>

        {/* Location & Contact prompt */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">Visit Our Store in Himmatpura, Hyderabad</p>
              <p className="text-xs text-slate-500">{settings.address}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors cursor-pointer shrink-0"
          >
            View Map &amp; Contact Details &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
