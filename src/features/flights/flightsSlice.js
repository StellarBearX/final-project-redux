import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL environment variable is missing.');
  }
  return url;
};

// Async Thunks
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/flights`);
      if (!response.ok) {
        throw new Error(`Failed to fetch flights: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFlightById = createAsyncThunk(
  'flights/fetchFlightById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/flights/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch flight detail: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFlight = createAsyncThunk(
  'flights/addFlight',
  async (flightData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/flights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData),
      });
      if (!response.ok) {
        throw new Error(`Failed to add flight: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFlight = createAsyncThunk(
  'flights/updateFlight',
  async ({ id, flightData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/flights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update flight: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFlight = createAsyncThunk(
  'flights/deleteFlight',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${getApiUrl()}/flights/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete flight: ${response.statusText}`);
      }
      return id; // Return the deleted id to remove from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filter: 'ALL', // 'ALL' | 'ON_TIME' | 'BOARDING' | 'DELAYED' | 'CANCELLED'
  selectedFlight: null,
};

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    clearSelectedFlight(state) {
      state.selectedFlight = null;
    }
  },
  extraReducers: (builder) => {
    // ── fetchFlights Cases ──
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch flights';
      });

    // ── fetchFlightById Cases ──
    builder
      .addCase(fetchFlightById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.selectedFlight = null;
      })
      .addCase(fetchFlightById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedFlight = action.payload;
      })
      .addCase(fetchFlightById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch flight detail';
      });

    // ── addFlight Cases ──
    builder
      .addCase(addFlight.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addFlight.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload); // Add new flight to beginning of list
      })
      .addCase(addFlight.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add flight';
      });

    // ── updateFlight Cases ──
    builder
      .addCase(updateFlight.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedFlight && state.selectedFlight.id === action.payload.id) {
          state.selectedFlight = action.payload;
        }
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update flight';
      });

    // ── deleteFlight Cases ──
    builder
      .addCase(deleteFlight.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete flight';
      });
  },
});

export const { setFilter, clearSelectedFlight } = flightsSlice.actions;
export default flightsSlice.reducer;
