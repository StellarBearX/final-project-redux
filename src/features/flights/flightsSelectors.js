import { createSelector } from '@reduxjs/toolkit';

export const selectAllFlights = state => state.flights.items;
export const selectFilter = state => state.flights.filter;

export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilter],
  (flights, filter) => filter === 'ALL' ? flights : flights.filter(f => f.status === filter)
);

export const selectFlightStats = createSelector(
  [selectAllFlights],
  (flights) => ({
    total: flights.length,
    onTime: flights.filter(f => f.status === 'ON_TIME').length,
    delayed: flights.filter(f => f.status === 'DELAYED').length,
    boarding: flights.filter(f => f.status === 'BOARDING').length,
    cancelled: flights.filter(f => f.status === 'CANCELLED').length,
  })
);
