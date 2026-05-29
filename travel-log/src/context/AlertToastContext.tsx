import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import '../styles/componentsStyles/AlertToast.scss';

interface AlertToastType {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface AlertToastContextType {
  showAlert: (message: string, type?: 'error' | 'success' | 'info') => void;
}

const AlertToastContext = createContext<AlertToastContextType | undefined>(undefined);

export const AlertToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertToastType[]>([]);

  const showAlert = useCallback((message: string, type: 'error' | 'success' | 'info' = 'error') => {
    const newAlert: AlertToastType = {
      id: Date.now().toString(),
      message,
      type,
    };

    setAlerts((prev) => [...prev, newAlert]);
    
    // Alert sám zmizí po 4 vteřinách
    setTimeout(() => {
      setAlerts((prev) => prev.filter(alert => alert.id !== newAlert.id));
    }, 4000);
  }, []);

  const removeAlert = (idToRemove: string) => {
    setAlerts((prev) => prev.filter(alert => alert.id !== idToRemove));
  };

  return (
    <AlertToastContext.Provider value={{ showAlert }}>
      {children}
      
      <div className="alert-toast-container">
        {alerts.map((alert) => (
          <AlertToast 
            key={alert.id} 
            alert={alert} 
            onClose={() => removeAlert(alert.id)} 
          />
        ))}
      </div>
    </AlertToastContext.Provider>
  );
};

export const useAlertToast = () => {
  const context = useContext(AlertToastContext);
  if (context === undefined) {
    throw new Error('useAlertToast must be used within an AlertToastProvider');
  }
  return context;
};

const AlertToast: React.FC<{ alert: AlertToastType, onClose: () => void }> = ({ alert, onClose }) => {
  // Různé ikony podle typu alertu
  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      case 'error':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className={`alert-toast ${alert.type}`} onClick={onClose}>
      <div className="alert-icon">
        {getIcon()}
      </div>
      <div className="alert-content">
        {alert.message}
      </div>
    </div>
  );
};