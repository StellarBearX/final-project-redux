import { createSelector } from '@reduxjs/toolkit';
import { flightsApi, type Flight } from './flightsApi';

/* Base selector — memoised RTK Query result */
const selectFlightsResult = flightsApi.endpoints.getFlights.select();

const selectAllFlights = createSelector(
  selectFlightsResult,
  (result) => result.data ?? [],
);

/* Derived: flights grouped by status with counts */
export interface FlightStats {
  total: number;
  onTime: number;
  delayed: number;
  cancelled: number;
  boarding: number;
}

export const selectFlightStats = createSelector(
  selectAllFlights,
  (flights: Flight[]): FlightStats => ({
    total: flights.length,
    onTime: flights.filter((f) => f.status === 'On Time').length,
    delayed: flights.filter((f) => f.status === 'Delayed').length,
    cancelled: flights.filter((f) => f.status === 'Cancelled').length,
    boarding: flights.filter((f) => f.status === 'Boarding').length,
  }),
);

/* Derived: flights filtered by a search term and optional status */
export const makeSelectFilteredFlights = (
  search: string,
  statusFilter: string,
) =>
  createSelector(selectAllFlights, (flights: Flight[]) => {
    const q = search.toLowerCase().trim();
    return flights.filter((f) => {
      const matchesSearch =
        !q ||
        f.flightNumber.toLowerCase().includes(q) ||
        f.origin.toLowerCase().includes(q) ||
        f.destination.toLowerCase().includes(q) ||
        f.gate.toLowerCase().includes(q);
      const matchesStatus =
        !statusFilter || statusFilter === 'All' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  });
