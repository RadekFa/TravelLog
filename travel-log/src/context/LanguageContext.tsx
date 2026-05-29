import React, { createContext, useContext, type ReactNode } from 'react';
import { useSettings } from './SettingsContext';
// IMPORT DAT ZE SLOŽKY DATA
import { translationsData } from '../data/translations'; 

export type LanguageCode = 'en' | 'es' | 'de';

interface LanguageContextType {
  lang: LanguageCode;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  
  // Zdroj pravdy pro aktuální jazyk
  const currentLang = (settings.language as LanguageCode) || 'en';

  const t = (key: string): string => {
    const keys = key.split('.');
    // Používáme importovaná data
    let result = (translationsData as any)[currentLang];
    
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback: Pokud klíč neexistuje, vrátíme název klíče (poslední část)
        return keys[keys.length - 1];
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang: currentLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};