import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Settings {
  travelGoal: number;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean; 
  language: string;
  profilePicture: string | null;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ 
    travelGoal: 20, 
    notificationsEnabled: true, 
    darkModeEnabled: false, 
    language: 'en',
    profilePicture: null
  });
  
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (settings.darkModeEnabled) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [settings.darkModeEnabled]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/settings", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setSettings({
        travelGoal: data.travelGoal,
        notificationsEnabled: data.notificationsEnabled,
        darkModeEnabled: data.darkModeEnabled, 
        language: data.language || 'en',
        profilePicture: data.profilePicture || null
      });
      setLoading(false);
    })
    .catch(err => console.error("Chyba při načítání nastavení:", err));
  }, [token]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await fetch("http://localhost:8080/api/settings/update", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
      });
    } catch (error) {
      console.error("Chyba při ukládání nastavení:", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};