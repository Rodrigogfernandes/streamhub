import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Channels', 'Categories', 'ImportJob'],
  endpoints: () => ({}),
});

export const {
  useLazyGetChannelsQuery,
  useGetChannelQuery,
  useCreateChannelMutation,
  useBulkUpsertChannelsMutation,
  useCreateImportJobMutation,
  useGetImportJobQuery,
} = api;
