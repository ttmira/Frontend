import {
  ADD_COLUMN,
  UPDATE_COLUMN,
  DELETE_COLUMN,
  MOVE_COLUMN
} from '../types';

const columnReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_COLUMN: {
      const { boardId, column } = action.payload;
      const board = state[boardId] || { columns: [] };
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          columns: [...(state[boardId]?.columns||[]), column]
        }
      };
    }
    case UPDATE_COLUMN: {
      const { boardId, columnId, newTitle } = action.payload;
      const board = state[boardId];
      return {
        ...state,
        [boardId]: {
          ...board,
          columns: board.columns.map(col => 
            col.id === columnId ? { ...col, title: newTitle } : col
          )
        }
      };
    }
    case 'DELETE_COLUMN': {
      const { boardId, columnId } = action.payload;
      const boardColumns = state[boardId]?.columns || [];
      return {
        ...state,
        [boardId]: {
          columns: boardColumns.filter(col => col.id !== columnId)
        }
      };
    }
    
    case MOVE_COLUMN: {
      const { boardId, fromIndex, toIndex } = action.payload;
      const board = state[boardId];
      const newColumns = [...board.columns];
      const [removed] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, removed);
      
      return {
        ...state,
        [boardId]: {
          ...board,
          columns: newColumns
        }
      };
    }

    case 'MOVE_COLUMN': {
      const { boardId, fromIndex, toIndex } = action.payload;
      const columns = state[boardId]?.columns || [];
      
      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          columns: newColumns
        }
      };
    }

    default:
      return state;
  }
};

export default columnReducer;