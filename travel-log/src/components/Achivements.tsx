import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import '../styles/componentsStyles/Achievements.scss';

interface Achievement {
  id: number;
  title: string;
  description: string;
  svgIcon: string;
  unlocked: boolean;
  requirementValue: number;
  currentValue: number;
  type: string;
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = useAuth();
  const { t, lang } = useLanguage(); // Vytáhneme kód aktuálního jazyka (en / es / de)

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/achievements", {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: Achievement[]) => {
        // ŘAZENÍ: Nejprve zamknuté podle nejvyššího pokroku, pak splněné
        const sorted = [...data].sort((a, b) => {
          if (a.unlocked !== b.unlocked) {
            return a.unlocked ? 1 : -1;
          }
          
          if (!a.unlocked) {
            const progressA = a.currentValue / a.requirementValue;
            const progressB = b.currentValue / b.requirementValue;
            return progressB - progressA; 
          }
          
          return 0;
        });
        setAchievements(sorted);
      })
      .catch(err => console.error("Error fetching achievements:", err));
  }, [token]);

  return (
    <div className="achievements-section">
      <div className="section-header">
        <h2>{t('profile.achievements') || "Achievements"}</h2>
      </div>

      <div className={`achievements-grid ${isExpanded ? "expanded" : "collapsed"}`}>
        {achievements.map((a) => {
          const progressPercent = Math.min((a.currentValue / a.requirementValue) * 100, 100);
          
          // Podmínka pro zobrazení textů: EN tahá přímo z DB objektu, ES/DE letí přes slovník
          const displayTitle = lang === "en" ? a.title : t(`achievements.${a.id}.title`) || a.title;
          const displayDescription = lang === "en" ? a.description : t(`achievements.${a.id}.description`) || a.description;

          return (
            <div key={a.id} className={`achievement-card ${a.unlocked ? "unlocked" : "locked"}`}>
              
              <div 
                className="icon-container" 
                dangerouslySetInnerHTML={{ __html: a.svgIcon }}
              />
              
              <div className="info">
                <h3>{displayTitle}</h3>
                <p title={displayDescription}>
                  {displayDescription}
                </p>
                
                {!a.unlocked && (
                  <div className="progress-wrapper">
                    <div className="progress-bar">
                      <div className="fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <span className="progress-num">
                      {a.currentValue} / {a.requirementValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="footer-action">
        {achievements.length > 0 && (
          <button className="view-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {/* OPRAVA: Specifické klíče pro texty tlačítek u achievementů */}
            {isExpanded 
              ? (t('profile.show_less_achievements') || "Show Less Achievements") 
              : (t('profile.view_all_achievements') || "View All Achievements")
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default Achievements;