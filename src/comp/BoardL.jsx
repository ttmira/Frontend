import { useEffect, useState } from "react";
import BoardC from "./BoardC";
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../auth/AuthContext';
import { 
  loadUserBoards, 
  createUserBoard, 
  removeUserBoard 
} from '../redux/actions/boardActions';
import styles from './BoardL.module.css';

export default function BoardL() {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const { userBoards, loading, error } = useSelector(state => state.boards);

  useEffect(() => {
    if (user) {
      dispatch(loadUserBoards(user.id));
    }
  }, [dispatch, user]);

  const addB = async () => {
    if (!newTitle.trim() || !user) return;
    try {
      await dispatch(createUserBoard(user.id, newTitle));
      setNewTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  const delB = async (id) => {
    if (!user) return;
    await dispatch(removeUserBoard(user.id, id));
  };

  if (loading) {
    return <div className={styles.loading}>Loading boards...</div>;
  }

  if (error) {
    return (
      <div className={styles.serverError}>
        <h3>Connection Problem</h3>
        <p>{error}</p>
        <button 
          onClick={() => user && dispatch(loadUserBoards(user.id))} 
          className={`${styles.btn} ${styles.retry}`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.boardList}>
      {userBoards.map((b) => (
        <BoardC 
          key={b.id} 
          board={b} 
          onDel={() => delB(b.id)}
          canDelete={b.ownerId === user?.id}
        />
      ))}
      
      {isAdding ? (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Board title"
            autoFocus
          />
          <div className={styles.formActions}>
            <button onClick={addB} className={styles.btn}>Add</button>
            <button onClick={() => setIsAdding(false)} className={`${styles.btn} ${styles.cancel}`}>×</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className={`${styles.btn} ${styles.add}`}>
          + Add Board
        </button>
      )}
    </div>
  );
}