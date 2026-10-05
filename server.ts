import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper for password hashing
function hashPassword(password: string, salt = 'quadri_salt_2026'): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// In-memory active admin sessions
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function generateSessionToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  activeSessions.set(token, { username, expiresAt });
  return token;
}

// Middleware to verify admin token
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }
  next();
}

// Default Initial Store Data
const defaultStore = {
  admin: {
    username: 'admin',
    passwordHash: hashPassword('quadri1994'),
  },
  settings: {
    businessName: 'Quadri Medical & General Store',
    tagline: '30 Years of Trusted Service — Your Health, Our Commitment.',
    shortDescription: 'Dedicated to community well-being with genuine quality medicines, healthcare essentials, and compassionate personal service for over three decades in Hyderabad.',
    phone1: '9885588593',
    phone2: '8074992911',
    whatsappNumber: '9885588593',
    address: '20-4-367, Himmatpura Road, Hyderabad, T.G',
    googleMapsUrl: 'https://maps.google.com/maps?q=17.3550829%2C78.4689213&z=17&hl=en',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=17.3550829,78.4689213&hl=en&z=16&output=embed',
    workingHours: 'Monday – Sunday: 9:00 AM – 11:30 PM',
    footerText: '30 Years of Trusted Service — Your Health, Our Commitment. Serving generations in Hyderabad with genuine medicines and dependable healthcare products.',
    showBannerNotice: true,
    bannerNotice: 'Prescription orders and home delivery inquiries are welcome via WhatsApp or Call!',
  },
  home: {
    heroHeading: 'Quadri Medical & General Store',
    heroHighlight: '30 Years of Trusted Service',
    heroSubtitle: 'Your Health, Our Commitment.',
    heroDescription: 'Providing Himmatpura and Greater Hyderabad with authentic prescription medicines, wellness essentials, baby care, and everyday healthcare products with trusted pharmacist guidance.',
    callButtonText: 'Call Now',
    whatsappButtonText: 'WhatsApp',
    directionsButtonText: 'Get Directions',
    heroImageUrl: '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg',
    trustBadgeText: 'Since 1994 · Over 30 Years in Himmatpura, Hyderabad',
    highlightsTitle: 'Trusted Healthcare Standards',
    highlightsSubtitle: 'What sets Quadri Medical apart for our community over three decades',
    highlights: [
      {
        id: 'h-1',
        title: '30 Years of Trusted Service',
        description: 'Serving generations of families with dependable healthcare, integrity, and personal attention since 1994.',
        iconName: 'Award',
        badge: '30+ Years',
      },
      {
        id: 'h-2',
        title: '100% Quality Medicines',
        description: 'Direct procurement from certified pharmaceutical companies and licensed distributors ensures absolute authenticity.',
        iconName: 'ShieldCheck',
        badge: 'Genuine',
      },
      {
        id: 'h-3',
        title: 'General Healthcare Products',
        description: 'From baby care and mother care to daily nutrition, skin wellness, and first aid supplies for your entire family.',
        iconName: 'HeartPulse',
        badge: 'Complete Care',
      },
      {
        id: 'h-4',
        title: 'Customer-Focused Service',
        description: 'Courteous staff, dosage explanations, instant phone support, and friendly neighborhood pharmacy assistance.',
        iconName: 'Users',
        badge: 'Dedicated',
      },
    ],
    whyChooseUsTitle: 'Why Our Community Trusts Us',
    whyChooseUsSubtitle: 'Your reliable neighborhood medical store committed to your health and peace of mind.',
    whyChooseUs: [
      {
        id: 'w-1',
        title: 'Certified & Authentic Medications',
        description: 'Every prescription medication is securely stored and sourced only from authorized, licensed pharmaceutical channels.',
        iconName: 'CheckCircle2',
      },
      {
        id: 'w-2',
        title: 'Open 7 Days with Extended Hours',
        description: 'We are open from 9:00 AM to 11:30 PM every single day of the week, so you never have to worry during health emergencies.',
        iconName: 'Clock',
      },
      {
        id: 'w-3',
        title: 'Quick WhatsApp Prescription Orders',
        description: 'Simply snap a photo of your doctor prescription and send it to us on WhatsApp for fast checking and packing.',
        iconName: 'MessageSquare',
      },
      {
        id: 'w-4',
        title: 'Affordable & Fair Pricing',
        description: 'Honest pricing on branded and generic pharmaceuticals, surgical products, and everyday health supplies.',
        iconName: 'DollarSign',
      },
    ],
    galleryTitle: 'Store Gallery & Dispensary',
    gallerySubtitle: 'Take a look inside our clean, well-stocked medical dispensary and healthcare retail aisles.',
  },
  about: {
    title: 'About Quadri Medical & General Store',
    subtitle: 'A landmark of trust, care, and quality healthcare in Himmatpura, Hyderabad for 30 years.',
    storyHeading: 'Three Decades of Serving Our Community',
    storyParagraph1: 'Established with a foundational mission to make authentic medications and dependable healthcare products readily accessible, Quadri Medical & General Store has been a cornerstone of Himmatpura, Hyderabad for over 30 years.',
    storyParagraph2: 'Over the past three decades, medical science and retail have evolved, but our core pledge has remained constant: prioritizing patient health above all else. Every tablet, syrup, and healthcare product on our shelves is procured exclusively from verified distributors to guarantee genuine efficacy.',
    storyParagraph3: 'We believe a medical store is not merely a retail outlet, but an essential community resource. Our experienced staff takes time to understand your needs, explain dosage instructions carefully, and ensure you receive the right care for your loved ones.',
    bannerImageUrl: '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg',
    missionHeading: 'Our Mission & Ethical Commitment',
    missionText: 'To safeguard our community’s well-being by providing 100% authentic medicines, accessible prices, transparent advice, and respectful, personalized service to every customer who walks through our doors.',
    pharmacistMessage: '“Your health and trust are our most valuable assets. Whether you need an urgent prescription or everyday health essentials, our doors and phone lines are always open to assist you.”',
    stats: [
      { label: 'Years of Service', value: '30+' },
      { label: 'Families Served', value: '50,000+' },
      { label: 'Genuine Products', value: '100%' },
      { label: 'Days Open', value: '365 Days/Yr' },
    ],
  },
  services: [
    {
      id: 's-1',
      title: 'Prescription Medicines',
      shortDescription: 'Allopathic branded and generic prescription medications dispensed with precision by experienced professionals.',
      fullDescription: 'We stock a comprehensive inventory of doctor-prescribed medications across cardiology, diabetology, neurology, pediatrics, dermatology, and general medicine. All medicines are stored under strict temperature-controlled standards.',
      category: 'Medicines',
      iconName: 'Pill',
      imageUrl: '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg',
      isPopular: true,
      order: 1,
    },
    {
      id: 's-2',
      title: 'Over-the-Counter (OTC) Medicines',
      shortDescription: 'Safe, verified remedies for cold, fever, cough, acidity, headache, allergies, and minor pain relief.',
      fullDescription: 'Quick access to reliable OTC remedies for routine ailments. Our staff is ready to help explain appropriate dosages, indications, and precautions for safe home recovery.',
      category: 'Medicines',
      iconName: 'ShieldPlus',
      isPopular: true,
      order: 2,
    },
    {
      id: 's-3',
      title: 'General Healthcare Products',
      shortDescription: 'Vitamins, minerals, nutritional supplements, immunity boosters, and diabetic-friendly nutritional essentials.',
      fullDescription: 'Support your daily energy and vitality with certified multivitamins, calcium supplements, protein powders, herbal wellness items, and specialized dietary products for all age groups.',
      category: 'Healthcare',
      iconName: 'HeartHandshake',
      imageUrl: '/src/assets/images/store_wellness_aisle_1791180376531.jpg',
      isPopular: true,
      order: 3,
    },
    {
      id: 's-4',
      title: 'Personal Care & Hygiene',
      shortDescription: 'Dermatological skin care, antiseptic soaps, oral hygiene, shampoos, and daily personal grooming products.',
      fullDescription: 'Comprehensive selection of personal hygiene and skincare brands, medicated cleansers, moisturizers, dental care, hand sanitizers, and daily grooming supplies.',
      category: 'Personal Care',
      iconName: 'Sparkles',
      order: 4,
    },
    {
      id: 's-5',
      title: 'Baby Care & Mother Care',
      shortDescription: 'Baby formulas, diapers, gentle wipes, feeding bottles, baby skincare, and postpartum maternal wellness.',
      fullDescription: 'Trusted pediatrician-recommended baby care essentials, baby nutrition, feeding accessories, gentle lotions, diaper rash creams, and maternal health aids.',
      category: 'Baby Care',
      iconName: 'Baby',
      imageUrl: '/src/assets/images/store_wellness_aisle_1791180376531.jpg',
      isPopular: true,
      order: 5,
    },
    {
      id: 's-6',
      title: 'First Aid & Surgical Supplies',
      shortDescription: 'Antiseptic liquids, sterile bandages, gauze, surgical tapes, cotton, crepe bandages, and burn dressings.',
      fullDescription: 'Equip your home, office, or vehicle with essential first-aid necessities. We carry medical-grade dressing materials, antiseptic solutions (Dettol, Betadine), and emergency wound care products.',
      category: 'First Aid',
      iconName: 'Cross',
      order: 6,
    },
    {
      id: 's-7',
      title: 'Health Monitoring Devices',
      shortDescription: 'Digital BP monitors, pulse oximeters, blood glucose meters, test strips, and digital thermometers.',
      fullDescription: 'Accurate, simple-to-use at-home diagnostic equipment. We help you choose the right monitoring device and supply replacement strips, lancets, and batteries.',
      category: 'Devices',
      iconName: 'Activity',
      order: 7,
    },
    {
      id: 's-8',
      title: 'Daily General Store Essentials',
      shortDescription: 'Oral rehydration salts, energy drinks, sanitizers, household wellness items, and daily lifestyle sundries.',
      fullDescription: 'Convenient general-store essentials so you can pick up daily items together with your medical prescriptions in one convenient neighborhood stop.',
      category: 'General Store',
      iconName: 'ShoppingBag',
      order: 8,
    },
  ],
  gallery: [
    {
      id: 'g-1',
      title: 'Main Pharmacy & Medicine Dispensary',
      url: '/src/assets/images/hero_pharmacy_interior_1791180363962.jpg',
      section: 'gallery',
      order: 1,
      uploadedAt: '2026-10-05T00:00:00.000Z',
    },
    {
      id: 'g-2',
      title: 'Healthcare & Wellness Aisles',
      url: '/src/assets/images/store_wellness_aisle_1791180376531.jpg',
      section: 'gallery',
      order: 2,
      uploadedAt: '2026-10-05T00:00:00.000Z',
    },
  ],
  messages: [
    {
      id: 'msg-seed-1',
      name: 'Mohammed Farhan',
      phone: '9849012345',
      message: 'Hello, do you have continuous glucose monitoring sensors and diabetic test strips in stock? Can I pick them up this evening?',
      createdAt: '2026-10-04T18:30:00.000Z',
      read: false,
    },
    {
      id: 'msg-seed-2',
      name: 'Dr. K. Srinivas',
      phone: '9988776655',
      message: 'Inquiring about home delivery of monthly blood pressure medications for elderly parents residing near Himmatpura.',
      createdAt: '2026-10-03T11:15:00.000Z',
      read: true,
    },
  ],
};

