import { createSelector } from '@reduxjs/toolkit';

export const selectAllFlights = state => state.flights.items;
export const selectFilter = state => state.flights.filter;

// Normalize status strings for reliable comparison
// Handles all formats: "On Time" → "ON_TIME", "BOARDING" → "BOARDING", "on_time" → "ON_TIME"
const normalizeStatus = (s) => {
  if (!s) return 'UNKNOWN';
  return s.toUpperCase().trim().replace(/\s+/g, '_');
};

export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilter],
  (flights, filter) => {
    if (filter === 'ALL') return flights;
    return flights.filter(f => normalizeStatus(f.status) === filter);
  }
);

export const selectFlightStats = createSelector(
  [selectAllFlights],
  (flights) => ({
    total: flights.length,
    onTime:    flights.filter(f => normalizeStatus(f.status) === 'ON_TIME').length,
    delayed:   flights.filter(f => normalizeStatus(f.status) === 'DELAYED').length,
    boarding:  flights.filter(f => normalizeStatus(f.status) === 'BOARDING').length,
    cancelled: flights.filter(f => normalizeStatus(f.status) === 'CANCELLED').length,
  })
);
