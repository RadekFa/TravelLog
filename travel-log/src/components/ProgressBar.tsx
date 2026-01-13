import React, { useEffect, useState } from 'react';
import '../styles/componentsStyles/ProgressBar.scss'; 
import { visitedCountriesDB } from '../data/VisitedCountries';

const travelGoal = 20;
const visitedCount = visitedCountriesDB.length;
const remainingCount = travelGoal - visitedCount;
const targetProgress = (visitedCount / travelGoal) * 100;

const ProgressBar: React.FC = () => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(Math.min(targetProgress, 100));
    }, 100); // delay for smooth start
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="goal-progress">
      <h2>Travel Goal</h2>
      <span className="progress-count">
        {visitedCount}/{travelGoal} countries
      </span>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      <span className="progress-remaining">
        {remainingCount > 0
          ? `${remainingCount} countries to go!`
          : `Goal reached! 🎉`}
      </span>
    </div>
  );
};

export default ProgressBar;