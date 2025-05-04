import { useTheme } from "../theme-context";
import TaskB from "../comp/TaskB";
import { Link } from "react-router-dom";
import styles from './Board.module.css';

export default function Board() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={styles.boardPage}>
      <Link to="/" className={styles.homeButton}>
        ← Home
      </Link>
      <button 
        onClick={toggleTheme} 
        className={styles.themeToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <TaskB />
    </div>
  );
}