import React, { useState, useRef, useCallback } from "react";
import TaskC from "./TaskC";
import { useDispatch, useSelector } from 'react-redux';
import { addNewTask, updateExistingTask, removeTask, moveTask } from '../redux/actions/taskActions';
import { useTaskDrag, useTaskDrop } from '../utils/dnd';
import styles from './Column.module.css';

const DraggableTask = React.memo(({ task, columnId, index, onEdit, onDel, onMoveTask, onDragEnd }) => {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useTaskDrag(
    { 
      id: task.id,
      text: task.text,
      columnId,
      index
    },
    ref,
    onDragEnd
  );

  const [, drop] = useTaskDrop(
    columnId,
    index,
    ref,
    onMoveTask
  );

  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      className={`${styles.draggableTask} ${isDragging ? styles.isDragging : ''}`}
    >
      <TaskC
        task={task}
        onEdit={onEdit}
        onDel={onDel}
      />
    </div>
  );
});

export default React.memo(function Column({ boardId, column, onDelCol }) {
  const [newText, setNewText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const tasks = useSelector(state => {
    const boardTasks = state.tasks[boardId] || {};
    const columnTasks = boardTasks[column?.id] || {};
    return columnTasks.tasks || column?.tasks || [];
  });

  const handleDragEnd = useCallback(async ({ taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex }) => {
    try {
      const taskToMove = tasks.find(t => t?.id === taskId);
      if (!taskToMove) return;
  
      await dispatch(moveTask(
        boardId,
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
        taskToMove
      ));
    } catch (error) {
      console.error("Failed to move task:", error);
      setError("Failed to move task. Please try again.");
    }
  }, [boardId, tasks, dispatch]);

  const handleTaskMove = useCallback(({ taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex }) => {
    const taskToMove = tasks.find(t => t?.id === taskId);
    if (!taskToMove) return;

    dispatch(moveTask(
      boardId,
      sourceColumnId,
      destinationColumnId,
      sourceIndex,
      destinationIndex,
      taskToMove
    ));
  }, [boardId, tasks, dispatch]);

  const addT = useCallback(async () => {
    if (!newText.trim()) return;
    try {
      setError(null);
      await dispatch(addNewTask(boardId, column.id, newText));
      setNewText("");
      setIsAdding(false);
    } catch (err) {
      setError("Failed to add task");
    }
  }, [boardId, column.id, newText, dispatch]);

  const delT = useCallback(async (taskId) => {
    try {
      setError(null);
      await dispatch(removeTask(boardId, column.id, taskId));
    } catch (err) {
      setError("Failed to delete task");
    }
  }, [boardId, column.id, dispatch]);

  const handleTaskUpdate = useCallback(async (taskId, text) => {
    try {
      setError(null);
      await dispatch(updateExistingTask(boardId, column.id, taskId, text));
    } catch (err) {
      setError("Failed to update task");
    }
  }, [boardId, column.id, dispatch]);

  if (!column || !tasks) {
    return null;
  }

  return (
    <div className={styles.col}>
      <div className={styles.colHead}>
        <h3>{column.title}</h3>
        <button onClick={() => onDelCol(column.id)} className={`${styles.btn} ${styles.del}`}>
          Del
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError(null)} className={`${styles.btn} ${styles.dismiss}`}>
            ×
          </button>
        </div>
      )}

      {tasks.map((task, index) => (
        task && task.id && (
          <DraggableTask
            key={task.id}
            task={task}
            columnId={column.id}
            index={index}
            onEdit={handleTaskUpdate}
            onDel={delT}
            onMoveTask={handleTaskMove}
            onDragEnd={handleDragEnd}
          />
        )
      ))}
      
      {isAdding ? (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Task text"
            autoFocus
          />
          <div className={styles.formActions}>
            <button onClick={addT} className={styles.btn}>Add</button>
            <button onClick={() => setIsAdding(false)} className={`${styles.btn} ${styles.cancel}`}>
              ×
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className={`${styles.btn} ${styles.add}`}>
          + Add Task
        </button>
      )}
    </div>
  );
});