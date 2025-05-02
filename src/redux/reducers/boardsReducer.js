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

const initialState = {
  userBoards: [],    
  currentBoard: null, 
  loading: false,
  error: null
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_BOARDS_REQUEST:
    case FETCH_BOARD_REQUEST:
      return { ...state, loading: true, error: null };
      
    case FETCH_USER_BOARDS_SUCCESS:
      return { ...state, loading: false, userBoards: action.payload, error: null };
      
    case FETCH_BOARD_SUCCESS:
      return { ...state, loading: false, currentBoard: action.payload, error: null };
      
    case FETCH_USER_BOARDS_FAILURE:
    case FETCH_BOARD_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case CREATE_USER_BOARD:
      return { ...state, userBoards: [...state.userBoards, action.payload] };
      
    case DELETE_USER_BOARD:
      return { 
        ...state, 
        userBoards: state.userBoards.filter(board => board.id !== action.payload),
        currentBoard: state.currentBoard?.id === action.payload ? null : state.currentBoard
      };
      
    case ADD_COLUMN: {
      const { boardId, column } = action.payload;
      return {
        ...state,
        currentBoard: state.currentBoard?.id === boardId 
          ? {
              ...state.currentBoard,
              columns: [...(state.currentBoard.columns || []), column]
            }
          : state.currentBoard
      };
    }
      
    case DELETE_COLUMN: {
      const { boardId, columnId } = action.payload;
      return {
        ...state,
        currentBoard: state.currentBoard?.id === boardId
          ? {
              ...state.currentBoard,
              columns: state.currentBoard.columns.filter(col => col.id !== columnId)
            }
          : state.currentBoard
      };
    }
case MOVE_COLUMN: {
  const { boardId, fromIndex, toIndex } = action.payload;
  if (!state.currentBoard || state.currentBoard.id !== boardId) return state;
  
  const newColumns = [...state.currentBoard.columns];
  const [movedColumn] = newColumns.splice(fromIndex, 1);
  newColumns.splice(toIndex, 0, movedColumn);
  
  return {
    ...state,
    currentBoard: {
      ...state.currentBoard,
      columns: newColumns
    }
  };
}
    
    default:
      return state;
  }
};

export default boardReducer; 