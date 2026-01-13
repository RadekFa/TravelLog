import React, { useEffect, useState } from 'react';
import '../styles/componentsStyles/ContinentsStats.scss'; 

interface Country {
  name: string;
  continent: string;
}

interface ContinentStatsProps {
  visitedCountries: Country[];
  allCountries: Country[];
}

const ContinentStats: React.FC<ContinentStatsProps> = ({ visitedCountries, allCountries }) => {
  // spočítat celkové počty
  const continentTotals = allCountries.reduce((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // spočítat navštívené
  const visitedByContinent = visitedCountries.reduce((acc, c) => {
    acc[c.continent] = (acc[c.continent] || 0) + 1;
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
        .filter(({ visited }) => visited >= 0) 
        .sort((a, b) => b.visited - a.visited)
        .map(({ continent, visited, total, percentage }) => {
          const [animatedWidth, setAnimatedWidth] = useState(0);

          useEffect(() => {
            const timeout = setTimeout(() => {
              setAnimatedWidth(percentage);
            }, 100);
            return () => clearTimeout(timeout);
          }, [percentage]);

          return (
            <div key={continent} className="continent-row">
              <div className="continent-label">
                <span className="continent-name">{continent}</span>
                <span className="continent-count">{visited}/{total}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${animatedWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ContinentStats;
