import { createSelector } from '@reduxjs/toolkit';
import { flightsApi } from './flightsApi';

// ── RTK Query cache selector ──────────────────────────────────────────────────
// flightsApi.endpoints.getFlights.select() returns a selector that reads the
// cached query result straight from the Redux store — no extra fetching.
const selectGetFlightsResult = flightsApi.endpoints.getFlights.select();

// Derive a plain array from the cache (default to [] while loading / on error).
export const selectAllFlights = (state) =>
  selectGetFlightsResult(state).data ?? [];

// Filter lives in the slim flightsSlice (UI-only state).
export const selectFilter = (state) => state.flights.filter;

// Normalize status strings for reliable comparison.
// Handles: "On Time" → "ON_TIME", "BOARDING" → "BOARDING", "on_time" → "ON_TIME"
const normalizeStatus = (s) => {
  if (!s) return 'UNKNOWN';
  return s.toUpperCase().trim().replace(/\s+/g, '_');
};

// ── Memoised selectors (createSelector bonus) ─────────────────────────────────

export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilter],
  (flights, filter) => {
    if (filter === 'ALL') return flights;
    return flights.filter((f) => normalizeStatus(f.status) === filter);
  }
);

export const selectFlightStats = createSelector(
  [selectAllFlights],
  (flights) => ({
    total:     flights.length,
    onTime:    flights.filter((f) => normalizeStatus(f.status) === 'ON_TIME').length,
    delayed:   flights.filter((f) => normalizeStatus(f.status) === 'DELAYED').length,
    boarding:  flights.filter((f) => normalizeStatus(f.status) === 'BOARDING').length,
    cancelled: flights.filter((f) => normalizeStatus(f.status) === 'CANCELLED').length,
  })
);
