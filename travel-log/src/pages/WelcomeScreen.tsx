import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../styles/pagesStyles/WelcomeScreen.scss'; 

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const AwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
);

const WelcomeScreen: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Animace loga: Střed -> Roh
  const logoX = useTransform(scrollYProgress, [0, 0.1], ["0vw", "-40vw"]); 
  const logoY = useTransform(scrollYProgress, [0, 0.1], ["0vh", "-44vh"]); 
  const logoScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.45]);

  // Video (Červený čtverec)
  const videoScale = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const videoOpacity = useTransform(scrollYProgress, [0.1, 0.15, 0.3, 0.4], [0, 1, 1, 0]);

  // Karty: Zóny (25% nástup, 50% statika, 25% mizení)
  const cardZone = [0.4, 0.5, 0.75, 0.85];

  const card1X = useTransform(scrollYProgress, cardZone, ["-120%", "0%", "0%", "-120%"]);
  const card1Opacity = useTransform(scrollYProgress, cardZone, [0, 1, 1, 0]);

  const card2Y = useTransform(scrollYProgress, cardZone, ["100px", "0px", "0px", "100px"]);
  const card2Opacity = useTransform(scrollYProgress, cardZone, [0, 1, 1, 0]);

  const card3X = useTransform(scrollYProgress, cardZone, ["120%", "0%", "0%", "120%"]);
  const card3Opacity = useTransform(scrollYProgress, cardZone, [0, 1, 1, 0]);

  const features = [
    { title: 'Interactive World Map', desc: "Mark all the countries you've visited on a beautiful, customizable map.", icon: <MapPinIcon /> },
    { title: 'Track Your Progress', desc: 'Detailed statistics by continents and regions at your fingertips.', icon: <TrendUpIcon /> },
    { title: 'Unlock Achievements', desc: 'Stay motivated by completing travel goals and earning unique badges.', icon: <AwardIcon /> }
  ];

  return (
    <div className='welcome-screen'>
      {/* LOGO */}
      <motion.div className="persistent-logo" style={{ x: logoX, y: logoY, scale: logoScale }}>
        <div className="logo-row">
          <img src="/logo.png" alt="Logo" />
          <h1>Travel Log</h1>
        </div>
      </motion.div>

      {/* VIDEO */}
      <motion.section className="fixed-video-placeholder" style={{ scale: videoScale, opacity: videoOpacity }}>
        <div className="red-square">
          <h2>Explore the world like never before</h2>
        </div>
      </motion.section>

      {/* KARTY (Fixní při animaci) */}
      <div className="fixed-features-wrapper">
        <div className="features-grid">
          <motion.div className="big-feature-card" style={{ x: card1X, opacity: card1Opacity }}>
            <div className="card-icon">{features[0].icon}</div>
            <h3>{features[0].title}</h3>
            <p>{features[0].desc}</p>
            <div className="card-decoration"></div>
          </motion.div>

          <motion.div className="big-feature-card" style={{ y: card2Y, opacity: card2Opacity }}>
            <div className="card-icon">{features[1].icon}</div>
            <h3>{features[1].title}</h3>
            <p>{features[1].desc}</p>
            <div className="card-decoration"></div>
          </motion.div>

          <motion.div className="big-feature-card" style={{ x: card3X, opacity: card3Opacity }}>
            <div className="card-icon">{features[2].icon}</div>
            <h3>{features[2].title}</h3>
            <p>{features[2].desc}</p>
            <div className="card-decoration"></div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL CONTENT */}
      <div className="scroll-flow-content">
        <div className="animation-spacer" />
        
        <motion.div 
            className="cta-area"
            style={{ opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]) }}
        >
          <button className="primary-btn">Create Your Map</button>
        </motion.div>
        <div className="final-spacer" />
      </div>
    </div>
  );
};

export default WelcomeScreen;