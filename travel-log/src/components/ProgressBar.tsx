import React, { useEffect, useState } from 'react';
import '../styles/componentsStyles/ProgressBar.scss'; 
import { useLanguage } from '../context/LanguageContext';

interface ProgressBarProps {
  visitedCount: number;
  travelGoal: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ visitedCount, travelGoal }) => {
  const { t } = useLanguage();
  const remainingCount = travelGoal - visitedCount;
  const targetProgress = (visitedCount / travelGoal) * 100;
  
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(Math.min(targetProgress, 100));
    }, 100);
    return () => clearTimeout(timeout);
  }, [targetProgress]); 

  return (
    <div className="goal-progress">
      
      {/* HLAVNÍ FLEXBOX OBAL PRO TEXTY */}
      <div className="progress-header-row">
        
        {/* LEVÁ STRANA: Nadpis a pod ním počítadlo s nápisem */}
        <div className="header-left-side">
          <h2 className='h2-progressBar'>{t('progress_bar.goal_title')}</h2>
          <span className="progress-count">
            {visitedCount}/{travelGoal} {t('progress_bar.countries')}
          </span>
        </div>

        {/* PRAVÁ STRANA: Zbývající země ve stejném řádku */}
        <div className="header-right-side">
          <span className="progress-remaining">
            {remainingCount > 0
              ? `${remainingCount} ${t('progress_bar.to_go')}`
              : t('progress_bar.reached')}
          </span>
        </div>

      </div>

      {/* ČÁRA POD TEXTY */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ 
            width: `${animatedProgress}%`,
            transition: 'width 1s ease-out' 
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;