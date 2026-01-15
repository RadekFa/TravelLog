import { useState } from "react";
import "../styles/componentsStyles/TravelGoalSetting.scss";

const TravelGoalSetting = () => {
  const [goal, setGoal] = useState(20);

  return (
    <div className="travel-goal-setting">
      <h2 className="h2-travelGoalSet">Travel Goal</h2>
      <p className="subtitle">Set your country target</p>

      <div className="slider-grid">
        <input
          className="target-setter"
          type="range"
          min={1}
          max={195}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          aria-label="Set your target number of visited countries"
          aria-valuetext={`${goal} countries`}
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
