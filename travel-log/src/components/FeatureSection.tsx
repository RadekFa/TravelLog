import React from 'react';
import '../styles/componentsStyles/FeatureSection.scss';

// --- Nové ikony podle obrázku ---

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const AwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

// --- Sociální ikony zůstávají stejné ---
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const FeatureSection: React.FC = () => {
  const features = [
    { 
      title: 'Interactive World Map', 
      desc: 'Mark all the countries you\'ve visited',
      icon: <MapPinIcon /> 
    },
    { 
      title: 'Track Your Progress', 
      desc: 'See your travel statistics by continent',
      icon: <TrendUpIcon /> 
    },
    { 
      title: 'Unlock Achievements', 
      desc: 'Complete travel goals and earn badges',
      icon: <AwardIcon /> 
    }
  ];

  return (
    <div className="features-info">
      <div className="features-mini-list">
        {features.map((f, i) => (
          <div className="mini-feature-item" key={i}>
            <div className="mini-icon">{f.icon}</div>
            <div className="mini-text">
              <p className='featureSection-title'>{f.title}</p>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="social-section">
        <p>Follow our journey</p>
        <div className="social-links">
          <a href="https://www.instagram.com/" className="social-item" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram"><InstagramIcon /></a>
          <a href="https://www.facebook.com/" className="social-item" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook"><FacebookIcon /></a>
          <a href="https://www.youtube.com/" className="social-item" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube"><YouTubeIcon /></a>
          <a href="https://x.com" className="social-item" target="_blank" rel="noopener noreferrer" aria-label="Visit our X"><XIcon/></a>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;