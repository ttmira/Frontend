import { useTheme } from "../theme-context";
import TaskB from "../comp/TaskB";
import { Link } from "react-router-dom";

export default function Board() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="board-page">
       <Link to="/" className="home-button">
          ← Home
        </Link>
      <button 
        onClick={toggleTheme} 
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <TaskB />
    </div>
  );
}