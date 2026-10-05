export interface BusinessSettings {
  businessName: string;
  tagline: string;
  shortDescription: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  workingHours: string;
  footerText: string;
  logoUrl?: string;
  bannerNotice?: string;
  showBannerNotice: boolean;
}

export interface HighlightCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  imageUrl?: string;
  iconName: string;
  isPopular?: boolean;
  order: number;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  section: 'gallery' | 'hero' | 'about' | 'services';
  order: number;
  uploadedAt: string;
  sizeKb?: number;
}

export interface HomePageData {
  heroHeading: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroDescription: string;
  callButtonText: string;
  whatsappButtonText: string;
  directionsButtonText: string;
  heroImageUrl?: string;
  trustBadgeText: string;
  highlightsTitle: string;
  highlightsSubtitle: string;
  highlights: HighlightCard[];
  whyChooseUsTitle: string;
  whyChooseUsSubtitle: string;
  whyChooseUs: WhyChooseUsItem[];
  galleryTitle: string;
  gallerySubtitle: string;
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  bannerImageUrl?: string;
  missionHeading: string;
  missionText: string;
  pharmacistMessage: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface WebsiteContent {
  settings: BusinessSettings;
  home: HomePageData;
  about: AboutPageData;
  services: ServiceItem[];
  gallery: GalleryImage[];
}
