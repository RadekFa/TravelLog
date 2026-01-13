import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import "../styles/componentsStyles/AddTripModal.scss";
import { allCountries } from "../data/VisitedCountries";
import DateRangeInput from "./DateRangeInput";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTripModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [country, setCountry] = useState("");
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");

  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const countryRef = useRef<HTMLDivElement>(null);

  // Funkce pro resetování formuláře do původního stavu
  const resetForm = () => {
    setCountry("");
    setRange({ start: null, end: null });
    setError("");
    setShowList(false);
  };

  // Zavření dropdownu při kliku mimo
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrace zemí pro vyhledávač
  const filteredCountries =
    country.trim() === ""
      ? allCountries
      : allCountries.filter((c) =>
          c.name.toLowerCase().includes(country.toLowerCase())
        );

  // Validace formuláře dle požadavků
  const isValid =
    country.trim() !== "" &&
    range.start !== null &&
    range.end !== null &&
    range.start <= range.end;

  // Funkce pro spuštění konfet
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: 0.7 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: 0.7 } });
    }, 250);
  };

  const handleAddTrip = () => {
    if (!isValid) {
      setError("Please fill all fields correctly.");
      return;
    }

    // Simulace práce s daty
    console.log("Trip added:", {
      country,
      from: range.start,
      to: range.end,
    });

    fireConfetti(); 
    resetForm(); // Vymaže inputy po úspěšném přidání
    onClose(); 
  };

  const handleCancel = () => {
    resetForm(); // Vymaže rozpracovaný obsah při zrušení
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Trip</h2>

        {/* COUNTRY SEARCH */}
        <div className="country-search-wrapper" ref={countryRef}>
          <h3 className="add-country-header country-search">Country</h3>

          <div className="input-with-clear">
            <input
              type="text"
              className="country-search-input"
              placeholder="Start typing a country..."
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setShowList(true);
              }}
              onFocus={() => setShowList(true)}
            />
            
            {country && (
              <button 
                className="clear-input-button" 
                onClick={() => setCountry("")}
                type="button"
                aria-label="Clear input"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" />
                </svg>
              </button>
            )}
          </div>

          {showList && (
            <ul className="country-dropdown">
              {filteredCountries.length === 0 && (
                <li className="no-results">No results</li>
              )}

              {filteredCountries.map((c) => (
                <li
                  key={c.name}
                  onClick={() => {
                    setCountry(c.name);
                    setShowList(false);
                  }}
                >
                  <img src={c.flag} alt="" />
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* DATE RANGE PICKER */}
        <div>
          <h3 className="add-country-header calendar">Trip Range</h3>
          <DateRangeInput value={range} onChange={setRange} />
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="error-message">{error}</p>}

        {/* BUTTONS */}
        <div className="modal-buttons">
          <button onClick={handleCancel} className="cancel-button" type="button">
            Cancel
          </button>

          <button
            className="add-button"
            onClick={handleAddTrip}
            disabled={!isValid}
            type="button"
          >
            Add Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTripModal;