import { useState } from "react";
import "../styles/componentsStyles/TravelGoalSetting.scss";

const TravelGoalSetting = () => {
  const [goal, setGoal] = useState(20);

  return (
    <div className="travel-goal-setting">
      <h2>Travel Goal</h2>
      <p className="subtitle">Set your country target</p>

      <div className="slider-grid">
        <input
          className="target-setter"
          type="range"
          min={1}
          max={195}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          style={{
            "--value": goal,
            "--min": 1,
            "--max": 195,
          } as React.CSSProperties}
        />

        <p className="goal-value">{goal}</p>
      </div>
    </div>
  );
};

export default TravelGoalSetting;
