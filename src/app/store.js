import { configureStore } from '@reduxjs/toolkit';
import { flightsApi } from '../features/flights/flightsApi';
import { fleetApi } from '../features/fleet/fleetApi';
import flightsReducer from '../features/flights/flightsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    // RTK Query cache slices
    [flightsApi.reducerPath]: flightsApi.reducer,
    [fleetApi.reducerPath]:   fleetApi.reducer,

    // UI-only slices (filter state, modal state)
    flights: flightsReducer,
    ui:      uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(flightsApi.middleware)
      .concat(fleetApi.middleware),
});
