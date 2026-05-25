import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const flightsApi = createApi({
  reducerPath: 'flightsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Flight'],
  endpoints: (builder) => ({

    // ── GET /flights ──────────────────────────────────────────────────────
    getFlights: builder.query({
      query: () => '/flights',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Flight', id })),
              { type: 'Flight', id: 'LIST' },
            ]
          : [{ type: 'Flight', id: 'LIST' }],
    }),

    // ── GET /flights/:id ──────────────────────────────────────────────────
    getFlightById: builder.query({
      query: (id) => `/flights/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Flight', id }],
    }),

    // ── POST /flights ─────────────────────────────────────────────────────
    createFlight: builder.mutation({
      query: (body) => ({
        url: '/flights',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Flight', id: 'LIST' }],
    }),

    // ── PUT /flights/:id ──────────────────────────────────────────────────
    updateFlight: builder.mutation({
      query: ({ id, flightData }) => ({
        url: `/flights/${id}`,
        method: 'PUT',
        body: flightData,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Flight', id },
        { type: 'Flight', id: 'LIST' },
      ],
    }),

    // ── DELETE /flights/:id ───────────────────────────────────────────────
    deleteFlight: builder.mutation({
      query: (id) => ({
        url: `/flights/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Flight', id },
        { type: 'Flight', id: 'LIST' },
      ],
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
