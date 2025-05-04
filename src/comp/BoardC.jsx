import React from "react";
import { Link } from "react-router-dom";
import styles from './BoardC.module.css';

function BoardC({ board, onDel, canDelete }) {
  return (
    <div className={styles.boardCard}>
      <h3 className={styles.boardTitle}>{board.title}</h3>
      <div className={styles.actions}>
        <Link to={`/board/${board.id}`} className={styles.viewButton}>View</Link>
        {canDelete && (
          <button onClick={onDel} className={styles.deleteButton}>Del</button>
        )}
      </div>
    </div>
  );
}

export default React.memo(BoardC);