import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Retired';
  yearOfManufacture: number;
}

export const fleetApi = createApi({
  reducerPath: 'fleetApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
  }),
  tagTypes: ['Aircraft'],
  endpoints: (builder) => ({
    getFleet: builder.query<Aircraft[], void>({
      query: () => '/aircraft',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Aircraft' as const, id })),
              { type: 'Aircraft', id: 'LIST' },
            ]
          : [{ type: 'Aircraft', id: 'LIST' }],
    }),
  }),
});

export const { useGetFleetQuery } = fleetApi;
