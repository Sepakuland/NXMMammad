import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const appConfig = window.globalConfig;
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${appConfig?.BaseURL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const { reducer } = getState();
      headers.set("fiscalYearId", reducer.fiscalYear.fiscalYearId);
      return headers;
    },
    // responseHandler: (response) => _.cloneDeep(response) 
  }),
  // refetchOnFocus: true,

  tagTypes: [
    "Settings",
    "Coding",
    "DetailedType",
    "DetailedAccount",
    "DocumentDefinition",
    "AccountingDocument",
    "Branch",
    "AccountingDocumentRecycleBin",
    "AccountingDocumentNumbers",
    "GeneralDocument",
    "ContraryToNatureCodings",
    "ContraryToNatureArticles"
  ],

  endpoints: () => ({}),
});