// Initialize file store if missing
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store file, falling back to defaults:', err);
  }
  saveStore(defaultStore);
  return defaultStore;
}

function saveStore(data: any) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}

// Request parsers with 25MB limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/src/assets', express.static(path.resolve(process.cwd(), 'src/assets')));

// PUBLIC ROUTES

// 1. Get public website content
app.get('/api/content', (req, res) => {
  const store = loadStore();
  // Never expose admin password or private messages in public content API
  const publicContent = {
    settings: store.settings,
    home: store.home,
    about: store.about,
    services: store.services,
    gallery: store.gallery,
  };
  res.json(publicContent);
});

// 2. Submit customer contact message
app.post('/api/contact', (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: 'Name, phone number, and message are all required.' });
    return;
  }

  const cleanPhone = String(phone).replace(/[^\d+]/g, '');
  if (cleanPhone.length < 8) {
    res.status(400).json({ error: 'Please provide a valid phone number.' });
    return;
  }

  const store = loadStore();
  const newMessage = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: String(name).trim(),
    phone: String(phone).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  store.messages = [newMessage, ...(store.messages || [])];
  saveStore(store);

  res.status(201).json({ success: true, message: 'Message submitted successfully' });
});

// ADMIN AUTHENTICATION ROUTES

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const store = loadStore();

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const inputHash = hashPassword(password);
  if (username !== store.admin.username || inputHash !== store.admin.passwordHash) {
    res.status(401).json({ error: 'Invalid admin username or password' });
    return;
  }

  const token = generateSessionToken(username);
  res.json({
    success: true,
    token,
    username,
    message: 'Admin authenticated successfully',
  });
});

