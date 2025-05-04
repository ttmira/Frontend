import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTheme } from "../theme-context";
import { useDrop } from 'react-dnd';
import Column from "./Column";
import DraggableColumn from "./DraggableColumn";
import { ItemTypes } from '../utils/dnd';
import { loadBoard, addNewColumn, removeColumn, moveColumn } from '../redux/actions/boardActions';
import styles from './TaskB.module.css';

function ColumnDropTarget({ boardId, children }) {
  const dispatch = useDispatch();
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover(item, monitor) {
      if (!item || item.index === undefined) return;
      
      const dragIndex = item.index;
      const hoverIndex = item.hoverIndex;
      
      if (dragIndex === hoverIndex) return;
      
      dispatch(moveColumn(boardId, dragIndex, hoverIndex));
      item.index = hoverIndex;
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`${styles.droppableArea} ${isOver ? styles.isOver : ''}`}
    >
      {children}
    </div>
  );
}

export default function TaskB() {
  const { boardId } = useParams();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const { currentBoard: board, loading } = useSelector(state => state.boards);

  useEffect(() => {
    dispatch(loadBoard(boardId));
  }, [boardId, dispatch]);

  const handleColumnDrop = useCallback((item) => {
    if (item.type === ItemTypes.COLUMN) {
      dispatch(moveColumn(boardId, item.index, item.hoverIndex));
    }
  }, [boardId, dispatch]);

  const addCol = useCallback(async () => {
    if (!newTitle.trim()) return;
    try {
      setError(null);
      await dispatch(addNewColumn(boardId, newTitle));
      setNewTitle("");
      setIsAdding(false);
    } catch (err) {
      setError("Failed to add column");
    }
  }, [boardId, newTitle, dispatch]);

  const delCol = useCallback(async (columnId) => {
    if (!window.confirm("Delete this column and all its tasks?")) return;
    try {
      setError(null);
      await dispatch(removeColumn(boardId, columnId));
    } catch (err) {
      setError("Failed to delete column");
    }
  }, [boardId, dispatch]);

  if (loading) {
    return <div className={styles.loading}>Loading board...</div>;
  }

  if (!board) {
    return <div className={styles.errorScreen}>Board not found</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${styles.tB} ${theme}`}>
        <div className={styles.boardHeader}>
          <h1>{board.title}</h1>
          {error && (
            <div className={styles.errorMessage}>
              {error}
              <button onClick={() => setError(null)} className={`${styles.btn} ${styles.dismiss}`}>
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.colsContainer}>
          <div className={styles.cols}>
            <ColumnDropTarget boardId={boardId}>
              {board.columns?.map((column, index) => (
                <DraggableColumn
                  key={column.id}
                  boardId={boardId}
                  column={column}
                  index={index}
                  onDelCol={delCol}
                />
              ))}
            </ColumnDropTarget>
            
            {isAdding ? (
              <div className={styles.addColumnForm}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Column title"
                  autoFocus
                />
                <div className={styles.formActions}>
                  <button onClick={addCol} className={`${styles.btn} ${styles.btnConfirm}`}>
                    Add Column
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)} 
                    className={`${styles.btn} ${styles.btnCancel}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)} 
                className={`${styles.btn} ${styles.btnAddColumn}`}
              >
                <span>+</span> Add Column
              </button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}