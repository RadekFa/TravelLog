import { useAuth } from "../context/AuthContext";
import { users } from "../data/users";
import { achievements } from "../data/Achievements";
import '../styles/componentsStyles/Achievements.scss';

const Achievements = () => {
  const { currentUser } = useAuth();
  const user = users.find(u => u.username === currentUser) || users[0];
  const visited = user.stats.countries;

  return (
    <div className="achievements">
      <h2>Achievements</h2>
      <div className="achievement-list">
        {achievements.map((a, index) => {
          const achieved = visited >= a.required;

          return (
            <div key={a.id}>
              <div className={`achievement ${achieved ? "done" : ""}`}>
                <img 
                  src={a.icon} 
                  alt={a.title} 
                  className="achievement-icon" 
                />

                <div className="text">
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </div>
              </div>

              {index < achievements.length - 1 && <hr className="ach-divider" />}
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Achievements;
