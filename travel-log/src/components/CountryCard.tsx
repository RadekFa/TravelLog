import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/componentsStyles/CountryCard.scss';

interface CountryCardProps {
  name: string;
  continent: string;
  flag: string;
  image?: string;  
}

const CountryCard: React.FC<CountryCardProps> = ({ name, flag, image }) => {
  const navigate = useNavigate();

  // Pomocná funkce pro získání cesty k moderním formátům
  const getModernSrc = (src: string, ext: string) => {
    if (!src) return "";
    return src.substring(0, src.lastIndexOf('.')) + '.' + ext;
  };

  return (
    <div 
      className="country-card" 
      onClick={() => navigate(`/country/${name}`)}
      role="button"
      tabIndex={0}
    >
      {image && (
        <picture className="country-image-container">
          <source srcSet={getModernSrc(image, 'avif')} type="image/avif" />
          <source srcSet={getModernSrc(image, 'webp')} type="image/webp" />
          <img 
            src={image} 
            alt={name} 
            className="country-image" 
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}

      {/* Vlajka je nyní samostatně pro snadnější pozicování v Gridu */}
      <img 
        src={flag} 
        alt={`${name} flag`} 
        className="flag-icon" 
        loading="lazy"
      />

      <span className="country-name">{name}</span>
    </div>
  );
};

export default CountryCard;