import React, { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import "../styles/componentsStyles/AddTripModal.scss";
import { useTrips } from "../context/TripContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useAchievementToast } from "../context/AchievementToastContext";
import DateRangeInput from "./DateRangeInput";

interface Country {
  id: number;
  name: string;
  flag: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editTripId?: number | null;
};

const AddTripModal: React.FC<Props> = ({ isOpen, onClose, editTripId }) => {
  const { t, lang } = useLanguage();
  const { token } = useAuth();
  const { addTrip, updateTrip, trips } = useTrips();
  const { showAchievement } = useAchievementToast();

  const [selectedCountryTranslatedName, setSelectedCountryTranslatedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dbCountries, setDbCountries] = useState<Country[]>([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const countryRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen && editTripId && !error && !range.start) {
      const tripToEdit = trips.find(t => t.id === editTripId);
      if (tripToEdit) {
        setSelectedCountryTranslatedName(t(`countries.${tripToEdit.country.name}`));
        setSearchText(""); 
        setRange({
          start: new Date(tripToEdit.departureDate),
          end: new Date(tripToEdit.arrivalDate)
        });
      }
    } else if (isOpen && !editTripId && !range.start) {
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = dbCountries.filter(c => {
    const translatedName = t(`countries.${c.name}`).toLowerCase();
    return translatedName.includes(searchText.toLowerCase());
  });

  const isValid =
    selectedCountryTranslatedName.trim() !== "" &&
    range.start !== null &&
    range.end !== null &&
    range.start <= range.end;

  const handleSave = async () => {
    setError(""); 

    if (!isValid) {
      setError(t('add_trip.err_fill'));
      return;
    }

    const selectedCountry = dbCountries.find((c) => t(`countries.${c.name}`) === selectedCountryTranslatedName);
    
    if (!selectedCountry) {
      setError(t('add_trip.err_select'));
      return;
    }

    try {
      const formatDateForBack = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startStr = formatDateForBack(range.start!);
      const endStr = formatDateForBack(range.end!);

      let newlyUnlockedAchievements: any[] = [];

      if (editTripId) {
        newlyUnlockedAchievements = await updateTrip(editTripId, selectedCountry.id, startStr, endStr);
      } else {
        newlyUnlockedAchievements = await addTrip(selectedCountry.id, startStr, endStr);
      }
      
      fireConfetti();
      
      // Zpracování nových achievementů
      if (newlyUnlockedAchievements && newlyUnlockedAchievements.length > 0) {
        newlyUnlockedAchievements.forEach((ach) => {
           console.log("Newly unlocked achievement:", ach); // Přidáno pro tvou kontrolu v prohlížeči
           
           let finalTitle = ach.title; // Výchozí stav z databáze
           
           // Extrémně silná pojistka proti chybě i18next ("titel" / "title")
           if (lang !== "en") {
               const translated = t(`achievements.${ach.id}.title`);
               if (translated && translated !== "title" && translated !== "titel" && !translated.includes("achievements")) {
                   finalTitle = translated;
               }
           }

           // Pokud v databázi ikonka chybí, ukážeme univerzální medaili místo prázdného kruhu
           const fallbackIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>';

           showAchievement({
              id: ach.id,
              title: finalTitle || "Nová úroveň!", // Pro jistotu
              description: ach.description || "",
              svgIcon: ach.svgIcon || fallbackIcon
           });
        });
      }
      
      resetForm();
      onClose();
    } catch (err) {
      console.error("Save trip error:", err);
      setError(t('add_trip.err_server'));
    }
  };

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
        <h2>{editTripId ? t('add_trip.edit_title') : t('add_trip.add_title')}</h2>

        <div className="country-search-wrapper" ref={countryRef}>
          <h3 className="add-country-header">{t('add_trip.country_label')}</h3>
          <div className="input-with-clear">
            <input
              type="text"
              className="country-search-input"
              placeholder={t('add_trip.placeholder')}
              value={showList ? searchText : selectedCountryTranslatedName}
              disabled={!!editTripId} 
              onChange={(e) => {
                  setSearchText(e.target.value); 
                  setShowList(true); 
              }}
              onFocus={() => {
                  if (!editTripId) {
                      setShowList(true);
                      setSearchText(selectedCountryTranslatedName);
                  }
              }}
            />
            {!editTripId && selectedCountryTranslatedName && (
              <button className="clear-input-button" onClick={() => { resetForm(); setShowList(true); }} type="button">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" /></svg>
              </button>
            )}
          </div>

          {showList && !editTripId && (
            <ul className="country-dropdown">
              {filteredCountries.map((c) => (
                <li key={c.id} onClick={() => {
                  setSelectedCountryTranslatedName(t(`countries.${c.name}`));
                  setSearchText(""); 
                  setShowList(false); 
                  setError(""); 
                }}>
                  <img src={c.flag} alt="" />
                  {t(`countries.${c.name}`)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="add-country-header">{t('add_trip.range_label')}</h3>
          <DateRangeInput value={range} onChange={setRange} />
        </div>

        {error && <p className="error-message">{error}</p>}

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