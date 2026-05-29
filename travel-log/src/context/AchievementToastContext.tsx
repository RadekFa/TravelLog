import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import '../styles/componentsStyles/AchievementToast.scss';

interface Achievement {
  id: number;
  title: string;
  description: string;
  svgIcon: string;
}

interface AchievementToastContextType {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementToastContext = createContext<AchievementToastContextType | undefined>(undefined);

export const AchievementToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Nyní používáme POLE (frontu), abychom mohli ukázat více odznaků pod sebou!
  const [toasts, setToasts] = useState<Achievement[]>([]);

  const showAchievement = useCallback((achievement: Achievement) => {
    setToasts((prev) => [...prev, achievement]);
    
    // Každý toast automaticky zmizí po 5 vteřinách (odebere první prvek fronty)
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 5000);
  }, []);

  const removeToast = (indexToRemove: number) => {
    setToasts((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <AchievementToastContext.Provider value={{ showAchievement }}>
      {children}
      
      {/* Kontejner pro všechny aktivní toasty */}
      <div className="achievement-toast-container">
        {toasts.map((toast, index) => (
          <AchievementToast 
            key={`${toast.id}-${index}-${Date.now()}`} 
            achievement={toast} 
            onClose={() => removeToast(index)} 
          />
        ))}
      </div>
    </AchievementToastContext.Provider>
  );
};

export const useAchievementToast = () => {
  const context = useContext(AchievementToastContext);
  if (context === undefined) {
    throw new Error('useAchievementToast must be used within an AchievementToastProvider');
  }
  return context;
};

const AchievementToast: React.FC<{ achievement: Achievement, onClose: () => void }> = ({ achievement, onClose }) => {
  return (
    <div className="achievement-toast" onClick={onClose}>
      <div className="toast-icon" dangerouslySetInnerHTML={{ __html: achievement.svgIcon }} />
      <div className="toast-content">
        <span className="toast-label">Achievement Unlocked!</span>
        <h4 className="toast-title">{achievement.title}</h4>
      </div>
    </div>
  );
};