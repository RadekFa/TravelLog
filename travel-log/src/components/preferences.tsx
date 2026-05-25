import React from "react";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/componentsStyles/Preferences.scss";

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pref-svg">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pref-svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pref-svg">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);


const Preferences = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="preferences">
      <h2>{t('settings.preferences')}</h2>

      <div className="preference-item">
        <div className="pref-content">
          <BellIcon />
          <span>{t('settings.notifications')}</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
          />
          <span className="slider" />
        </label>
      </div>

      <hr />

      <div className="preference-item">
        <div className="pref-content">
          <MoonIcon />
          <span>{t('settings.dark_mode')}</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.darkModeEnabled}
            onChange={() => updateSettings({ darkModeEnabled: !settings.darkModeEnabled })}
          />
          <span className="slider" />
        </label>
      </div>

      <hr />

      <div className="preference-item language-select">
        <div className="pref-content">
          <GlobeIcon />
          <span id="language-label">{t('settings.language')}</span>
        </div>
        <select
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value })}
          aria-labelledby="language-label"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
  );
};

export default Preferences;