import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL environment variable is missing.');
  }
  return url;
};

// Async Thunks
export const fetchFleet = createAsyncThunk(
  'fleet/fetchFleet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/aircraft`);
      if (!response.ok) {
        throw new Error(`Failed to fetch aircraft fleet: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFleet.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFleet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFleet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch fleet registry';
      });
  },
});

export default fleetSlice.reducer;
