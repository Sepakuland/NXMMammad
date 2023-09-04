import { apiSlice } from "../api-slice";

export const GeneralDocumentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetAllGeneralDocuments: builder.query({ // Read
            query: (pagination) => {
                return {
                    url: `GeneralDocument`,
                    params: {
                        PageNumber: pagination.PageNumber,
                        PageSize: pagination.PageSize
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                    header: meta.response.headers.get("pagination"),
                };
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) => ['GeneralDocument'],
        }),
        CreateGeneralDocument: builder.mutation({ //Create
            invalidatesTags: (result, error, arg) => {
                return [{ type: "GeneralDocument", id: arg?.generalDocumentId }];
            },
            query: (document) => {
                return {
                    url: '/GeneralDocument',
                    body: document,
                    method: "POST"
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GeneralOfficeReports: builder.query({
            //read
            query: (args) => {
                const { obj, query } = args
                return {
                    url: `GeneralDocument/OfficeReports_Total?${query}`,
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

            providesTags: (result) => ['GeneralDocument']
        }),
        GeneralOfficeReports_print: builder.query({ 
            //read
            query: (query) => {
                return {
                    url: `GeneralDocument/OfficeReports_TotalPrint?${query}`,
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

            providesTags: (result) => ['GeneralDocument']
        }),

        GetGeneralDocumentsPrint: builder.query({ //Read
            query: (queryString) => `GeneralDocument/GetGeneralDocumentsPrint?${queryString}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        deleteGeneralDocument: builder.mutation({        //Delete
            query: (id) => {
                return {
                    url: `/GeneralDocument/${id}`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ['GeneralDocument'],
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        fetchFilteredGeneralDocument: builder.mutation({  //Read, Filter
            query: (args) => {
                const { obj, filter } = args
                return {
                  url: `/GeneralDocument/GetFiltered`,
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
        })
    })
})

export const {
    useGetAllGeneralDocumentsQuery,
    useCreateGeneralDocumentMutation,
    useGeneralOfficeReportsQuery,
    useGeneralOfficeReports_printQuery,
    useGetGeneralDocumentsPrintQuery,
    useDeleteGeneralDocumentMutation,
    useFetchFilteredGeneralDocumentMutation
} = GeneralDocumentApiSlice