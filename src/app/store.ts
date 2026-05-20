import { configureStore } from '@reduxjs/toolkit';
import { flightsApi } from '../features/flights/flightsApi';
import { fleetApi } from '../features/fleet/fleetApi';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [flightsApi.reducerPath]: flightsApi.reducer,
    [fleetApi.reducerPath]: fleetApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(flightsApi.middleware)
      .concat(fleetApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
