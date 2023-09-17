import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const appConfig_WareHouse = window.globalConfig_Warehouse;
export const apiSlice_WareHouse = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${appConfig_WareHouse?.BaseURL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const { reducer } = getState();
      headers.set('fiscalYearId', reducer.fiscalYear.fiscalYearId);
      return headers;
    },
    // responseHandler: (response) => _.cloneDeep(response)
  }),
  // refetchOnFocus: true,

  tagTypes: ['Settings', 'Branch', 'MaintenanceCenter'],

  endpoints: () => ({}),
});
