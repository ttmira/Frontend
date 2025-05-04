import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Log.module.css';

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <button 
      onClick={handleLogout}
      className={styles.logoutButton} 
    >
      Logout
    </button>
  );
}

export default LogoutButton;