// Check current admin auth status
app.get('/api/admin/check-auth', requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Change admin password
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const store = loadStore();

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters long' });
    return;
  }

  const currentHash = hashPassword(currentPassword);
  if (currentHash !== store.admin.passwordHash) {
    res.status(401).json({ error: 'Incorrect current password' });
    return;
  }

  store.admin.passwordHash = hashPassword(newPassword);
  saveStore(store);

  res.json({ success: true, message: 'Admin password updated successfully' });
});

// PROTECTED ADMIN CONTENT ROUTES

// 1. Update full or partial content (settings, home, about, services, gallery)
app.put('/api/admin/content', requireAdmin, (req, res) => {
  const { settings, home, about, services, gallery } = req.body;
  const store = loadStore();

  if (settings) store.settings = { ...store.settings, ...settings };
  if (home) store.home = { ...store.home, ...home };
  if (about) store.about = { ...store.about, ...about };
  if (services) store.services = services;
  if (gallery) store.gallery = gallery;

  saveStore(store);
  res.json({ success: true, message: 'Website content updated successfully' });
});

// 2. Upload image via base64
app.post('/api/admin/upload', requireAdmin, (req, res) => {
  const { base64Data, filename, title, section } = req.body;

  if (!base64Data || !filename) {
    res.status(400).json({ error: 'Base64 image data and filename are required' });
    return;
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image data format' });
      return;
    }

    const mimeType = matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');

    // Determine extension
    let extension = 'jpg';
    if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';
    else if (mimeType.includes('jpeg')) extension = 'jpg';

    const safeBaseName = filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const finalFilename = `${Date.now()}_${safeBaseName}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);

    fs.writeFileSync(filePath, dataBuffer);

    const imageUrl = `/uploads/${finalFilename}`;
    const store = loadStore();

    const newMediaItem = {
      id: 'img-' + Date.now(),
      title: title || filename.replace(/\.[^/.]+$/, ''),
      url: imageUrl,
      section: section || 'gallery',
      order: (store.gallery?.length || 0) + 1,
      uploadedAt: new Date().toISOString(),
      sizeKb: Math.round(dataBuffer.length / 1024),
    };

    store.gallery = [...(store.gallery || []), newMediaItem];
    saveStore(store);

    res.json({
      success: true,
      mediaItem: newMediaItem,
      url: imageUrl,
      message: 'Image uploaded and saved successfully',
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to process and save image: ' + err.message });
  }
});

// 3. Delete image from media library and disk
app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const store = loadStore();

  const itemIndex = store.gallery?.findIndex((g: any) => g.id === id);
  if (itemIndex === -1 || itemIndex === undefined) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  const [removedItem] = store.gallery.splice(itemIndex, 1);
  saveStore(store);

  // If local uploaded file, delete from disk
  if (removedItem.url.startsWith('/uploads/')) {
    const localFileName = path.basename(removedItem.url);
    const localFilePath = path.join(UPLOADS_DIR, localFileName);
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (e) {
        console.warn('Could not remove file from disk:', e);
      }
    }
  }

  res.json({ success: true, message: 'Image deleted successfully' });
});

// 4. Contact messages admin endpoints
app.get('/api/admin/messages', requireAdmin, (req, res) => {
  const store = loadStore();
  res.json({ messages: store.messages || [] });
});

app.patch('/api/admin/messages/:id/read', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  const store = loadStore();

  const msg = store.messages?.find((m: any) => m.id === id);
  if (!msg) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  msg.read = typeof read === 'boolean' ? read : !msg.read;
  saveStore(store);

  res.json({ success: true, message: 'Message status updated', msg });
});

app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const store = loadStore();

  const index = store.messages?.findIndex((m: any) => m.id === id);
  if (index === -1 || index === undefined) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  store.messages.splice(index, 1);
  saveStore(store);

  res.json({ success: true, message: 'Message deleted successfully' });
});

// START SERVER WITH VITE
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quadri Medical & General Store server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
