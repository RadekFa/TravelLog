import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripContext";
import { useSettings } from "../context/SettingsContext";
import '../styles/componentsStyles/UserStats.scss'; 

const UserStats = () => {
  const { user } = useAuth();
  const { trips } = useTrips();
  const { settings } = useSettings();

  // --- VÝPOČTY REÁLNÝCH DAT ---
  
  // Počet unikátních zemí
  const visitedCount = new Set(trips.map(t => t.country.id)).size;
  
  // Počet unikátních kontinentů
  const continentCount = new Set(trips.map(t => t.country.continent)).size;
  
  // Procento travel goalu
  const goalPercentage = settings.travelGoal > 0 
    ? Math.round((visitedCount / settings.travelGoal) * 100) 
    : 0;

  return (
    <div className="travel-stats">
      {/* Box: Země */}
      <div className="stat-box countries">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.8286 1.72758C19.618 1.37176 21.0449 0.981099 22.1457 2.08172C23.2466 3.18244 22.8558 4.60949 22.5 5.39885C22.2409 5.97353 21.8851 6.58498 21.4343 7.03586L18.3035 10.1667L20.75 19.9527C21.0686 21.2273 19.4017 22.0136 18.6208 20.957L13.9001 14.5701L11.0678 17.4024L10.4818 21.504C10.326 22.5944 8.90642 22.9164 8.29541 21.9999L5.86325 18.3517L1.89476 15.6042C0.960857 14.9577 1.36456 13.4958 2.49799 13.4203L6.85509 13.1298L9.65741 10.3275L3.27054 5.60674C2.21395 4.82579 3.00021 3.1589 4.27485 3.47756L14.0608 5.92406L17.1916 2.7933C17.6424 2.34244 18.254 1.98663 18.8286 1.72758ZM18.5828 4.23053L15.1548 7.65856C14.8567 7.95662 14.4241 8.07643 14.0152 7.9742L7.70352 6.39628L11.5932 9.27129C12.1832 9.70735 12.2473 10.5661 11.7285 11.0848L8.05676 14.7566C7.85123 14.9621 7.57808 15.086 7.28807 15.1054L4.91621 15.2635L7.31557 16.9246L8.79804 19.1483L9.12556 16.8556C9.16228 16.5986 9.28139 16.3604 9.46498 16.1768L13.1427 12.499C13.6615 11.9803 14.5202 12.0443 14.9562 12.6343L17.8312 16.524L16.2533 10.2123C16.1511 9.80342 16.2709 9.37083 16.569 9.07277L19.997 5.64474C20.0811 5.54456 20.4407 5.10051 20.6767 4.57691C20.9648 3.93787 20.8835 3.64788 20.7316 3.49604C20.5796 3.34411 20.2895 3.26286 19.6505 3.5509C19.127 3.78691 18.683 4.14648 18.5828 4.23053Z" />
        </svg>
        <p className="stats-amount">{visitedCount}</p>
        <p className="stats-label">Countries Visited</p>
      </div>

      {/* Box: Kontinenty */}
      <div className="stat-box continents">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 1C4.44772 1 4 1.44772 4 2V22C4 22.5523 4.44772 23 5 23C5.55228 23 6 22.5523 6 22V14H19C19.3603 14 19.6927 13.8062 19.8702 13.4927C20.0477 13.1792 20.0429 12.7944 19.8575 12.4855L17.1662 8L19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8575 3.5145C20.0429 3.20556 20.0477 2.82081 19.8702 2.5073C19.6927 2.19379 19.3603 2 19 2L6 2C6 1.44772 5.55228 1 5 1ZM6 4V12H17.2338L15.1425 8.5145C14.9525 8.19781 14.9525 7.80219 15.1425 7.4855L17.2338 4H6Z" />
        </svg>
        <p className="stats-amount">{continentCount}</p>
        <p className="stats-label">Continents Visited</p>
      </div>

      {/* Box: Cíl */}
      <div className="stat-box travel-goal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          {/* OPRAVENÁ STRUKTURA CESTY (D) - Žádné errory v konzoli */}
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        <p className="stats-amount">{goalPercentage}%</p>
        <p className="stats-label">Travel Goal</p>
      </div>

      {/* Box: Since */}
      <div className="stat-box since-box">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2C6 1.44772 6.44772 1 7 1C7.55228 1 8 1.44772 8 2V3H16V2C16 1.44772 16.4477 1 17 1C17.5523 1 18 1.44772 18 2V3H19C20.6569 3 22 4.34315 22 6V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V6C2 4.34315 3.34315 3 5 3H6V2ZM16 5V6C16 6.55228 16.4477 7 17 7C17.5523 7 18 6.55228 18 6V5H19C19.5523 5 20 5.44772 20 6V9H4V6C4 5.44772 4.44772 5 5 5H6V6C6 6.55228 6.44772 7 7 7C7.55228 7 8 6.55228 8 6V5H16ZM4 11V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V11H4Z" />
        </svg>
        {/* FALLBACK: Dokud neopravíš backend, ukáže se aktuální rok, místo prázdné pomlčky */}
        <p className="stats-amount">{user?.registrationYear || new Date().getFullYear()}</p>
        <p className="stats-label">Traveling Since</p>
      </div>
    </div>
  );
};

export default UserStats;