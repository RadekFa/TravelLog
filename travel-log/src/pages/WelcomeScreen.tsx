import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import AuthForm from '../components/AuthForm'; 
import { motion } from 'framer-motion'; 
import '../styles/pagesStyles/WelcomeScreen.scss'; 
import { Map, BarChart3, BookOpen, MapPin, Mail, Phone, Star, StarHalf } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  // OPRAVA: Používáme isAuthenticated (dle tvého AuthContextu)
  const { isAuthenticated } = useAuth(); 
  const [isLogin, setIsLogin] = useState(true);

  // Pokud je uživatel přihlášen, přesměrujeme ho na mapu
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/map');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="welcome-page-container">
      
      {/* --- NAVBAR --- */}
      <nav className="welcome-navbar">
        <div className="nav-left">
          <img src="/logo.png" alt="TravelLog" className="nav-logo-img" />
          <h1 className="nav-title">Travel Log</h1>
        </div>
        
        <div className="nav-right">
          <button 
            className="get-started-btn" 
            onClick={() => {
              setIsLogin(false);
              // Scroll k formuláři
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
          className="background-video"
        >
          <source src="/WelcomeVideo.mp4" type="video/mp4" />
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

      {/* --- HOW IT WORKS --- */}
      <section className="how-it-works-section-white">
        <div className="inner-container">
          <div className="section-header-dark">
            <h2 className="section-title">How it Works</h2>
            <p className="section-subtitle-dark">Three simple steps to transform your travel memories into a stunning digital legacy.</p>
          </div>
          <div className="how-content-wrapper">
            <div className="steps-list">
              <div className="feature-step-card">
                <div className="card-accent" />
                <div className="step-text">
                  <h3>Join the Club</h3>
                  <p>Create your personal explorer profile in seconds and start your journey.</p>
                </div>
              </div>

              <div className="feature-step-card">
                <div className="card-accent" />
                <div className="step-text">
                  <h3>Mark Your Spots</h3>
                  <p>Use our interactive map to pin every country you've visited across the globe.</p>
                </div>
              </div>

              <div className="feature-step-card">
                <div className="card-accent" />
                <div className="step-text">
                  <h3>Watch it Grow</h3>
                  <p>Track your global coverage and unlock new travel milestones as you go.</p>
                </div>
              </div>
            </div>

            <div className="mac-preview">
              <img src="/mac2.png" alt="TravelLog App Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SEKCE --- */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">The world is your canvas</h2>
            <p className="section-subtitle">Powerful tools designed to help you track, visualize, and celebrate your global footprints.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box">
                <Map size={32} />
              </div>
              <h3>Interactive Map</h3>
              <p>Visualize your travels on a beautiful, high-contrast map. Color in the world as you explore new horizons.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <BarChart3 size={32} />
              </div>
              <h3>Detailed Stats</h3>
              <p>Get instant insights into your travel habits. See what percentage of each continent you've conquered.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <BookOpen size={32} />
              </div>
              <h3>Travel Log</h3>
              <p>Keep a list of all visited countries with dates and notes. Your personal atlas of memories.</p>
            </div>
          </div>
        </div>
      </section>


      {/* --- AUTH SEKCE --- */}
      <div className="auth-section" id="auth-section">
        <div className="auth-wrapper">
          {/* OPRAVA: Odstraněn handleAuthSubmit. AuthForm si řeší login() sám uvnitř. */}
          <AuthForm 
            isLogin={isLogin} 
            toggleAuth={() => setIsLogin(!isLogin)} 
          />
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-stats-section-clean">
        <div className="inner-container split-layout">
          
          <div className="left-content">
            <div className="section-header-accent">
              <h2 className="section-title-accent">Every Map <br />Tells a Story</h2>
              <p className="section-subtitle-accent">
                Join thousands of travelers who are already mapping their world with TravelLog.
              </p>
            </div>

            <div className="stats-cards-vertical">
              <div className="stat-card">
                <div className="card-accent" />
                <div className="stat-content">
                  <div className="stat-value">12k</div>
                  <div className="stat-desc">Happy & Satisfied Travelers</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="card-accent" />
                <div className="stat-content">
                  <div className="stat-value">10yrs</div>
                  <div className="stat-desc">Travel Industry Experience</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="card-accent" />
                <div className="stat-content">
                  <div className="stat-value">50+</div>
                  <div className="stat-desc">Destinations Covered</div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-content">
            <div className="reviews-stack">
              
              <div className="review-card">
                <p className="review-text">
                  "The best way to track my world travels. The interface is so clean and intuitive!"
                </p>
                <div className="card-footer">
                  <div className="author-info">
                    <img src="/profPicMan2.jpg" alt="Alex" className="author-photo" />
                    <div className="author-text">
                      <span className="author-name">Alex Miller</span>
                      <span className="author-role">Digital Nomad</span>
                    </div>
                  </div>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="review-card">
                <p className="review-text">
                  "Finally an app that makes my travel stats look professional and beautiful."
                </p>
                <div className="card-footer">
                  <div className="author-info">
                    <img src="/profPicWom.jpg" alt="Sarah" className="author-photo" />
                    <div className="author-text">
                      <span className="author-name">Sarah Jenkins</span>
                      <span className="author-role">Adventurer</span>
                    </div>
                  </div>
                  <div className="stars-row">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                    ))}
                    <StarHalf size={13} fill="#ffc107" color="#ffc107" />
                  </div>
                </div>
              </div>

              <div className="review-card">
                <p className="review-text">
                  "I love how easy it is to share my milestones with friends. Best travel companion!"
                </p>
                <div className="card-footer">
                  <div className="author-info">
                    <img src="/profPicMan.jpg" alt="James" className="author-photo" />
                    <div className="author-text">
                      <span className="author-name">James Wilson</span>
                      <span className="author-role">Backpacker</span>
                    </div>
                  </div>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#ffc107" color="#ffc107" />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <footer className="welcome-footer">
        <div className="footer-container">
          
          <div className="footer-column brand-info">
            <div className="footer-logo">
              <img src="/logo.png" alt="TravelLog" />
              <h3>TRAVEL LOG</h3>
            </div>
            <p>Your ultimate companion for mapping the world and keeping travel memories alive.</p>
            <div className="social-icons">
              <a href="#"><FaFacebook size={20} /></a>
              <a href="#"><FaInstagram size={20} /></a>
              <a href="#"><FaXTwitter size={20} /></a>
              <a href="#"><FaYoutube size={20} /></a>
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