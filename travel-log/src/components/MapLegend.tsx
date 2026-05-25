import React, { useEffect, useState } from 'react';
import '../styles/componentsStyles/MapLegend.scss'; 
import { useLanguage } from '../context/LanguageContext';

interface MapLegendProps {
  visitedCount: number;
  totalCount?: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ visitedCount, totalCount = 195 }) => {
  const { t } = useLanguage();
  const percentage = (visitedCount / totalCount) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);

  useEffect(() => {
    const targetOffset = circumference - (percentage / 100) * circumference;
    const timeout = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timeout);
  }, [percentage, circumference]);

  return (
    <div className="map-legend">
      <div className="legend-info">
        <div className="countries">
          <p className="legend-number">{visitedCount}</p>
          <p className="legend-label">{t('map_legend.countries')}</p>
        </div>

        <svg width="100" height="100" className="progress-ring">
          <circle className="progress-ring__background" stroke="#eee" strokeWidth="15" fill="transparent" r={radius} cx="50" cy="50" />
          <circle className="progress-ring__circle" stroke="#2bc3ff" strokeWidth="15" fill="transparent" r={radius} cx="50" cy="50" strokeDasharray={circumference} strokeDashoffset={animatedOffset} />
        </svg>

        <div className="percents">
          <p className="legend-number">{Math.round(percentage)}%</p>
          <p className="legend-label">{t('map_legend.world')}</p>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;