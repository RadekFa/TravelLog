import { useState, useEffect } from "react";
import { useTrips } from "../context/TripContext";
import { useLanguage } from "../context/LanguageContext"; 
import "../styles/componentsStyles/ProfileCountries.scss";
import AddTripModal from "./AddTripModal";

const ProfileCountries = () => {
  const { trips, deleteTrip } = useTrips();
  const { t, lang } = useLanguage(); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [gridColumns, setGridColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1150) setGridColumns(3);
      else if (window.innerWidth > 850) setGridColumns(2);
      else setGridColumns(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // JEDINÁ FUNKCE: Stará duplicita z vrchu souboru byla odstraněna, překlady teď budou fungovat!
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(lang, { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
    });
  };

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.arrivalDate || 0).getTime() - new Date(a.arrivalDate || 0).getTime()
  );

  // Aby fungoval plynulý přechod, v collapsed stavu vyrenderujeme vždy 2 celé řady
  const visibleLimit = gridColumns * 2;
  const shouldShowButton = sortedTrips.length > gridColumns; // Tlačítko se ukáže, jakmile přeteče 1. řádek
  
  const displayedTrips = isExpanded ? sortedTrips : sortedTrips.slice(0, visibleLimit);

  const handleEditClick = (id: number) => {
    setEditingTripId(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await deleteTrip(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  return (
    <div className="profile-countries-section">
      <div className="section-header">
        <h2>{t('profile.visited_countries') || "Visited Countries"}</h2>
      </div>

      <div className={`countries-grid ${isExpanded ? "expanded" : "collapsed"}`}>
        {displayedTrips.map((trip) => (
          <div key={trip.id} className="country-card">
            
            <div className="card-main-info">
              <img src={trip.country.flag} alt="flag" className="country-flag" />
              <div className="text-details">
                <h3>{t(`countries.${trip.country.name}`) || trip.country.name}</h3>
                <span className="continent-badge">
                  {t(`continents.${trip.country.continent}`) || trip.country.continent}
                </span>
              </div>
            </div>

            <div className="card-right-group">
              <div className="card-timeline">
                <div className="timeline-capsule">
                  <svg className="plane-icon takeoff" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.842 15.296a1.61 1.61 0 0 0 1.892-1.189v-.001a1.609 1.609 0 0 0-1.177-1.949l-4.576-1.133L9.825 4.21l-2.224-.225 2.931 6.589-4.449-.449-2.312-3.829-1.38.31 1.24 5.52 15.211 3.17zM3 18h18v2H3z" />
                  </svg>
                  <span>{formatDate(trip.departureDate)}</span>
                </div>
                <div className="timeline-capsule">
                  <svg className="plane-icon landing" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 18h18v2H3zm18.509-9.473a1.61 1.61 0 0 0-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455a1.611 1.611 0 0 0 .962-2.018z" />
                  </svg>
                  <span>{formatDate(trip.arrivalDate)}</span>
                </div>
              </div>

              <div className="card-actions-block">
                <button className="action-btn edit" title="Edit" onClick={() => handleEditClick(trip.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                <div className="delete-popover-container">
                  <button 
                    className={`action-btn delete ${deleteConfirmId === trip.id ? "active" : ""}`} 
                    title="Delete"
                    onClick={() => setDeleteConfirmId(deleteConfirmId === trip.id ? null : trip.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>

                  {deleteConfirmId === trip.id && (
                    <div className="inline-delete-popover">
                      <p>{t('profile.delete_confirm') || "Delete?"}</p>
                      <div className="popover-btns">
                        <button className="btn-yes" onClick={() => handleDeleteConfirm(trip.id)}>
                          {t('profile.yes') || "Yes"}
                        </button>
                        <button className="btn-no" onClick={() => setDeleteConfirmId(null)}>
                          {t('profile.no') || "No"}
                        </button>
                      </div>
                      <div className="popover-arrow"></div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {shouldShowButton && (
        <div className="footer-action">
          <button className="view-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded 
              ? (t('profile.show_less') || "Show less") 
              : (t('profile.view_all') || "View all trips")
            }
          </button>
        </div>
      )}

      <AddTripModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTripId(null);
        }}
        editTripId={editingTripId}
      />
    </div>
  );
};

export default ProfileCountries;