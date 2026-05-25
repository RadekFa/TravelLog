import { useLanguage } from "../context/LanguageContext";
import "../styles/componentsStyles/About.scss";

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="about-svg">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="about-svg">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="about">
      <h2>{t('settings.about_title')}</h2>

      <div className="about-item">
        <div className="about-content">
          <InfoIcon />
          <span>{t('settings.about_app')}</span>
        </div>
      </div>
      
      <hr />
      
      <div className="about-item" id="help-support">
        <div className="about-content">
          <HelpIcon />
          <span>{t('settings.help')}</span>
        </div>
      </div>
    </div>
  );
};

export default About;