import { createSlice } from '@reduxjs/toolkit';

// This slice owns only UI state: the status filter chosen by the user.
// All server data (flight list, detail) is managed by flightsApi (RTK Query).

const flightsSlice = createSlice({
  name: 'flights',
  initialState: {
    filter: 'ALL', // 'ALL' | 'ON_TIME' | 'BOARDING' | 'DELAYED' | 'CANCELLED'
  },
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = flightsSlice.actions;
export default flightsSlice.reducer;
