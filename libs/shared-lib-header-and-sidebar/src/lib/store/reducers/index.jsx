// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import darkToggle from './darkToggle';
import MegaMenuExpanded from './MegaMenuExpanded';
import fiscalYear from './fiscalYear';
import { apiSlice } from '../../features/api-slice';
import { authReducer } from '../auth.slice';
import { usersReducer } from '../users.slice';

// ==============================|| COMBINE REDUCERS ||============================== //

const nonApiReducers = combineReducers({
  darkToggle,
  menu,
  MegaMenuExpanded,
  fiscalYear,
});
const reducers = combineReducers({
  reducer: nonApiReducers,
  auth: authReducer,
  users: usersReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
export default reducers;
