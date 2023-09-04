import { createSlice } from '@reduxjs/toolkit';

const initialFiscalYearState = {
  fiscalYearId: 0, // initial selected year
};

const fiscalYearSlice = createSlice({
  name: 'fiscalYear',
  initialState: initialFiscalYearState,
  reducers: {
    setFiscalYearId: (state, action) => {
      state.fiscalYearId = action.payload;
    },
  },
});

export const { setFiscalYearId } = fiscalYearSlice.actions;

export default fiscalYearSlice.reducer;