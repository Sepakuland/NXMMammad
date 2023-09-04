import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../../features/api-slice';
import { withReduxStateSync } from 'redux-state-sync';
import { authReducer } from '../auth.slice';
import { usersReducer } from '../users.slice';
import reducers from '.';

