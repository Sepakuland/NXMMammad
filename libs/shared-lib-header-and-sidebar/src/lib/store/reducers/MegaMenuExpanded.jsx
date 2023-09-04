// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    expanded: localStorage.getItem('activeMegaMenu') == null ? false : localStorage.getItem('activeMegaMenu'),
};

// ==============================|| SLICE - MENU ||============================== //

const MegaMenuExpanded = createSlice({
    name: 'expandedMenu',
    initialState,
    reducers: {
        toggleExpanded(state, action) {
            state.expanded = action.payload.expanded;
        },
    }
});

export default MegaMenuExpanded.reducer;

export const {toggleExpanded} = MegaMenuExpanded.actions;