import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  MOVE_TASK,
  FETCH_BOARD_SUCCESS
} from '../types';

const initialState = {};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BOARD_SUCCESS: {
      const { payload: board } = action;
      if (!board || !board.columns) return state;
      
      const newState = { ...state };
      newState[board.id] = {};
      
      board.columns.forEach(column => {
        if (column.id) {
          newState[board.id][column.id] = {
            tasks: Array.isArray(column.tasks) ? [...column.tasks] : []
          };
        }
      });
      
      return newState;
    }

    case ADD_TASK: {
      const { boardId, columnId, task } = action.payload;
      if (!boardId || !columnId || !task) return state;
      
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          [columnId]: {
            ...state[boardId]?.[columnId],
            tasks: [...(state[boardId]?.[columnId]?.tasks || []), task]
          }
        }
      };
    }

    case UPDATE_TASK: {
      const { boardId, columnId, taskId, newText } = action.payload;
      if (!boardId || !columnId || !taskId) return state;
      
      const columnTasks = state[boardId]?.[columnId]?.tasks;
      if (!Array.isArray(columnTasks)) return state;
      
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          [columnId]: {
            ...state[boardId][columnId],
            tasks: columnTasks.map(t => 
              t?.id === taskId ? { ...t, text: newText } : t
            )
          }
        }
      };
    }

    case DELETE_TASK: {
      const { boardId, columnId, taskId } = action.payload;
      if (!boardId || !columnId || !taskId) return state;
      
      const columnTasks = state[boardId]?.[columnId]?.tasks;
      if (!Array.isArray(columnTasks)) return state;
      
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          [columnId]: {
            ...state[boardId][columnId],
            tasks: columnTasks.filter(t => t?.id !== taskId)
          }
        }
      };
    }

case MOVE_TASK: {
  const { boardId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, task } = action.payload;
  const newState = JSON.parse(JSON.stringify(state));
  newState[boardId][sourceColumnId].tasks.splice(sourceIndex, 1);
  if (!newState[boardId][destinationColumnId]) {
    newState[boardId][destinationColumnId] = { tasks: [] };
  }
  newState[boardId][destinationColumnId].tasks.splice(destinationIndex, 0, task);
  
  return newState;
}
    default:
      return state;
  }
};

export default taskReducer; 