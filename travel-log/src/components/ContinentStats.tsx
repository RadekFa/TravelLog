import React from 'react';
import '../styles/componentsStyles/ContinentsStats.scss'; 
import { useLanguage } from '../context/LanguageContext';

interface Country {
  name: string;
  continent: string;
}

interface ContinentStatsProps {
  visitedCountries: Country[];
  allCountries: Country[];
}

const ContinentStats: React.FC<ContinentStatsProps> = ({ visitedCountries, allCountries }) => {
  const { t } = useLanguage();

  const continentTotals = allCountries.reduce((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueVisitedNames = new Set(visitedCountries.map(c => c.name));
  const visitedByContinent = allCountries.reduce((acc, c) => {
    if (uniqueVisitedNames.has(c.name)) {
      acc[c.continent] = (acc[c.continent] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const stats = Object.keys(continentTotals).map(continent => {
    const total = continentTotals[continent];
    const visited = visitedByContinent[continent] || 0;
    const percentage = (visited / total) * 100;
    return { continent, visited, total, percentage };
  });

  return (
    <div className="continent-stats">
      {stats
        .sort((a, b) => b.visited - a.visited)
        .map(({ continent, visited, total, percentage }) => (
          <div key={continent} className="continent-row">
            <div className="continent-label">
              <span className="continent-name">{t(`continents.${continent}`)}</span>
              <span className="continent-count">{visited}/{total}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${percentage}%`, transition: 'width 1s ease-out' }}
              ></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ContinentStats;