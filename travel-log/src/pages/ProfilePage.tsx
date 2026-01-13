import { users } from "../data/users";
import BottomMenu from '../components/BottomMenu';
import UserStats from '../components/UserStats';
import Achievements from '../components/Achivements';
import ProfileCountries from '../components/ProfileCountries';
import "../styles/pagesStyles/ProfilePage.scss";



const ProfilePage = () => {
  const user = users[0];
  return <div>
    <header>
      <img src={user.avatar} alt="Avatar" className="avatar" />
        <h2>{user.fullName}</h2>
        <p className="email">@{user.username}</p>
    </header>
    <main>
      <UserStats/>
      <Achievements/>
      <ProfileCountries/>
    </main>
    <BottomMenu />
  </div>;
}
export default ProfilePage;