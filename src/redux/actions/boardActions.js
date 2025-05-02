import {
  FETCH_USER_BOARDS_REQUEST,
  FETCH_USER_BOARDS_SUCCESS,
  FETCH_USER_BOARDS_FAILURE,
  CREATE_USER_BOARD,
  DELETE_USER_BOARD,
  FETCH_BOARD_REQUEST,
  FETCH_BOARD_SUCCESS,
  FETCH_BOARD_FAILURE,
  ADD_COLUMN,
  DELETE_COLUMN,
  MOVE_COLUMN 
} from '../types';
import { 
  fetchUserBoards as fetchUserBoardsAPI,
  createUserBoard as createUserBoardAPI,
  deleteUserBoard as deleteUserBoardAPI,
  fetchBoard, 
  addColumn,
  deleteColumn
} from '../../api/api';

export const fetchUserBoardsRequest = () => ({
  type: FETCH_USER_BOARDS_REQUEST
});

export const fetchBoardRequest = () => ({
  type: FETCH_BOARD_REQUEST
});

export const loadUserBoards = (userId) => async (dispatch) => {
  dispatch(fetchUserBoardsRequest());
  try {
    const boards = await fetchUserBoardsAPI(userId);
    dispatch({
      type: FETCH_USER_BOARDS_SUCCESS,
      payload: boards
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_BOARDS_FAILURE,
      payload: error.message
    });
  }
};

export const loadBoard = (boardId) => async (dispatch) => {
  dispatch(fetchBoardRequest());
  try {
    const board = await fetchBoard(boardId);
    dispatch({
      type: FETCH_BOARD_SUCCESS,
      payload: board
    });
  } catch (error) {
    dispatch({
      type: FETCH_BOARD_FAILURE,
      payload: error.message
    });
  }
};

export const createUserBoard = (userId, title) => async (dispatch) => {
  try {
    const newBoard = await createUserBoardAPI(userId, title);
    dispatch({
      type: CREATE_USER_BOARD,
      payload: newBoard
    });
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const removeUserBoard = (userId, boardId) => async (dispatch) => {
  try {
    await deleteUserBoardAPI(userId, boardId);
    dispatch({
      type: DELETE_USER_BOARD,
      payload: boardId
    });
  } catch (error) {
    throw error;
  }
};

export const addNewColumn = (boardId, title) => async (dispatch) => {
  try {
    const newColumn = await addColumn(boardId, title);
    dispatch({
      type: ADD_COLUMN,
      payload: { boardId, column: newColumn }
    });
    return newColumn;
  } catch (error) {
    throw error;
  }
};

export const removeColumn = (boardId, columnId) => async (dispatch) => {
  try {
    await deleteColumn(boardId, columnId);
    dispatch({
      type: DELETE_COLUMN,
      payload: { boardId, columnId }
    });
  } catch (error) {
    throw error;
  }
};

export const moveColumn = (boardId, fromIndex, toIndex) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: 'MOVE_COLUMN',
        payload: { boardId, fromIndex, toIndex }
      });
      
      const { currentBoard } = getState().boards;
      if (currentBoard && currentBoard.id === boardId) {
        await moveColumnOnServer(boardId, currentBoard.columns);
      }
    } catch (error) {
      console.error("Error moving column:", error);
    }
  };
};