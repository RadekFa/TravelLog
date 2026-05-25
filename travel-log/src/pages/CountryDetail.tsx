import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";
import CountryCard from "../components/CountryCard";
import "../styles/pagesStyles/CountryDetail.scss";

interface Country {
  id: number;
  name: string;
  population: number;
  area: number;
  capitalCity: string;
  continent: string;
  imageAvif: string;
  imageWebp: string;
  imageJpg: string;
  flag: string;
  language: string; 
  currency: string; 
}

const CountryDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { token } = useAuth();

  const [country, setCountry] = useState<Country | null>(null);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError(t('detail_page.error_auth'));
        setLoading(false);
        return;
      }

      try {
        const detailRes = await fetch(`http://localhost:8080/api/countries/${name}`, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });

        const allRes = await fetch("http://localhost:8080/api/countries", {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });

        if (detailRes.ok && allRes.ok) {
          const detailData = await detailRes.json();
          const allData = await allRes.json();
          setCountry(detailData);
          setAllCountries(allData);
        } else {
          setError(t('detail_page.error_not_found'));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(t('detail_page.error_connect'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, token, t]);

  // LOGIKA: Náhodný mix s rovnoměrným střídáním kontinentů
  const suggestCountries = useMemo(() => {
    if (allCountries.length === 0 || !country) return [];

    // Vyloučíme zemi, na které právě jsme
    const filteredCountries = allCountries.filter((c) => c.name !== country.name);

    // Rozřadíme země do skupin podle kontinentů
    const continentsMap: { [key: string]: Country[] } = {};
    filteredCountries.forEach((c) => {
      if (!continentsMap[c.continent]) {
        continentsMap[c.continent] = [];
      }
      continentsMap[c.continent].push(c);
    });

    // Každý kontinent interně náhodně zamícháme
    Object.keys(continentsMap).forEach((key) => {
      continentsMap[key].sort(() => 0.5 - Math.random());
    });

    const orderedResult: Country[] = [];
    const continentNames = Object.keys(continentsMap);
    
    // Maximální počet smyček určíme podle největšího počtu zemí v jednom kontinentu
    const maxLength = Math.max(...continentNames.map(name => continentsMap[name].length));

    // Střídavě bereme z každého kontinentu jednu zemi (např. Evropa, Afrika, Asie...)
    for (let i = 0; i < maxLength; i++) {
      continentNames.forEach((contName) => {
        if (continentsMap[contName][i]) {
          orderedResult.push(continentsMap[contName][i]);
        }
      });
    }

    // Vezmeme dostatečnou rezervu (30 zemí), CSS se postará o schování nekompletních kusů
    return orderedResult.slice(0, 30);
  }, [allCountries, country]);

  if (loading) return <div className="loading"><h2>{t('detail_page.loading')}</h2></div>;
  if (error || !country) return <div className="error"><h2>{error || t('detail_page.error_not_found')}</h2></div>;

  return (
    <div className="country-detail-page">
      {/* HEADER */}
      <header className="header-country-detail">
        <div className="header-left">
          <div className="header-title-container">
            <h1>{t(`countries.${country.name}`)}</h1>
            <p className="nav-subtitle">{t(`continents.${country.continent}`)}</p>
          </div>
          <img className="nav-flag" src={country.flag} alt="flag" />
        </div>
        
        <button 
          className="back-button" 
          onClick={() => navigate('/countries')} 
          aria-label="Back to country list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" />
          </svg>
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main className="detail-main-layout">
        <div className="detail-top-wrapper">
          {/* LEVÁ PŮLKA: Informace */}
          <div className="detail-info">
            <div className="detail-text population">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7C11 9.20914 9.20914 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3C9.20914 3 11 4.79086 11 7ZM4.97715 7C4.97715 8.11719 5.88281 9.02284 7 9.02284C8.11719 9.02284 9.02284 8.11719 9.02284 7C9.02284 5.88281 8.11719 4.97716 7 4.97716C5.88281 4.97716 4.97715 5.88281 4.97715 7Z M2.37162 14.2378C3.54371 13.3886 5.09751 13 7 13C8.90249 13 10.4563 13.3886 11.6284 14.2378C12.8188 15.1004 13.4914 16.3477 13.795 17.8079C14.1811 19.6647 12.5708 21 11 21H3C1.42922 21 -0.181121 19.6647 0.204962 17.8079C0.508602 16.3477 1.18119 15.1004 2.37162 14.2378ZM3.54511 15.8574C2.84896 16.3618 2.39073 17.1203 2.16308 18.2151C2.12425 18.4018 2.17618 18.5729 2.31828 18.7223C2.47041 18.8824 2.71717 19 3 19H11C11.2828 19 11.5296 18.8824 11.6817 18.7223C11.8238 18.5729 11.8757 18.4018 11.8369 18.2151C11.6093 17.1203 11.151 16.3618 10.4549 15.8574C9.74039 15.3397 8.65185 15 7 15C5.34815 15 4.25961 15.3397 3.54511 15.8574Z M21 7C21 9.20914 19.2091 11 17 11C14.7909 11 13 9.20914 13 7C13 4.79086 14.7909 3 17 3C19.2091 3 21 4.79086 21 7ZM14.9772 7C14.9772 8.11719 15.8828 9.02284 17 9.02284C18.1172 9.02284 19.0228 8.11719 19.0228 7C19.0228 5.88281 18.1172 4.97716 17 4.97716C15.8828 4.97716 14.9772 5.88281 14.9772 7Z M14.5361 13.2689C13.9347 13.4165 13.7248 14.1168 14.0647 14.6344L14.1075 14.6995C14.3593 15.0829 14.839 15.239 15.2891 15.1501C15.7787 15.0534 16.3451 15 17 15C18.6519 15 19.7404 15.3397 20.4549 15.8574C21.1511 16.3618 21.6093 17.1203 21.8369 18.2151C21.8758 18.4018 21.8238 18.5729 21.6817 18.7223C21.5296 18.8824 21.2828 19 21 19H16C15.4478 19 15 19.4477 15 20C15 20.5523 15.4478 21 16 21H21C22.5708 21 24.1811 19.6647 23.7951 17.8079C23.4914 16.3477 22.8188 15.1004 21.6284 14.2378C20.4563 13.3886 18.9025 13 17 13C16.0994 13 15.2769 13.0871 14.5361 13.2689Z"/>
              </svg>
              <p className="bold-info">{t('detail_page.population')}</p>
              <p className="regular-info">{country.population.toLocaleString()}</p>
            </div>

            <div className="detail-text area">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 8C21.4477 8 21 7.55228 21 7V4.41421L14.7071 10.7071C14.3166 11.0976 13.6834 11.0976 13.2929 10.7071C12.9024 10.3166 12.9024 9.68342 13.2929 9.29289L19.5858 3H17C16.4477 3 16 2.55228 16 2C16 1.44772 16.4477 1 17 1H21C22.1046 1 23 1.89543 23 3V7C23 7.55228 22.5523 8 22 8Z M2 16C2.55228 16 3 16.4477 3 17V19.5858L9.29289 13.2929C9.68342 12.9024 10.3166 12.9024 10.7071 13.2929C11.0976 13.6834 11.0976 14.3166 10.7071 14.7071L4.41421 21H7C7.55228 21 8 21.4477 8 22C8 22.5523 7.55228 23 7 23H3C1.89543 23 1 22.1046 1 21V17C1 16.4477 1.44772 16 2 16Z" />
              </svg>
              <p className="bold-info">{t('detail_page.area')}</p>
              <p className="regular-info">{country.area.toLocaleString()} km²</p>
            </div>

            <div className="detail-text capital">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.0036 14.0035C14.4889 14.0035 16.5036 11.9887 16.5036 9.50347C16.5036 7.01819 14.4889 5.00347 12.0036 5.00347C9.51831 5.00347 7.50359 7.01819 7.50359 9.50347C7.50359 11.9887 9.51831 14.0035 12.0036 14.0035ZM12.0036 12.0071C10.6209 12.0071 9.5 10.8862 9.5 9.50347C9.5 8.12077 10.6209 6.99988 12.0036 6.99988C13.3863 6.99988 14.5072 8.12077 14.5072 9.50347C14.5072 10.8862 13.3863 12.0071 12.0036 12.0071Z M21.272 11.5818C22.5649 5.78816 18.0052 0.00354004 12 0.00354004C5.99649 0.00354004 1.43639 5.7961 2.72816 11.5825C3.72523 16.2821 7.7572 20.8465 10.1636 23.2269C11.1942 24.2463 12.8058 24.2463 13.8364 23.2269C16.2429 20.8464 20.2752 16.2816 21.272 11.5818ZM12 2.00354C16.7124 2.00354 20.3368 6.58981 19.32 11.1462C18.8316 13.3355 17.7359 15.3015 16.4501 17.119C15.1064 19.0184 13.5829 20.6644 12.4299 21.805C12.1786 22.0536 11.8214 22.0536 11.5701 21.805C10.4171 20.6645 8.89379 19.0186 7.55009 17.1193C6.26419 15.3017 5.16886 13.3361 4.68011 11.1467C3.66438 6.59682 7.29012 2.00354 12 2.00354Z" />
              </svg>
              <p className="bold-info">{t('detail_page.capital')}</p>
              <p className="regular-info">{t(`capitals.${country.capitalCity}`)}</p>
            </div>

            <div className="detail-text continent">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M 12.9951 9.90096 C 15.2798 9.43957 17 7.42067 17 5 C 17 2.23858 14.7614 0 12 0 C 9.23857 0 6.99999 2.23858 6.99999 5 C 6.99999 7.42067 8.72019 9.43957 11.0048 9.90096 C 11.0016 9.93354 11 9.96658 11 10 V 19 C 11 19.5523 11.4477 20 12 20 C 12.5523 20 13 19.5523 13 19 V 10 C 13 9.96658 12.9984 9.93354 12.9951 9.90096 Z M 12 8.0065 C 10.3396 8.0065 8.9935 6.66044 8.9935 5 C 8.9935 3.33956 10.3396 1.9935 12 1.9935 C 13.6604 1.9935 15.0065 3.33956 15.0065 5 C 15.0065 6.66044 13.6604 8.0065 12 8.0065 Z M 4.78369 16.299 C 5.62603 15.6557 6.73206 15.2123 8.00216 15.0591 C 8.55047 14.993 8.99998 15.4477 8.99998 16 C 8.99998 16.5523 8.54907 16.9896 8.00393 17.0782 C 7.16144 17.215 6.4816 17.5189 5.99751 17.8885 C 5.32619 18.4012 5.09028 18.9788 5.12241 19.4288 C 5.15277 19.8538 5.44623 20.4684 6.50713 21.0185 C 7.57831 21.5739 9.33864 22 11.9999 22 C 14.6613 22 16.4216 21.5739 17.4928 21.0185 C 18.5537 20.4684 18.8472 19.8538 18.8775 19.4288 C 18.9097 18.9788 18.6738 18.4012 18.0024 17.8885 C 17.5184 17.5189 16.8385 17.215 15.996 17.0782 C 15.4509 16.9896 15 16.5523 15 16 C 15 15.4477 15.4495 14.993 15.9978 15.0591 C 17.2679 15.2123 18.3739 15.6557 19.2163 16.299 C 20.2637 17.0988 20.9653 18.2712 20.8724 19.5712 C 20.7778 20.8962 19.8838 22.0316 18.4134 22.794 C 16.9533 23.5511 14.8387 24 11.9999 24 C 9.16123 24 7.04656 23.5511 5.58649 22.794 C 4.11615 22.0316 3.22212 20.8962 3.12749 19.5712 C 3.03464 18.2712 3.73625 17.0988 4.78369 16.299 Z" />
              </svg>
              <p className="bold-info">{t('detail_page.continent')}</p>
              <p className="regular-info">{t(`continents.${country.continent}`)}</p>
            </div>

            {/* Jazyk */}
            <div className="detail-text language">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p className="bold-info">{t('detail_page.language') || "Language"}</p>
              {/* OPRAVENO: Syrová hodnota z DB se prohání přes překlady languages */}
              <p className="regular-info">{t(`languages.${country.language}`) || country.language}</p>
            </div>

            {/* Měna */}
            <div className="detail-text currency">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <p className="bold-info">{t('detail_page.currency') || "Currency"}</p>
              {/* OPRAVENO: Syrová hodnota z DB se prohání přes překlady currencies */}
              <p className="regular-info">{t(`currencies.${country.currency}`) || country.currency}</p>
            </div>
          </div>

          {/* PRAVÁ PŮLKA: Obrázek */}
          <div className="detail-visual-image-wrapper">
            <picture className="visual-image-frame">
              <source srcSet={country.imageAvif} type="image/avif" />
              <source srcSet={country.imageWebp} type="image/webp" />
              <img className="country-main-img" src={country.imageJpg} alt={country.name} />
            </picture>
          </div>
        </div>

        {/* MAPA PŘES CELOU ŠÍŘKU */}
        <div className="detail-bottom-map-wrapper">
          <iframe 
            className="detail-map-full" 
            title="Map" 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(country.name)}&t=&z=5&ie=UTF8&iwloc=&output=embed`} 
          />
        </div>

        {/* RESPONSIVNÍ JEDNOŘÁDKOVÝ STRIP ZEMÍ BEZ OŘEZÁNÍ KARET */}
        {suggestCountries.length > 0 && (
          <section className="more-countries-responsive-section">
            <h2>{t('explore_page.title') || "Let's explore..."}</h2>
            <div className="countries-flex-layout">
              {suggestCountries.map((c) => (
                <div key={c.id} className="flex-card-item" onClick={() => navigate(`/country/${c.name}`)}>
                  <CountryCard
                    name={c.name}
                    imageAvif={c.imageAvif}
                    imageWebp={c.imageWebp}
                    imageJpg={c.imageJpg}
                    flag={c.flag}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomMenu />
    </div>
  );
};

export default CountryDetail;