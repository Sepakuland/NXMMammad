import { apiSlice } from "../api-slice";

export const accountingDocumentRecycleBinApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllAccountingDocumentRecycleBin: builder.query({
      //read
      query: (location) => {
        return {
          url: `accountingDocumentRecycleBin`,
          params: {
            PageNumber: location.PageNumber,
            PageSize: location.PageSize,
          },
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) =>['AccountingDocumentRecycleBin']
          // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    deleteAccountingDocumentRecycleBin: builder.mutation({
      //Delete
      query: (id) => {
        return {
          url: `accountingDocumentRecycleBin/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: "AccountingDocumentRecycleBin", id: arg?.documentId }];
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    recycleAccountingDocumentRecycleBin: builder.mutation({
      //Delete
      query: (id) => {
        return {
          url: `accountingDocumentRecycleBin/recycle/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: "AccountingDocumentRecycleBin", id: arg?.documentId }];
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAccountingDocumentRecyclebinsPrint: builder.query({
      //Read
      query: (queryString) =>
        `AccountingDocument/GetAccountingDocumentRecyclebinsPrint?${queryString}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
  }),
});

export const {
  useGetAllAccountingDocumentRecycleBinQuery,useDeleteAccountingDocumentRecycleBinMutation,useRecycleAccountingDocumentRecycleBinMutation, useGetAccountingDocumentRecyclebinsPrintQuery
} = accountingDocumentRecycleBinApiSlice;
