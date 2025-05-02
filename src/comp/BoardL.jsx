import { useEffect, useState } from "react";
import BoardC from "./BoardC";
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../auth/AuthContext';
import { 
  loadUserBoards, 
  createUserBoard, 
  removeUserBoard 
} from '../redux/actions/boardActions';

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
    return <div className="loading">Loading boards...</div>;
  }

  if (error) {
    return (
      <div className="server-error">
        <h3>Connection Problem</h3>
        <p>{error}</p>
        <button 
          onClick={() => user && dispatch(loadUserBoards(user.id))} 
          className="btn retry"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bL">
      {userBoards.map((b) => (
        <BoardC 
          key={b.id} 
          board={b} 
          onDel={() => delB(b.id)}
          canDelete={b.ownerId === user?.id}
        />
      ))}
      
      {isAdding ? (
        <div className="addForm">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Board title"
            autoFocus
          />
          <button onClick={addB} className="btn">Add</button>
          <button onClick={() => setIsAdding(false)} className="btn cancel">×</button>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className="btn add">+ Add Board</button>
      )}
    </div>
  );
}