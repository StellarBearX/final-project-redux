import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from '../features/flights/flightsSlice';
import fleetReducer from '../features/fleet/fleetSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    fleet: fleetReducer,
    ui: uiReducer
  }
});
