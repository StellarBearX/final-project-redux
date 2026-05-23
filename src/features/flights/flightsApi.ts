import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding';
  aircraftId: string;
  gate: string;
}

export type FlightPayload = Omit<Flight, 'id'>;

export const flightsApi = createApi({
  reducerPath: 'flightsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  tagTypes: ['Flight'],
  endpoints: (builder) => ({
    getFlights: builder.query<Flight[], void>({
      query: () => '/flights',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Flight' as const, id })),
              { type: 'Flight', id: 'LIST' },
            ]
          : [{ type: 'Flight', id: 'LIST' }],
    }),
    getFlightById: builder.query<Flight, string>({
      query: (id) => `/flights/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Flight', id }],
    }),
    createFlight: builder.mutation<Flight, FlightPayload>({
      query: (body) => ({ url: '/flights', method: 'POST', body }),
      invalidatesTags: [{ type: 'Flight', id: 'LIST' }],
    }),
    updateFlight: builder.mutation<Flight, { id: string; body: FlightPayload }>({
      query: ({ id, body }) => ({ url: `/flights/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Flight', id }],
    }),
    deleteFlight: builder.mutation<void, string>({
      query: (id) => ({ url: `/flights/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Flight', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFlightsQuery,
  useGetFlightByIdQuery,
  useCreateFlightMutation,
  useUpdateFlightMutation,
  useDeleteFlightMutation,
} = flightsApi;
