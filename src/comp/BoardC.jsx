import React from 'react';
import { Link } from "react-router-dom";
import styles from '../styles/components/BoardCard.module.css';
import buttonStyles from '../styles/base/Buttons.module.css';

function BoardC({ board, onDel, canDelete }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{board.title}</h3>
      <Link to={`/board/${board.id}`} className={`${buttonStyles.primary} ${styles.viewButton}`}>
        View
      </Link>
      {canDelete && (
        <button onClick={onDel} className={`${buttonStyles.danger} ${styles.deleteButton}`}>
          Del
        </button>
      )}
    </div>
  );
}

export default React.memo(BoardC);