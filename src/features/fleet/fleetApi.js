import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fleetApi = createApi({
  reducerPath: 'fleetApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Aircraft'],
  endpoints: (builder) => ({

    // ── GET /aircraft ─────────────────────────────────────────────────────
    getFleet: builder.query({
      query: () => '/aircraft',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Aircraft', id })),
              { type: 'Aircraft', id: 'LIST' },
            ]
          : [{ type: 'Aircraft', id: 'LIST' }],
    }),
  }),
});

export const { useGetFleetQuery } = fleetApi;
