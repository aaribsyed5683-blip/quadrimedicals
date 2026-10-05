import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Logo } from '../components/Logo';
import { ServiceItem, GalleryImage } from '../types/content';
import {
  Settings,
  Home,
  Info,
  Package,
  Image as ImageIcon,
  Mail,
  KeyRound,
  ExternalLink,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  MessageCircle,
  Eye,
  X,
  Menu,
} from 'lucide-react';

type AdminTab = 'settings' | 'home' | 'about' | 'services' | 'media' | 'messages' | 'security';

export const AdminDashboard: React.FC = () => {
  const { content, updateContent, logoutAdmin, setActivePage, adminToken } = useContent();

  const [currentTab, setCurrentTab] = useState<AdminTab>('settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Local form states for each section
  const [settingsForm, setSettingsForm] = useState(content?.settings || ({} as any));
  const [homeForm, setHomeForm] = useState(content?.home || ({} as any));
  const [aboutForm, setAboutForm] = useState(content?.about || ({} as any));
  const [servicesList, setServicesList] = useState<ServiceItem[]>(content?.services || []);
  const [galleryList, setGalleryList] = useState<GalleryImage[]>(content?.gallery || []);

  // Contact messages state
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Service Edit / Add modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Media Library Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSection, setUploadSection] = useState<'gallery' | 'hero' | 'about' | 'services'>('gallery');
  const [uploading, setUploading] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Security / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Keep state synced when content reloads
  useEffect(() => {
    if (content) {
      setSettingsForm(content.settings);
      setHomeForm(content.home);
      setAboutForm(content.about);
      setServicesList(content.services);
      setGalleryList(content.gallery);
    }
  }, [content]);

  // Load contact messages
  const fetchMessages = async () => {
    if (!adminToken) return;
    try {
      setLoadingMessages(true);
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'messages') {
      fetchMessages();
    }
  }, [currentTab, adminToken]);

  // Show auto-dismissing toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateContent({ settings: settingsForm });
    setSaving(false);
    if (res.success) {
      showToast('success', 'Website settings updated successfully! Changes are live on public website.');
    } else {
      showToast('error', res.error || 'Failed to update settings');
    }
  };

  // 2. Save Home Page
  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateContent({ home: homeForm });
    setSaving(false);
    if (res.success) {
      showToast('success', 'Home page content updated successfully!');
    } else {
      showToast('error', res.error || 'Failed to update home page');
    }
  };

  // 3. Save About Us
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateContent({ about: aboutForm });
    setSaving(false);
    if (res.success) {
      showToast('success', 'About Us page content updated successfully!');
    } else {
      showToast('error', res.error || 'Failed to update About Us content');
    }
  };

  // 4. Save Services (Add / Edit)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let updatedList = [...servicesList];
    if (isNewService) {
      const newService = {
        ...editingService,
        id: 's-' + Date.now(),
        order: updatedList.length + 1,
      };
      updatedList.push(newService);
    } else {
      updatedList = updatedList.map((s) => (s.id === editingService.id ? editingService : s));
    }

    setSaving(true);
    const res = await updateContent({ services: updatedList });
    setSaving(false);

    if (res.success) {
      setServicesList(updatedList);
      setEditingService(null);
      showToast('success', `Service "${editingService.title}" saved successfully!`);
    } else {
      showToast('error', res.error || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) return;
    const updatedList = servicesList.filter((s) => s.id !== id);
    setSaving(true);
    const res = await updateContent({ services: updatedList });
    setSaving(false);
    if (res.success) {
      setServicesList(updatedList);
      showToast('success', 'Service deleted successfully.');
    } else {
      showToast('error', res.error || 'Failed to delete service');
    }
  };

  const handleReorderService = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= servicesList.length) return;

    const list = [...servicesList];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    // Reassign order indices
    const updatedList = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setServicesList(updatedList);

    const res = await updateContent({ services: updatedList });
    if (res.success) {
      showToast('success', 'Services reordered successfully!');
    }
  };

  // 5. Media Management
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('error', 'Image size must be under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        setUploading(true);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            base64Data,
            filename: file.name,
            title: uploadTitle || file.name.replace(/\.[^/.]+$/, ''),
            section: uploadSection,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to upload image');

        setGalleryList([...galleryList, json.mediaItem]);
        setUploadTitle('');
        showToast('success', 'Image uploaded and added to Media Library!');
      } catch (err: any) {
        showToast('error', err.message || 'Error uploading file');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete image "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete image');

      setGalleryList(galleryList.filter((g) => g.id !== id));
      showToast('success', 'Image deleted from Media Library.');
    } catch (e: any) {
      showToast('error', e.message || 'Error deleting image');
    }
  };

  // 6. Messages Management
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read: !currentRead } : m)));
      }
    } catch (e) {
      showToast('error', 'Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        showToast('success', 'Message deleted.');
      }
    } catch (e) {
      showToast('error', 'Failed to delete message');
    }
  };

  // 7. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update password');

      showToast('success', 'Admin password changed successfully! Use your new password on next login.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast('error', err.message || 'Error updating password');
    } finally {
      setSaving(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-800 text-white border border-emerald-600'
              : 'bg-rose-800 text-white border border-rose-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-200" /> : <AlertCircle className="w-5 h-5 text-rose-200" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-md">
              <Logo size="sm" showText={false} customLogoUrl={settingsForm.logoUrl} />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base leading-none block">
                Quadri Medical &amp; General Store
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Admin Management Console
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* View Website Button (Instant Preview) */}
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View Public Website</span>
            <span className="sm:hidden">View Site</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Log out of Admin"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-20 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:block ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Content &amp; Site Controls
            </div>

            <button
              onClick={() => {
                setCurrentTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-blue-300" />
              <span>1. Website Settings</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('home');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-300" />
              <span>2. Home Page Editor</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('about');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'about'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4 text-cyan-300" />
              <span>3. About Us Editor</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('services');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'services'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 text-amber-300" />
              <span>4. Services Manager</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('media');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'media'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-violet-300" />
              <span>5. Media Library</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('messages');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                currentTab === 'messages'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-300" />
                <span>6. Contact Messages</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setCurrentTab('security');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                  currentTab === 'security'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4 text-yellow-400" />
                <span>Security &amp; Password</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-16 bg-black/50 z-10 lg:hidden"
          />
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
          {/* SECTION 1: WEBSITE SETTINGS */}
          {currentTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    1. Website Settings &amp; Business Info
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage core contact numbers, physical store address, and global site details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.businessName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tagline / Motto
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Primary Phone Number (Clickable)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone1 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Secondary Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone2 || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      WhatsApp Orders Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={settingsForm.workingHours || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Physical Store Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Google Maps Direct Navigation URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.googleMapsUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Google Maps Embed URL (Iframe src)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.googleMapsEmbedUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Website Footer Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.footerText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Top Announcement Notice Bar
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.showBannerNotice ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, showBannerNotice: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settingsForm.bannerNotice || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bannerNotice: e.target.value })}
                    placeholder="e.g. Prescription orders and home delivery inquiries are welcome via WhatsApp or Call!"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </form>
            </div>
          )}

          {/* SECTION 2: HOME PAGE EDITOR */}
          {currentTab === 'home' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    2. Home Page Content Editor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Customize Hero headlines, Call-To-Action buttons, and highlight cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveHome}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Home Page'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveHome} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-700">
                    Hero Section
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Main Heading
                      </label>
                      <input
                        type="text"
                        value={homeForm.heroHeading || ''}
                        onChange={(e) => setHomeForm({ ...homeForm, heroHeading: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={homeForm.heroSubtitle || ''}
                        onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Description Text
                    </label>
                    <textarea
                      rows={3}
                      value={homeForm.heroDescription || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, heroDescription: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Call Button Label
                      </label>
                      <input
                        type="text"
                        value={homeForm.callButtonText || ''}
                        onChange={(e) => setHomeForm({ ...homeForm, callButtonText: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp Button Label
                      </label>
                      <input
                        type="text"
                        value={homeForm.whatsappButtonText || ''}
                        onChange={(e) => setHomeForm({ ...homeForm, whatsappButtonText: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Directions Button Label
                      </label>
                      <input
                        type="text"
                        value={homeForm.directionsButtonText || ''}
                        onChange={(e) => setHomeForm({ ...homeForm, directionsButtonText: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hero Image URL (from Media Library or local asset)
                    </label>
                    <input
                      type="text"
                      value={homeForm.heroImageUrl || ''}
                      onChange={(e) => setHomeForm({ ...homeForm, heroImageUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                {/* Highlights Editor */}
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-700">
                    Highlights Cards (4 Key Pillars)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(homeForm.highlights || []).map((card: any, idx: number) => (
                      <div key={card.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Card 0{idx + 1}</span>
                          <input
                            type="text"
                            placeholder="Badge text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const updated = [...homeForm.highlights];
                              updated[idx] = { ...updated[idx], badge: e.target.value };
                              setHomeForm({ ...homeForm, highlights: updated });
                            }}
                            className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const updated = [...homeForm.highlights];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setHomeForm({ ...homeForm, highlights: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold bg-white"
                        />
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => {
                            const updated = [...homeForm.highlights];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setHomeForm({ ...homeForm, highlights: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 3: ABOUT US EDITOR */}
          {currentTab === 'about' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    3. About Us Content Editor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Edit the 30-year heritage story, mission, and pharmacist commitment message.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveAbout}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save About Us'}</span>
                </button>
              </div>

              <form onSubmit={handleSaveAbout} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={aboutForm.title || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Story Main Heading
                    </label>
                    <input
                      type="text"
                      value={aboutForm.storyHeading || ''}
                      onChange={(e) => setAboutForm({ ...aboutForm, storyHeading: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Story Paragraph 1 (Establishment &amp; 30 Years)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.storyParagraph1 || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyParagraph1: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Story Paragraph 2 (Commitment to Genuine Medicines)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.storyParagraph2 || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyParagraph2: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Story Paragraph 3 (Patient Guidance &amp; Care)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutForm.storyParagraph3 || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyParagraph3: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pharmacist &amp; Store Management Quote
                  </label>
                  <textarea
                    rows={2}
                    value={aboutForm.pharmacistMessage || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, pharmacistMessage: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    About Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={aboutForm.bannerImageUrl || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, bannerImageUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </form>
            </div>
          )}

          {/* SECTION 4: SERVICES MANAGER */}
          {currentTab === 'services' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    4. Services &amp; Products Manager
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Add new services, edit descriptions, upload images, and reorder.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewService(true);
                    setEditingService({
                      id: '',
                      title: '',
                      shortDescription: '',
                      fullDescription: '',
                      category: 'Medicines',
                      iconName: 'Pill',
                      order: servicesList.length + 1,
                      isPopular: false,
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Services List Table / Cards */}
              <div className="space-y-3">
                {servicesList.map((service, index) => (
                  <div
                    key={service.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                        0{index + 1}
                      </div>
                      {service.imageUrl && (
                        <img
                          src={service.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {service.title}
                          </h4>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleReorderService(index, 'up')}
                        disabled={index === 0}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorderService(index, 'down')}
                        disabled={index === servicesList.length - 1}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsNewService(false);
                          setEditingService(service);
                        }}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Edit / Add Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-bold text-lg text-slate-900">
                        {isNewService ? 'Add New Service' : 'Edit Service'}
                      </h3>
                      <button
                        onClick={() => setEditingService(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveService} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Service Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                            placeholder="e.g. Medicines, First Aid"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Icon Name
                          </label>
                          <select
                            value={editingService.iconName}
                            onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                          >
                            <option value="Pill">Pill</option>
                            <option value="ShieldPlus">ShieldPlus</option>
                            <option value="HeartHandshake">HeartHandshake</option>
                            <option value="Sparkles">Sparkles</option>
                            <option value="Baby">Baby</option>
                            <option value="Cross">Cross</option>
                            <option value="Activity">Activity</option>
                            <option value="ShoppingBag">ShoppingBag</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Short Description *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={editingService.shortDescription}
                          onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Description (Optional Details)
                        </label>
                        <textarea
                          rows={3}
                          value={editingService.fullDescription || ''}
                          onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Image URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingService.imageUrl || ''}
                          onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                          placeholder="/src/assets/images/... or uploaded URL"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isPopular"
                          checked={editingService.isPopular || false}
                          onChange={(e) => setEditingService({ ...editingService, isPopular: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <label htmlFor="isPopular" className="text-xs font-medium text-slate-700">
                          Mark as Featured / Popular Service
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold cursor-pointer"
                        >
                          {saving ? 'Saving...' : 'Save Service'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: IMAGE MANAGER & MEDIA LIBRARY */}
          {currentTab === 'media' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  5. Image Manager &amp; Media Library
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Upload new store photos, preview, replace, or delete photos across sections.
                </p>
              </div>

              {/* Upload Form Box */}
              <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    Upload New Image to Website
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports JPG, JPEG, PNG, and WebP up to 20MB.
                  </p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Image Title / Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Front Store View"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Target Section
                    </label>
                    <select
                      value={uploadSection}
                      onChange={(e: any) => setUploadSection(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="gallery">Store Gallery</option>
                      <option value="hero">Hero Background</option>
                      <option value="about">About Us Banner</option>
                      <option value="services">Services Catalog</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-all">
                    <span>{uploading ? 'Uploading & Processing...' : 'Choose Image File to Upload'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Current Store Images &amp; Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {galleryList.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs group flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold uppercase">
                          {img.section || 'gallery'}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <p className="font-bold text-xs text-slate-900 truncate" title={img.title}>
                          {img.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate font-mono">
                          {img.url}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setPreviewMediaUrl(img.url)}
                            className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(img.id, img.title)}
                            className="text-xs text-rose-600 font-semibold hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Preview Modal */}
              {previewMediaUrl && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
                  onClick={() => setPreviewMediaUrl(null)}
                >
                  <div className="relative max-w-3xl w-full flex flex-col items-center">
                    <button
                      onClick={() => setPreviewMediaUrl(null)}
                      className="absolute -top-10 right-0 text-white hover:text-slate-300 flex items-center gap-1 text-sm cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                      <span>Close</span>
                    </button>
                    <img
                      src={previewMediaUrl}
                      alt="Preview"
                      className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: CONTACT MESSAGES */}
          {currentTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    6. Customer Contact Messages
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Inquiries and prescription requests submitted through the public website.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  Refresh Messages
                </button>
              </div>

              {loadingMessages ? (
                <div className="text-center py-12 text-slate-500 text-sm">Loading messages...</div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.read
                          ? 'bg-slate-50/70 border-slate-200'
                          : 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{msg.name}</h4>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Phone className="w-3.5 h-3.5 text-blue-700" />
                        <a
                          href={`tel:${msg.phone}`}
                          className="text-xs font-bold text-blue-800 hover:underline"
                        >
                          {msg.phone}
                        </a>
                        <span className="text-slate-300">·</span>
                        <a
                          href={`https://wa.me/91${msg.phone.replace(/[^\d]/g, '')}?text=Hello%20${encodeURIComponent(
                            msg.name
                          )}%2C%20this%20is%20Quadri%20Medical%20Store%20following%20up%20on%20your%20message`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>

                      <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed mb-3">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
                  <p>No customer messages received yet.</p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 7: SECURITY & PASSWORD */}
          {currentTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 max-w-xl">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Admin Security &amp; Password
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Change the password used to access this Admin Management Console.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                >
                  {saving ? 'Updating Password...' : 'Update Admin Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
