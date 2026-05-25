import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/componentsStyles/TravelGoalSetting.scss";

const TravelGoalSetting = () => {
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="travel-goal-setting">
      <h2 className="h2-travelGoalSet">{t('settings.goal_title')}</h2>
      <p className="subtitle">{t('settings.goal_subtitle')}</p>

      <div className="slider-grid">
        <input
          className="target-setter"
          type="range"
          min={1}
          max={195}
          value={settings.travelGoal}
          onChange={(e) => updateSettings({ travelGoal: Number(e.target.value) })}
          style={{
            "--value": settings.travelGoal,
            "--min": 1,
            "--max": 195,
          } as React.CSSProperties}
        />
        <p className="goal-value">{settings.travelGoal}</p>
      </div>
    </div>
  );
};

export default TravelGoalSetting;