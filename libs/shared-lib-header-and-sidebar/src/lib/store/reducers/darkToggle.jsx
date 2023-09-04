// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    darkmode: localStorage.getItem('mode') == null ? "light" : localStorage.getItem('mode'),
};

// ==============================|| SLICE - MENU ||============================== //

const darkToggle = createSlice({
    name: 'darkToggle',
    initialState,
    reducers: {
        toggleDarkMode(state, action) {
            state.darkmode = action.payload.darkmode;
        },
    }
});

export default darkToggle.reducer;

export const {toggleDarkMode} = darkToggle.actions;