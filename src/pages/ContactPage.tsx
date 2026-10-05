import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { content } = useContent();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!content) return null;

  const { settings } = content;
  const phone1 = settings.phone1 || '9885588593';
  const phone2 = settings.phone2 || '8074992911';
  const address = settings.address || '20-4-367, Himmatpura Road, Hyderabad, T.G';
  const mapsUrl = settings.googleMapsUrl || 'https://maps.google.com/maps?q=17.3550829%2C78.4689213&z=17&hl=en';
  const embedUrl = settings.googleMapsEmbedUrl || 'https://maps.google.com/maps?q=17.3550829,78.4689213&hl=en&z=16&output=embed';
  const whatsappNumber = settings.whatsappNumber || '9885588593';
  const cleanWa = whatsappNumber.replace(/[^\d]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in your name, phone number, and message.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent directly to the store management. We will contact you shortly.',
      });
      setFormData({ name: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Unable to send message. Please call us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            Contact &amp; Store Location
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Reach out by phone, WhatsApp, or drop by our store in Himmatpura, Hyderabad.
          </p>
        </div>
      </section>

      {/* Main Grid: Direct Buttons, Info, Map, Contact Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Prominent Direct Contact Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Button 1: Call Phone 1 */}
          <a
            href={`tel:${phone1.replace(/\s+/g, '')}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Primary Store Line</p>
              <p className="text-base font-bold text-slate-900 leading-tight">Call {phone1}</p>
            </div>
          </a>

          {/* Button 2: Call Phone 2 */}
          <a
            href={`tel:${phone2.replace(/\s+/g, '')}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Secondary Line</p>
              <p className="text-base font-bold text-slate-900 leading-tight">Call {phone2}</p>
            </div>
          </a>

          {/* Button 3: WhatsApp */}
          <a
            href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20have%20an%20inquiry`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Instant Chat</p>
              <p className="text-base font-bold text-slate-900 leading-tight">WhatsApp Us</p>
            </div>
          </a>

          {/* Button 4: Get Directions */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-rose-500 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Navigation</p>
              <p className="text-base font-bold text-slate-900 leading-tight">Get Directions</p>
            </div>
          </a>
        </div>

        {/* Two-column layout: Form and Map Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Send a Message or Prescription Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Have a question about medicine availability or home delivery? Fill out the form below.
            </p>

            {status && (
              <div
                className={`mt-4 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammed Ahmed"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9885588593"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Message or Medicine Names <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please specify medication names, dosages, or any inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {submitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Google Map Embed & Details */}
          <div className="lg:col-span-6 space-y-6">
            {/* Store Address & Hours Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Store Location &amp; Hours
              </h3>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Registered Address:</span>
                    <span className="font-semibold text-slate-900">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Operating Hours:</span>
                    <span className="font-semibold text-slate-900">
                      {settings.workingHours || 'Monday – Sunday: 9:00 AM – 11:30 PM'}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>Google Maps: Himmatpura, Hyderabad (17.3550829, 78.4689213)</span>
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Full View
                </a>
              </div>
              <div className="w-full h-80 bg-slate-200 relative">
                <iframe
                  title="Quadri Medical & General Store Location"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
