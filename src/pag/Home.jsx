import BoardL from "../comp/BoardL";
import { useTheme } from "../theme-context";
import LogoutButton from "./Log";
import { useAuth } from "../auth/AuthContext";
import styles from './Home.module.css';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1>{user?.name}'s boards</h1>
        <button 
          onClick={toggleTheme} 
          className={styles.themeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <BoardL />
      <div className={styles.logoutButton}>
        <LogoutButton />
      </div>
    </div>
  );
}