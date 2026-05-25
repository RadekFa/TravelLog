import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import "../styles/componentsStyles/AddTripModal.scss";
import { useTrips } from "../context/TripContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DateRangeInput from "./DateRangeInput";

interface Country {
  id: number;
  name: string; // Originální název z DB (anglicky)
  flag: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editTripId?: number | null;
};

const AddTripModal: React.FC<Props> = ({ isOpen, onClose, editTripId }) => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { addTrip, updateTrip, trips } = useTrips();

  // STAVY FORMULÁŘE
  // selectedCountryTranslatedName: Přeložený název země, který vidí uživatel v inputu
  const [selectedCountryTranslatedName, setSelectedCountryTranslatedName] = useState("");
  // searchText: Text, který uživatel píše do vyhledávání (nemusí to být celý název)
  const [searchText, setSearchText] = useState("");
  // dbCountries: Seznam zemí z DB
  const [dbCountries, setDbCountries] = useState<Country[]>([]);
  // showList: Ovládá zobrazení dropdownu
  const [showList, setShowList] = useState(false);
  // error: Chybová hláška
  const [error, setError] = useState("");
  // range: Rozsah dat
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const countryRef = useRef<HTMLDivElement>(null);

  // 1. NAČTENÍ ZEMÍ Z DB (jen při otevření modalu a existenci tokenu)
  useEffect(() => {
    if (isOpen && token && dbCountries.length === 0) {
      fetch("http://localhost:8080/api/countries", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setDbCountries(data))
        .catch(err => {
            console.error("Error loading countries:", err);
            setError(t('add_trip.err_server'));
        });
    }
  }, [isOpen, token, t, dbCountries.length]);

  // 2. NAČTENÍ DAT PRO EDITACI (pouze pokud se nemění trips po uložení)
  useEffect(() => {
    // Spustíme jen pokud modal je otevřený, máme editTripId a NEJSME v procesu resetování
    if (isOpen && editTripId && !error && !range.start) {
      const tripToEdit = trips.find(t => t.id === editTripId);
      if (tripToEdit) {
        // Do inputu pro uživatele dáme PŘELOŽENÝ název
        setSelectedCountryTranslatedName(t(`countries.${tripToEdit.country.name}`));
        // Ale pro logiku vyhledávání v handleSave budeme potřebovat ten originální, 
        // takže searchText zatím necháme prázdný, handleSave si s tím poradí.
        setSearchText(""); 
        setRange({
          start: new Date(tripToEdit.departureDate),
          end: new Date(tripToEdit.arrivalDate)
        });
      }
    } else if (isOpen && !editTripId && !range.start) {
      // Pokud otevíráme pro přidání nového, resetujeme formulář
      resetForm();
    }
  }, [isOpen, editTripId, trips, t, error, range.start]);

  const resetForm = () => {
    setSelectedCountryTranslatedName("");
    setSearchText("");
    setRange({ start: null, end: null });
    setError("");
    setShowList(false);
  };

  // Kliknutí mimo dropdown ho zavře
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. LOGIKA VYHLEDÁVÁNÍ (FILTROVÁNÍ DROPDOWNU)
  const filteredCountries = dbCountries.filter(c => {
    // Hledáme v přeloženém názvu země
    const translatedName = t(`countries.${c.name}`).toLowerCase();
    // Porovnáváme s textem, který uživatel píše ( searchText)
    return translatedName.includes(searchText.toLowerCase());
  });

  // Validace formuláře pro povolení tlačítka Uložit
  const isValid =
    selectedCountryTranslatedName.trim() !== "" &&
    range.start !== null &&
    range.end !== null &&
    range.start <= range.end;

  // 4. ULOŽENÍ VÝLETU
  const handleSave = async () => {
    setError(""); // Reset chyby před uložením

    if (!isValid) {
      setError(t('add_trip.err_fill'));
      return;
    }

    // Najdeme zemi porovnáním PŘELOŽENÉHO názvu v inputu s PŘELOŽENÝM názvem v DB
    // Tímto zajistíme, že najdeme správný originální klíč pro backend.
    const selectedCountry = dbCountries.find((c) => t(`countries.${c.name}`) === selectedCountryTranslatedName);
    
    if (!selectedCountry) {
      setError(t('add_trip.err_select'));
      return;
    }

    try {
      // Funkce pro formátování data pro backend (YYYY-MM-DD)
      const formatDateForBack = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startStr = formatDateForBack(range.start!);
      const endStr = formatDateForBack(range.end!);

      if (editTripId) {
        // Režim EDITACE
        await updateTrip(editTripId, selectedCountry.id, startStr, endStr);
      } else {
        // Režim PŘIDÁNÍ NOVÉHO
        await addTrip(selectedCountry.id, startStr, endStr);
        // Spustíme konfety PŘED resetem a zavřením
        fireConfetti();
      }
      
      // Reset formuláře a zavření modalu
      resetForm();
      onClose();
    } catch (err) {
      console.error("Save trip error:", err);
      setError(t('add_trip.err_server'));
    }
  };

  // Konfety logika (beze změny)
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: 0.7 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: 0.7 } });
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Titulek modalu */}
        <h2>{editTripId ? t('add_trip.edit_title') : t('add_trip.add_title')}</h2>

        {/* Vyhledávání země */}
        <div className="country-search-wrapper" ref={countryRef}>
          <h3 className="add-country-header">{t('add_trip.country_label')}</h3>
          <div className="input-with-clear">
            <input
              type="text"
              className="country-search-input"
              // Placeholdery pro vyhledávání
              placeholder={t('add_trip.placeholder')}
              // Uživatel vidí přeložený název vybrané země
              value={showList ? searchText : selectedCountryTranslatedName}
              disabled={!!editTripId} // Při editaci nelze měnit zemi
              onChange={(e) => {
                  setSearchText(e.target.value); // Aktualizujeme text vyhledávání
                  setShowList(true); // ZobrazímeDropdown
              }}
              onFocus={() => {
                  if (!editTripId) {
                      setShowList(true);
                      // Když uživatel klikne do inputu, vymažeme zobrazený název a ukážeme search text
                      setSearchText(selectedCountryTranslatedName);
                  }
              }}
            />
            {/* Tlačítko pro vymazání inputu */}
            {!editTripId && selectedCountryTranslatedName && (
              <button className="clear-input-button" onClick={() => { resetForm(); setShowList(true); }} type="button">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" /></svg>
              </button>
            )}
          </div>

          {/* Dropdown se seznamem zemí */}
          {showList && !editTripId && (
            <ul className="country-dropdown">
              {filteredCountries.map((c) => (
                <li key={c.id} onClick={() => {
                  // Po kliknutí v dropdownu propíšeme přeložený název do inputu pro uživatele
                  setSelectedCountryTranslatedName(t(`countries.${c.name}`));
                  setSearchText(""); // Vymažeme vyhledávací text
                  setShowList(false); // Zavřeme dropdown
                  setError(""); // Resetujeme případnou chybu
                }}>
                  <img src={c.flag} alt="" />
                  {/* Uživatel vidí přeložený název i v dropdownu */}
                  {t(`countries.${c.name}`)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Výběr data */}
        <div>
          <h3 className="add-country-header">{t('add_trip.range_label')}</h3>
          <DateRangeInput value={range} onChange={setRange} />
        </div>

        {/* Chybová hláška */}
        {error && <p className="error-message">{error}</p>}

        {/* Tlačítka modalu */}
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-button" type="button">{t('add_trip.cancel')}</button>
          <button className="add-button" onClick={handleSave} disabled={!isValid} type="button">
            {editTripId ? t('add_trip.save_btn') : t('add_trip.add_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTripModal;