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

  return (
    <div className="country-card" onClick={() => navigate(`/country/${name}`)}>
      {image && (
        <img src={image} alt={name} className="country-image" />
      )}

      <div className="country-info">
        <img src={flag} alt={`${name} flag`} className="flag-icon" />
      </div>

      <span className="country-name">{name}</span>

      
    </div>
  );
};

export default CountryCard;
