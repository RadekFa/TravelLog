import React, { useState, useEffect, Suspense } from 'react'; // PŘIDÁN Suspense
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
// ODSTRANĚN KLASICKÝ IMPORT: import AuthForm from '../components/AuthForm'; 
import { motion } from 'framer-motion'; 
import '../styles/pagesStyles/WelcomeScreen.scss'; 
import { Map, BarChart3, BookOpen, MapPin, Mail, Phone, Star, StarHalf } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

// PŘIDÁNO: Líné načítání formuláře (vyčlení Formik a Yup ze startovacího balíčku)
const AuthForm = React.lazy(() => import('../components/AuthForm'));

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); 
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/map');
    }
  }, [isAuthenticated, navigate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="welcome-page-container">
      
      {/* --- NAVBAR --- */}
      <nav className="welcome-navbar">
        <div className="nav-left" onClick={scrollToTop}>
          <img src="/logo.png" alt="TravelLog" className="nav-logo-img" />
          <h1 className="nav-title">Travel Log</h1>
        </div>
        
        <div className="nav-right">
          <button 
            className="get-started-btn" 
            onClick={() => {
              setIsLogin(false);
              document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION S VIDEEM --- */}
      <header className="hero-section">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster="/video-placeholder.webp"
          className="background-video"
          
        >
          <source src="/WelcomeVideo.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Mark every step of your journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Track visited countries, discover new destinations, and keep your travel memories in one place.
          </motion.p>
        </div>
      </header>

      <main>
        {/* --- HOW IT WORKS --- */}
        <section className="how-it-works-section-white">
          <div className="inner-container">
            <motion.div 
              className="section-header-dark"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">How it Works</h2>
              <p className="section-subtitle-dark">Three simple steps to transform your travel memories into a stunning digital legacy.</p>
            </motion.div>

            <div className="how-content-wrapper">
              <div className="steps-list">
                {[
                  { title: "Join the Club", desc: "Create your personal explorer profile in seconds and start your journey." },
                  { title: "Mark Your Spots", desc: "Use our interactive map to pin every country you've visited across the globe." },
                  { title: "Watch it Grow", desc: "Track your global coverage and unlock new travel milestones as you go." }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="feature-step-card"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="card-accent" />
                    <div className="step-text">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mac-preview"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <img src="/mac2.webp" alt="TravelLog App Preview" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SEKCE --- */}
        <section className="features-section">
          <div className="features-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">The world is your canvas</h2>
              <p className="section-subtitle">Powerful tools designed to help you track, visualize, and celebrate your global footprints.</p>
            </motion.div>

            <div className="features-grid">
              {[
                { icon: <Map size={32} />, title: "Interactive Map", desc: "Visualize your travels on a beautiful, high-contrast map. Color in the world as you explore new horizons." },
                { icon: <BarChart3 size={32} />, title: "Detailed Stats", desc: "Get instant insights into your travel habits. See what percentage of each continent you've conquered." },
                { icon: <BookOpen size={32} />, title: "Travel Log", desc: "Keep a list of all visited countries with dates and notes. Your personal atlas of memories." }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <div className="icon-box">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- AUTH SEKCE --- */}
        <motion.div 
          className="auth-section" 
          id="auth-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-wrapper">
            {/* PŘIDÁNO: Suspense obaluje líně načítaný formulář */}
            <Suspense fallback={<div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading form...</div>}>
              <AuthForm 
                isLogin={isLogin} 
                toggleAuth={() => setIsLogin(!isLogin)} 
              />
            </Suspense>
          </div>
        </motion.div>

        {/* Reviews */}
        <section className="reviews-stats-section-clean">
          <div className="inner-container split-layout">
            
            <div className="left-content">
              <motion.div 
                className="section-header-accent"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="section-title-accent">Every Map <br />Tells a Story</h2>
                <p className="section-subtitle-accent">
                  Join thousands of travelers who are already mapping their world with TravelLog.
                </p>
              </motion.div>

              <div className="stats-cards-vertical">
                {[
                  { val: "12k", desc: "Happy & Satisfied Travelers" },
                  { val: "10yrs", desc: "Travel Industry Experience" },
                  { val: "50+", desc: "Destinations Covered" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="stat-card"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="card-accent" />
                    <div className="stat-content">
                      <div className="stat-value">{stat.val}</div>
                      <div className="stat-desc">{stat.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="right-content">
              <div className="reviews-stack">
                {[
                  { name: "Alex Miller", role: "Digital Nomad", img: "/profPicMan2.webp", stars: 5, text: "The best way to track my world travels. The interface is so clean and intuitive!" },
                  { name: "Sarah Jenkins", role: "Adventurer", img: "/profPicWom.webp", stars: 4.5, text: "Finally an app that makes my travel stats look professional and beautiful." },
                  { name: "James Wilson", role: "Backpacker", img: "/profPicMan.webp", stars: 5, text: "I love how easy it is to share my milestones with friends. Best travel companion!" }
                ].map((rev, index) => (
                  <motion.div 
                    key={index}
                    className="review-card"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <p className="review-text">"{rev.text}"</p>
                    <div className="card-footer">
                      <div className="author-info">
                        <img src={rev.img} alt={rev.name} className="author-photo" />
                        <div className="author-text">
                          <span className="author-name">{rev.name}</span>
                          <span className="author-role">{rev.role}</span>
                        </div>
                      </div>
                      <div className="stars-row">
                        {[...Array(Math.floor(rev.stars))].map((_, i) => (
                          <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                        ))}
                        {rev.stars % 1 !== 0 && <StarHalf size={13} fill="#ffc107" color="#ffc107" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="welcome-footer">
        <div className="footer-container">
          
          <div className="footer-column brand-info">
            <div className="footer-logo">
              <img src="/logo.png" alt="TravelLog" />
              <h3>TRAVEL LOG</h3>
            </div>
            <p>Your ultimate companion for mapping the world and keeping travel memories alive.</p>
            <div className="social-icons">
              <a href="#" aria-label="Visit our Facebook page"><FaFacebook size={20} /></a>
              <a href="#" aria-label="Visit our Instagram page"><FaInstagram size={20} /></a>
              <a href="#" aria-label="Visit our X (Twitter) page"><FaXTwitter size={20} /></a>
              <a href="#" aria-label="Visit our YouTube channel"><FaYoutube size={20} /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Office Location</h4>
            <ul className="contact-list">
              <li><MapPin size={18} /> 123 Explorer Blvd, Prague, Czechia</li>
              <li><Mail size={18} /> hello@travellog.com</li>
              <li><Phone size={18} /> +420 123 456 789</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal & Support</h4>
            <ul className="footer-links">
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Settings</a></li>
              <li><a href="#">Support Center</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 TravelLog. All rights reserved. Created with Hearth by Explorers.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;