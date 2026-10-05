import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WebsiteContent } from '../types/content';

interface ContentContextType {
  content: WebsiteContent | null;
  loading: boolean;
  error: string | null;
  activePage: 'home' | 'about' | 'services' | 'contact' | 'admin';
  setActivePage: (page: 'home' | 'about' | 'services' | 'contact' | 'admin') => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  isAdminAuthenticated: boolean;
  reloadContent: () => Promise<void>;
  updateContent: (updatedData: Partial<WebsiteContent>) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<'home' | 'about' | 'services' | 'contact' | 'admin'>('home');
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem('quadri_admin_token');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem('quadri_admin_token', token);
      setIsAdminAuthenticated(true);
    } else {
      localStorage.removeItem('quadri_admin_token');
      setIsAdminAuthenticated(false);
    }
  };

  // Fetch public website content
  const reloadContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Failed to load website content');
      const data = await res.json();
      setContent(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching content:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check admin token validity
  useEffect(() => {
    if (!adminToken) {
      setIsAdminAuthenticated(false);
      return;
    }

    fetch('/api/admin/check-auth', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsAdminAuthenticated(true);
        } else {
          setAdminToken(null);
        }
      })
      .catch(() => {
        setAdminToken(null);
      });
  }, [adminToken]);

  useEffect(() => {
    reloadContent();
  }, [reloadContent]);

  // Update content (admin only)
  const updateContent = async (updatedData: Partial<WebsiteContent>) => {
    if (!adminToken) {
      return { success: false, error: 'Unauthorized. Please log in as admin.' };
    }

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Failed to update content' };
      }

      await reloadContent();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating content' };
    }
  };

  const logoutAdmin = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch (e) {
        // Ignore network errors on logout
      }
    }
    setAdminToken(null);
    setActivePage('home');
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        activePage,
        setActivePage,
        adminToken,
        setAdminToken,
        isAdminAuthenticated,
        reloadContent,
        updateContent,
        logoutAdmin,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
