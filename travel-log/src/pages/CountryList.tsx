import React, { useState } from "react";
import BottomMenu from "../components/BottomMenu";
import { allCountries } from "../data/VisitedCountries";
import ContinentRow from "../components/ContinentRow";

import "../styles/pagesStyles/CountryList.scss";

const CountryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const continents = [...new Set(allCountries.map(c => c.continent))];

  return (
    <div className="country-list-page">
      <header className="header-explore">
      <h1>Let's explore...</h1>
      <input 
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="country-search-input"
        id="country-search-input"
      />
      </header>
      <main>
        {continents.map(continent => {
          const countriesInContinent = allCountries.filter(
            c =>
              c.continent === continent &&
              c.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (countriesInContinent.length === 0) return null;

          return (
            <ContinentRow
              key={continent}
              continent={continent}
              countries={countriesInContinent}
            />
          );
        })}
      </main>
      <BottomMenu />
    </div>
  );
};

export default CountryList;
