import React, { useState, useEffect } from "react";
import BottomMenu from "../components/BottomMenu";
import ContinentRow from "../components/ContinentRow";
import { useAuth } from "../context/AuthContext"; 
import { useLanguage } from "../context/LanguageContext";

import "../styles/pagesStyles/CountryList.scss";

interface Country {
  id: number;
  name: string;
  population: number;
  area: number;
  capitalCity: string;
  continent: string;
  imageAvif: string;
  imageJpg: string;
  imageWebp: string;
  flag: string;
}

const CountryList: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/countries", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(t('explore_page.error_fetch'));
        }

        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Backend error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCountries();
    }
  }, [token, t]);

  // 1. Nejprve získáme unikátní seznam kontinentů z DB
  const rawContinents = [...new Set(countries.map(c => c.continent))];

  // 2. Připravíme si pole kontinentů, které obsahují alespoň jednu zemi odpovídající vyhledávání
  const visibleContinentsData = rawContinents
    .map(continent => {
      const countriesInContinent = countries.filter(c => {
        const translatedName = t(`countries.${c.name}`).toLowerCase();
        const matchesSearch = translatedName.includes(searchTerm.toLowerCase());
        return c.continent === continent && matchesSearch;
      });
      return { continent, countries: countriesInContinent };
    })
    .filter(item => item.countries.length > 0); // Ignorujeme prázdné kontinenty

  if (loading) return <div className="loader">{t('explore_page.loading')}</div>;

  return (
    <div className="country-list-page">
      <header className="header-explore">
        <h1>{t('explore_page.title')}</h1>
        <input 
          type="text"
          placeholder={t('explore_page.search_placeholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="country-search-input"
          id="country-search-input"
        />
      </header>
      <main>
        {visibleContinentsData.map((item, index) => {
          // Kontrola, zda se jedná o úplně poslední prvek v renderovaném poli
          const isLast = index === visibleContinentsData.length - 1;

          return (
            <ContinentRow
              key={item.continent}
              continent={item.continent}
              countries={item.countries}
              isLast={isLast} 
            />
          );
        })}
      </main>
      <BottomMenu />
    </div>
  );
};

export default CountryList;