import { apiSlice } from "../features";

export const accountingDocumentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllAccountingDocument: builder.query({
      //read
      query: (args) => {
        const { obj, query } = args;
        return {
          url: `accountingDocument?${query}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
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

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetNextDocumentNumbers: builder.query({
      query: (queryString) =>
        `AccountingDocument/NextDocumentNumbers?${queryString}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result) => ["AccountingDocumentNumbers"],
    }),
    GetAllAccountingDocumentRIW: builder.query({
      //read
      query: (location) => {
        return {
          url: `accountingDocument/getAllAccountingDocumentRIW`,
          method: "GET",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "AccountingDocument", id }))
          : ["AccountingDocument"],
    }),
    getAccountingDocumentById: builder.query({
      query: (id) => `accountingDocument/${id}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result, error, id) => [
        { type: "AccountingDocumentById", id },
      ],
    }),

    deleteAccountingDocument: builder.mutation({
      //Delete
      query: (id) => {
        return {
          url: `accountingDocument/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: "AccountingDocument", id: arg?.documentId }];
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    createAccountingDocument: builder.mutation({
      //Create
      invalidatesTags: (result, error, arg) => {
        return [{ type: "AccountingDocument", id: arg?.documentId }, "Branch"];
      },
      query: (document) => {
        return {
          url: "/AccountingDocument",
          body: document,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    updateAccountingDocumentChangeState: builder.mutation({
      //Update
      invalidatesTags: ["AccountingDocument"],
      query: (args) => {
        const { documentId, changeState } = args;
        return {
          url: `AccountingDocument/UpdateChangeState/${documentId}`,
          body: changeState,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    multipleUpdateAccountingDocumentChangeState: builder.mutation({
      //Update
      invalidatesTags: ["AccountingDocument"],
      query: (args) => {
        const { AccountingDocumentChangeStateDTO } = args;
        return {
          url: `AccountingDocument/UpdateRange`,
          body: AccountingDocumentChangeStateDTO,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    updateAccountingDocument: builder.mutation({
      //Update
      invalidatesTags: ["AccountingDocument"],
      query: (args) => {
        const { id, accountingDocument } = args;
        return {
          url: `AccountingDocument/Update/${id}`,
          body: accountingDocument,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    createOpeningDocument: builder.mutation({
      invalidatesTags: ["AccountingDocument"],
      query: (openingDocument) => {
        return {
          url: "/AccountingDocument/CreateOpeningDocument",
          body: openingDocument,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    renumerateDocuments: builder.mutation({
      invalidatesTags: ["AccountingDocument", "AccountingDocumentRecycleBin"],
      query: () => {
        return {
          url: "/AccountingDocument/Renumerate",
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAccountCirculationById: builder.query({
      //read
      query: (args) => {
        const { obj, query, id, level, detailsId } = args;

        return {
          url: `/AccountingDocument/GetAccountCirculationById/${id}/${level}?${query}`,
          params:
            detailsId != null
              ? {
                  PageNumber: obj.PageNumber,
                  PageSize: obj.PageSize,
                  DetailsId: detailsId,
                }
              : {
                  PageNumber: obj.PageNumber,
                  PageSize: obj.PageSize,
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

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetAccountCirculationById_ForPrint: builder.query({
      //read
      query: (args) => {
        const { query, id, level, detailsId } = args;
        return {
          url: `/AccountingDocument/GetAccountCirculationById_ForPrint/${id}/${level}?${query}`,
          params:
            detailsId != null
              ? {
                  DetailsId: detailsId,
                }
              : null,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetDetailedAccount_DetailedTypeId: builder.query({
      //read
      query: (selectedOptions) => {
        return {
          url: `DetailedAccount/GetDetailedAccount_DetailedTypeId/${selectedOptions}`,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    permanentDocuments: builder.mutation({
      invalidatesTags: ["AccountingDocument"],
      query: (permanentDocument) => {
        return {
          url: "/AccountingDocument/MakeDocumentPermanent",
          body: permanentDocument,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetFirstGeneralizableDocument: builder.query({
      //Read
      query: () => `AccountingDocument/FirstGeneralizableDocument`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAllAccountingDocumentsByDocumentId: builder.query({
      //read
      query: (args) => {
        const { obj, query, id } = args;
        return {
          url: `/AccountingDocument/GetAllAccountingDocuments_DocumentId/${id}?${query}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
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

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetAllAccountingDocumentsByDocumentId_ForPrint: builder.query({
      //read
      query: (args) => {
        const { query, id } = args;
        return {
          url: `/AccountingDocument/GetAllAccountingDocuments_DocumentId_ForPrint/${id}?${query}`,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetAllAccountingDocumentsArticleByDocumentId: builder.query({
      //read
      query: (args) => {
        const { obj, query } = args;
        console.log("Queryis", query);
        return {
          url: `/AccountingDocument/GetAllAccountingDocumentsArticle_DocumentId?${query}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
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

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    OfficeReports: builder.query({
      //read
      query: (args) => {
        const { query, obj } = args;
        return {
          url: `/AccountingDocument/OfficeReports?${query}`,
          method: "GET",
          params: {
            PageSize: obj?.PageSize,
            PageNumber: obj?.PageNumber,
          },
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    OfficeReports_ForPrint: builder.query({
      //read
      query: (args) => {
        const { query } = args;
        return {
          url: `/AccountingDocument/OfficeReports_ForPrint?${query}`,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetAllArchive: builder.query({
      //read
      query: (args) => {
        const { obj, query } = args;
        return {
          url: `accountingDocument/GetAllArchive?${query}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
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

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    CloseProfitLossAccountsDocument: builder.mutation({
      //Create
      invalidatesTags: (result, error, arg) => {
        return [{ type: "AccountingDocument", id: arg?.documentId }, "Branch"];
      },
      query: (document) => {
        return {
          url: "/AccountingDocument/CloseProfitLossAccountsDocument",
          body: document,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    createClosingDocument: builder.mutation({
      invalidatesTags: ["AccountingDocument"],
      query: (closingDocument) => {
        return {
          url: "/AccountingDocument/CreateClosingDocument",
          body: closingDocument,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    OfficeTotalReports: builder.query({
      invalidatesTags: ["AccountingDocument"],
      query: (args) => {
        const { obj, query } = args;
        return {
          url: `accountingDocument/OfficeTotalReports?${query}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
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
    }),
    OfficeTotalReports_forPrint: builder.query({
      invalidatesTags: ["AccountingDocument"],
      query: (query) => {
        return {
          url: `accountingDocument/OfficeTotalReports_forPrint?${query}`,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
          // header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetOpeningDocumentInFiscalYear: builder.query({
      query: (fiscalYearId) =>
        `accountingDocument/OpeningDocumentInFiscalYear/${fiscalYearId}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    UpdateOpeningDocument: builder.mutation({
      invalidatesTags: ["AccountingDocument"],
      query: (openingDocument) => {
        return {
          url: "/AccountingDocument/UpdateOpeningDocument",
          body: openingDocument,
          method: "PUT",
        };
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAllAccountingDocumentTrialBalanceReport: builder.query({
      //read
      query: (args) => {
        const { query } = args;
        return {
          url: `/AccountingDocument/GetAllAccountingDocumentTrialBalanceReport?${query}`,
          method: "GET",
        };
      },
      transformResponse(response, meta) {
        return {
          data: response.data,
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,

      providesTags: (result) => ["AccountingDocument"],
      // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
    }),
    GetAccountingDocumentsPrint: builder.query({
      //Read
      query: (queryString) =>
        `AccountingDocument/GetAccountingDocumentsPrint?${queryString}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetAccountingDocumentFormData: builder.query({
      query: (id) => `AccountingDocument/FormData/${id}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) =>
        response.data.errorList,
    }),    
    GetFilteredDocument: builder.mutation({
      query: (args) => {
        const { obj, filter } = args
        return {
          url: `/AccountingDocument/GetFilteredDocument`,
          params: {
              PageNumber: obj.PageNumber,
              PageSize: obj.PageSize,
          },
          body: filter,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetFilteredNonbindingDocuments: builder.mutation({
      query: (args) => {
        const { obj, filter } = args
        return {
          url: `/AccountingDocument/GetFilteredNonBinding`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
          },
          body: filter,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    GetFilteredBindingDocuments: builder.mutation({
      query: (args) => {
        const { obj, filter } = args
        return {
          url: `/AccountingDocument/GetFilteredBinding`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
          },
          body: filter,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),

    FetchFilteredDocumentsInGeneral: builder.mutation({
      query: (args) => {
        const { obj, filter, generalDocumentId } = args
        return {
          url: `/AccountingDocument/GetFilteredInGeneral/${generalDocumentId}`,
          params: {
            PageNumber: obj.PageNumber,
            PageSize: obj.PageSize,
          },
          body: filter,
          method: "POST",
        };
      },
      transformResponse: (response, meta, arg) => {
        return {
          data: response.data,
          header: meta.response.headers.get("pagination"),
        };
      },
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
  }),
});

export const {
  useGetAllAccountingDocumentQuery,
  useGetAllAccountingDocumentsByDocumentId_ForPrintQuery,
  useGetAllAccountingDocumentRIWQuery,
  useGetAccountingDocumentByIdQuery,
  useDeleteAccountingDocumentMutation,
  useCreateAccountingDocumentMutation,
  useUpdateAccountingDocumentChangeStateMutation,
  useMultipleUpdateAccountingDocumentChangeStateMutation,
  useUpdateAccountingDocumentMutation,
  useCreateOpeningDocumentMutation,
  useRenumerateDocumentsMutation,
  useGetNextDocumentNumbersQuery,
  useGetAccountCirculationByIdQuery,
  useGetDetailedAccount_DetailedTypeIdQuery,
  useGetAllAccountingDocumentsByDocumentIdQuery,
  usePermanentDocumentsMutation,
  useGetFirstGeneralizableDocumentQuery,
  useGetAccountCirculationById_ForPrintQuery,
  useGetAllAccountingDocumentsArticleByDocumentIdQuery,
  useOfficeReportsQuery,
  useOfficeReports_ForPrintQuery,
  useGetAllArchiveQuery,
  useCloseProfitLossAccountsDocumentMutation,
  useCreateClosingDocumentMutation,
  useGetAllAccountingDocumentTrialBalanceReportQuery,
  useOfficeTotalReportsQuery,
  useOfficeTotalReports_forPrintQuery,
  useGetOpeningDocumentInFiscalYearQuery,
  useUpdateOpeningDocumentMutation,
  useGetAccountingDocumentFormDataQuery,
  useGetAccountingDocumentsPrintQuery,
  useGetFilteredDocumentMutation,
  useGetFilteredNonbindingDocumentsMutation,
  useGetFilteredBindingDocumentsMutation,
  useFetchFilteredDocumentsInGeneralMutation
} = accountingDocumentApiSlice;
