import { combineReducers } from 'redux';
import boardReducer from './boardsReducer';
import columnReducer from './columnReducer';
import taskReducer from './taskReducer';

const rootReducer = combineReducers({
  boards: boardReducer,
  columns: columnReducer,
  tasks: taskReducer
});

export default rootReducer;