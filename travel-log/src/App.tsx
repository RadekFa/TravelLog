import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { SettingsProvider, useSettings } from './context/SettingsContext'; // Přidán useSettings
import { LanguageProvider } from './context/LanguageContext';
import './styles/Main.scss'
import ScrollToTop from './components/ScrollToTop';

const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen'));
const MainPage = lazy(() => import('./pages/MainPage'));
const CountryList = lazy(() => import('./pages/CountryList'));
const CountryDetail = lazy(() => import('./pages/CountryDetail'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="loader">Loading...</div>
  </div>
);

// IZOLOVANÝ WRAPPER: Aplikuje třídu dark-theme-active pouze na vnitřní uživatelské stránky
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const themeClass = settings?.darkModeEnabled ? 'dark-theme-active' : 'light-theme-active';

  return (
    <div className={`app-theme-container ${themeClass}`} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/map" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. WELCOME SCREEN - Stojí mimo wrapper, takže je vždy ve světlém režimu */}
        <Route 
            path="/" 
            element={
                isAuthenticated 
                ? (user?.role === 'ROLE_ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/map" />) 
                : <WelcomeScreen />
            } 
        />
        
        {/* 2. UŽIVATELSKÉ STRÁNKY - Všechny jsou správně otevřeny i uzavřeny v ThemeWrapperu */}
        <Route path="/map" element={<ProtectedRoute><ThemeWrapper><MainPage /></ThemeWrapper></ProtectedRoute>} />
        <Route path="/countries" element={<ProtectedRoute><ThemeWrapper><CountryList /></ThemeWrapper></ProtectedRoute>} />
        <Route path="/country/:name" element={<ProtectedRoute><ThemeWrapper><CountryDetail /></ThemeWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ThemeWrapper><SettingsPage /></ThemeWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ThemeWrapper><ProfilePage /></ThemeWrapper></ProtectedRoute>} />
        
        {/* 3. ADMIN PANEL - Stojí mimo wrapper, takže zůstává striktně světlý */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    const runTest = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/test');
        const text = await response.text();
        console.log("Odpověď z backendu:", text);
      } catch (err) {
        console.error("Backend není dostupný:", err);
      }
    };
    runTest();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <SettingsProvider>
          <LanguageProvider>
            <TripProvider>
              <AppContent />
            </TripProvider>
          </LanguageProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;