// third-party
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api-slice';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
// project import
import reducers from './reducers';
export * from './auth.slice';
export * from './users.slice';
// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //
export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
        // return getDefaultMiddleware().concat(apiSlice.middleware).concat(CheckEndpointsMiddleware()).concat(createStateSyncMiddleware(reduxStateSyncConfig))
    },
});

setupListeners(store.dispatch);

