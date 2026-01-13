import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import BottomMenu from "../components/BottomMenu";
import TravelGoalSetting from "../components/TravelGoalSetting";
import Preferences from "../components/preferences";
import About from "../components/about";

import "../styles/pagesStyles/SettingsPage.scss";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();       // ✔ odhlásí uživatele
    navigate("/");  // ✔ přesměruje na WelcomeScreen
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <main>
        <TravelGoalSetting />
        <Preferences />
        <About />

        <div className="sign-out-button" onClick={handleSignOut}>
          <div className="sign-out-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M 19 23 H 11 C 10.4477 23 10 22.5523 10 22 C 10 21.4477 10.4477 21 11 21 H 19 C 19.5523 21 20 20.5523 20 20 V 4 C 20 3.44772 19.5523 3 19 3 L 11 3 C 10.4477 3 10 2.55229 10 2 C 10 1.44772 10.4477 1 11 1 L 19 1 C 20.6569 1 22 2.34315 22 4 V 20 C 22 21.6569 20.6569 23 19 23 Z M 2.48861 13.3099 C 1.83712 12.5581 1.83712 11.4419 2.48862 10.6902 L 6.66532 5.87088 C 7.87786 4.47179 10.1767 5.32933 10.1767 7.18074 L 10.1767 9.00001 H 16.1767 C 17.2813 9.00001 18.1767 9.89544 18.1767 11 V 13 C 18.1767 14.1046 17.2813 15 16.1767 15 L 10.1767 15 V 16.8193 C 10.1767 18.6707 7.87786 19.5282 6.66532 18.1291 L 2.48861 13.3099 Z M 4.5676 11.3451 C 4.24185 11.7209 4.24185 12.2791 4.5676 12.6549 L 8.1767 16.8193 V 14.5 C 8.1767 13.6716 8.84827 13 9.6767 13 L 16.1767 13 V 11 L 9.6767 11 C 8.84827 11 8.1767 10.3284 8.1767 9.50001 L 8.1767 7.18074 L 4.5676 11.3451 Z" />
            </svg>
            <p>Sign Out</p>
          </div>
        </div>
      </main>

      <BottomMenu />
    </div>
  );
};

export default SettingsPage;
