import { visitedCountriesDB } from "../data/VisitedCountries";
import "../styles/componentsStyles/ProfileCountries.scss";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ProfileCountries = () => {
  // Seřadíme podle visitedTo (nejnovější nahoře)
  const sortedCountries = [...visitedCountriesDB].sort(
    (a, b) =>
      new Date(b.visitedTo).getTime() - new Date(a.visitedTo).getTime()
  );

  return (
    <div className="profile-countries">
      <h2>Visited Countries</h2>

      <div className="countries-list">
        {sortedCountries.map((country, index) => (
          <div key={country.code}>
            <div className="country-item">
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="flag-profile"
              />

              <div className="text">
                <h3>{country.name}</h3>
                <p className="dates">
                  {formatDate(country.visitedFrom)} – {formatDate(country.visitedTo)}
                </p>
              </div>
            </div>

            {/* Divider mezi položkami */}
            {index < sortedCountries.length - 1 && (
              <hr className="country-divider" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCountries;
