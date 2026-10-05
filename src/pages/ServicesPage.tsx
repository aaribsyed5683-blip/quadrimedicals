import React, { useState, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { ServiceItem } from '../types/content';
import { Search, MessageCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { content } = useContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  if (!content) return null;

  const { services, settings } = content;
  const cleanWa = (settings.whatsappNumber || '9885588593').replace(/[^\d]/g, '');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));
    return ['all', ...cats];
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services
      .sort((a, b) => a.order - b.order)
      .filter((s) => {
        const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
        const matchesSearch =
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.fullDescription && s.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-teal-950 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Comprehensive Pharmacy &amp; General Store
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            Our Healthcare Services &amp; Products
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Genuine medicines, surgical essentials, personal care, and baby products with dedicated pharmacist guidance.
          </p>

          {/* Quick Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services, products, or medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Filters Bar */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-8">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Services & Products' : cat}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Service image if provided */}
                  {service.imageUrl && (
                    <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800 shadow-2xs">
                        {service.category}
                      </div>
                      {service.isPopular && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <DynamicIcon name={service.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {service.title}
                        </h3>
                        {!service.imageUrl && (
                          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                            {service.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {service.shortDescription}
                    </p>

                    {service.fullDescription && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        {service.fullDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card footer with direct WhatsApp inquire button */}
                <div className="p-6 pt-0 mt-2">
                  <a
                    href={`https://wa.me/91${cleanWa}?text=Hello%20Quadri%20Medical%20Store%2C%20I%20would%20like%20to%20inquire%20about%3A%20${encodeURIComponent(
                      service.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                    <span>Inquire / Order on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 font-medium">No services found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-blue-700 font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Prescription Guidance Section */}
        <div className="mt-14 bg-white rounded-2xl border border-emerald-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Valid Doctor Prescriptions</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Schedule H &amp; X drugs are dispensed strictly against authentic registered doctor prescriptions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Storage Integrity</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Insulin, vaccines, and sensitive biologicals are stored in certified 2°C–8°C pharmaceutical chillers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Fast Phone Support</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Call our store directly on 9885588593 to verify medication availability before your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
