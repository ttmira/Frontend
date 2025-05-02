import BoardL from "../comp/BoardL";
import { useTheme } from "../theme-context";
import LogoutButton from "./Log";
import {useAuth} from "../auth/AuthContext"

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  return (
    <div className="homeP">
      <div className="header">
        <h1>{user?.name}'s boards</h1>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <BoardL />
      <LogoutButton />
    </div>
  );
}