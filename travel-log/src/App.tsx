import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

import WelcomeScreen from './pages/WelcomeScreen';
import MainPage from './pages/MainPage';
import CountryList from './pages/CountryList';
import CountryDetail from './pages/CountryDetail';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/countries"
        element={
          <ProtectedRoute>
            <CountryList />
          </ProtectedRoute>
        }
      />

      {/* ✅ detail země podle názvu */}
      <Route
        path="/country/:name"
        element={
          <ProtectedRoute>
            <CountryDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <AppContent />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
