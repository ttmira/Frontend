import {
  ADD_COLUMN,
  UPDATE_COLUMN,
  DELETE_COLUMN,
  MOVE_COLUMN
} from '../types';
import { addColumn, updateColumn, deleteColumn } from '../../api/api';

export const addNewColumn = (boardId, title) => {
  return async (dispatch) => {
    try {
      const newColumn = await addColumn(boardId, title);
      dispatch({
        type: ADD_COLUMN,
        payload: { boardId, column: newColumn }
      });
      return newColumn;
    } catch (error) {
      console.error("Error adding column:", error);
      throw error;
    }
  };
};

export const updateExistingColumn = (boardId, columnId, newTitle) => {
  return async (dispatch) => {
    try {
      await updateColumn(boardId, columnId, newTitle);
      dispatch({
        type: UPDATE_COLUMN,
        payload: { boardId, columnId, newTitle }
      });
    } catch (error) {
      console.error("Error updating column:", error);
      throw error;
    }
  };
};


export const removeColumn = (boardId, columnId) => {
  return async (dispatch) => {
    try {
      await Promise.all(
        (state.tasks[boardId]?.[columnId]?.tasks || []).map(task => 
          dispatch(removeTask(boardId, columnId, task.id))
        )
      );
      await deleteColumn(boardId, columnId);  
      dispatch({
        type: 'DELETE_COLUMN',
        payload: { boardId, columnId }
      });
      dispatch(loadBoard(boardId));
    } catch (error) {
      console.error("Error deleting column:", error);
      throw error;
    }
  };
};

export const moveColumn = (boardId, fromIndex, toIndex) => ({
  type: MOVE_COLUMN,
  payload: { boardId, fromIndex, toIndex }
});