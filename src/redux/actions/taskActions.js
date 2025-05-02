import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  MOVE_TASK
} from '../types';
import { api,addTask, updateTask, deleteTask } from '../../api/api';

export const addNewTask = (boardId, columnId, text) => {
  return async (dispatch) => {
    try {
      const newTask = await addTask(boardId, columnId, text);
      dispatch({
        type: ADD_TASK,
        payload: { boardId, columnId, task: newTask }
      });
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };
};

export const updateExistingTask = (boardId, columnId, taskId, newText) => {
  return async (dispatch) => {
    try {
      await updateTask(boardId, columnId, taskId, newText);
      dispatch({
        type: UPDATE_TASK,
        payload: { boardId, columnId, taskId, newText }
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
};

export const removeTask = (boardId, columnId, taskId) => {
  return async (dispatch) => {
    try {
      await deleteTask(boardId, columnId, taskId);
      dispatch({
        type: DELETE_TASK,
        payload: { boardId, columnId, taskId }
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };
};

export const moveTask = (
  boardId,
  sourceColumnId,
  destinationColumnId,
  sourceIndex,
  destinationIndex,
  task
) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: MOVE_TASK,
        payload: {
          boardId,
          sourceColumnId,
          destinationColumnId,
          sourceIndex,
          destinationIndex,
          task
        }
      });
      const { tasks } = getState();
      const boardTasks = tasks[boardId] || {};
      const updatedColumns = await api.get(`/boards/${boardId}`)
        .then(({ data: board }) => {
          return board.columns.map(column => {
            if (column.id === sourceColumnId) {
              return {
                ...column,
                tasks: boardTasks[sourceColumnId]?.tasks || []
              };
            }
            if (column.id === destinationColumnId) {
              return {
                ...column,
                tasks: boardTasks[destinationColumnId]?.tasks || []
              };
            }
            return column;
          });
        });
      await api.patch(`/boards/${boardId}`, { columns: updatedColumns });
      
    } catch (error) {
      console.error("Error moving task:", error);
      throw error;
    }
  };
};