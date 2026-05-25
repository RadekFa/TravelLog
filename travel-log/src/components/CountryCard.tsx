import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext"; // IMPORT
import '../styles/componentsStyles/CountryCard.scss';

interface CountryCardProps {
  name: string;
  imageAvif?: string;
  imageWebp?: string;
  imageJpg?: string;
  flag?: string; 
}

const CountryCard: React.FC<CountryCardProps> = ({ name, imageAvif, imageWebp, imageJpg, flag }) => {
  const navigate = useNavigate();
  const { t } = useLanguage(); // HOOK PRO PŘEKLAD

  return (
    <div className="country-card" onClick={() => navigate(`/country/${name}`)}>
      <picture className="country-image-container">
        {imageAvif && <source srcSet={imageAvif} type="image/avif" />}
        {imageWebp && <source srcSet={imageWebp} type="image/webp" />}
        {/* Přeložený alt text pro přístupnost */}
        <img src={imageJpg} alt={t(`countries.${name}`)} className="country-image" loading="lazy" />
      </picture>

      {/* Vlajka z DB */}
      <img 
        src={flag || "/flags/default.svg"} 
        alt={`${t(`countries.${name}`)} flag`} 
        className="flag-icon" 
      />

      {/* PŘELOŽENÝ NÁZEV ZEMĚ */}
      <span className="country-name">{t(`countries.${name}`)}</span>
    </div>
  );
};

export default CountryCard;