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
      style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100%',
        backgroundColor: isOver ? 'rgba(0,0,0,0.1)' : 'transparent',
        transition: 'background-color 0.2s',
        padding: '10px 0'
      }}
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
    return <div className="loading">Loading board...</div>;
  }

  if (!board) {
    return <div className="error-screen">Board not found</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`tB ${theme}`}>
        <div className="board-header">
          <h1>{board.title}</h1>
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)} className="btn dismiss">
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="cols-container">
          <div className="cols">
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
              <div className="add-column-form">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Column title"
                  autoFocus
                />
                <div className="form-actions">
                  <button onClick={addCol} className="btn confirm">
                    Add Column
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)} 
                    className="btn cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)} 
                className="btn add-column"
              >
                + Add Column
              </button>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}