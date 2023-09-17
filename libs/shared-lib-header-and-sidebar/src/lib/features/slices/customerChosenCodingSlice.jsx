import { CodeSandboxCircleFilled } from '@ant-design/icons';
import { apiSlice } from '../features'

export const codingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCoding: builder.mutation({      //Create
            invalidatesTags: [{ type: 'Coding', id: 'LIST' }],
            query: (coding) => {
                return {
                    url: `/CustomerChosenCoding`,
                    body: coding,
                    method: "POST",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        fetchCodings: builder.query({      //Read    
            query: () => `CustomerChosenCoding`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Coding',
                            id,
                        })),
                        { type: 'Coding', id: 'LIST' },
                    ]
                    : [{ type: 'Coding', id: 'LIST' }],
        }),

        fetchCoding: builder.query({    //Read
            query: (id) => `CustomerChosenCoding/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, id) => [{ type: 'Coding', id }],
        }),

        updateCodingDetailedMatch: builder.mutation({      //Update
            invalidatesTags: (result, error, { id }) =>
                result
                    ? [
                        { type: 'Coding', id },
                        { type: 'Coding', id: 'LIST' },
                    ]
                    : [{ type: 'Coding', id: 'LIST' }],
            query: (match) => {
                return {
                    url: `/CustomerChosenCoding/MatchDetails`,
                    body: match,
                    method: "PUT",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        updateCoding: builder.mutation({      //Update
            invalidatesTags: (result, error, { id }) =>
                result
                    ? [
                        { type: 'Coding', id },
                        { type: 'Coding', id: 'LIST' },
                    ]
                    : [{ type: 'Coding', id: 'LIST' }],
            query: (args) => {
                const { id, coding } = args;
                return {
                    url: `CustomerChosenCoding/Update/${id}`,
                    body: coding,
                    method: "PUT",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

        }),

        deleteCoding: builder.mutation({        //Delete
            query: (id) => {
                return {
                    url: `/CustomerChosenCoding/${id}`,
                    method: "DELETE"
                };
            },
            // invalidatesTags: [{ type: 'Coding', id: 'LIST' }],
            invalidatesTags: ['Coding'],
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        addAutoCoding: builder.mutation({       //Post
            query: (companyType) => {
                return {
                    url: `CustomerChosenCoding/AddAutoCoding`,
                    method: "POST",
                    body: { codingType: companyType }
                }
            },
            invalidatesTags: ['Coding'],
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        searchCoding: builder.query({
            query: (queryString) => `CustomerChosenCoding/Search?${queryString}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingsWithMoeinAccounts_Group: builder.query({   //read
            query: (query) => {
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingsWithGroupAccounts?${query}`,
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                return {
                    data: response.data,
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingsWithMoeinAccounts_Total: builder.query({   //read
            query: (query) => {
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingsWithTotalAccounts?${query}`,
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                return { data: response.data, header: meta.response.headers.get('pagination') }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingsWithMoeinAccounts_Moein: builder.query({   //read
            query: (arg) => {
                const { obj, querySearchParams } = arg
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingsWithMoeinAccounts?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return { data: response.data, header: meta.response.headers.get('pagination') }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingDetailsTotal: builder.query({   //read
            query: (arg) => {

                const { obj, id, querySearchParams } = arg
                console.log("idddddd", id)
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingDetailsTotal/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                console.log("response.data", response.data)
                return {
                    data: response.data,
                    header: meta.response.headers.get('pagination')
                }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingDetailsMoein: builder.query({   //read

            query: (arg) => {

                const { obj, id, querySearchParams } = arg
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingDetailsMoein/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                return { data: response.data, header: meta.response.headers.get('pagination') }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingDetailsMoein_WithGroup: builder.query({   //read
            query: (arg) => {

                const { obj, id, querySearchParams } = arg
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingDetailsMoein_WithGroup/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                return { data: response.data, header: meta.response.headers.get('pagination') }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        GetAllCustomerChosenCodingsWithTotalAccountsForPrint: builder.query({   //read
            query: (querySearchParams) => {
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingsWithTotalAccountsForPrint?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingsWithMoeinAccountsForPrint: builder.query({   //read
            query: (query) => {
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingsWithMoeinAccountsForPrint${query}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingDetailsTotalForPrint: builder.query({   //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingDetailsTotalForPrint/${id}?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllCustomerChosenCodingDetailsMoein_WithGroupForPrint: builder.query({   //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `CustomerChosenCoding/GetAllCustomerChosenCodingDetailsMoein_WithGroupForPrint/${id}?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        MergeCodings: builder.mutation({      //Update
            invalidatesTags: (result, error, { id }) =>
                result
                    ? [
                        { type: 'Coding', id },
                        { type: 'Coding', id: 'LIST' },

                        { type: 'AccountingDocument', id },
                        { type: 'AccountingDocument', id: 'LIST' },

                        { type: 'AccountingDocumentRecycleBin', id },
                        { type: 'AccountingDocumentRecycleBin', id: 'LIST' },
                    ]
                    : [{ type: 'Coding', id: 'LIST' }, { type: 'AccountingDocument', id: 'LIST' }, { type: 'AccountingDocumentRecycleBin', id: 'LIST' },],
            query: (merge) => {
                return {
                    url: `/CustomerChosenCoding/Merge`,
                    body: merge,
                    method: "PUT",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),

        GetContraryToNatureCodings: builder.query({ //Read
            query: (args) => {
                const { pagination, query } = args;
                return {
                    url: `CustomerChosenCoding/ContraryToNatureCodings?${query}`,
                    params: {
                        PageNumber: pagination.PageNumber,
                        PageSize: pagination.PageSize,
                    },
                    method: "GET"
                };
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                    header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) => ['ContraryToNatureCodings'],
        }),

        GetAllProfitAndLossCodingsWithNonZeroBalance: builder.query({ //Read
            query: () => `CustomerChosenCoding/GetAllProfitAndLossCodingsWithNonZeroBalance`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        LostBenefit: builder.query({ //Read
            query: () => `CustomerChosenCoding/LostBenefit`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        UpdateOperationalStatus: builder.mutation({
            invalidatesTags: ['Coding'],
            query: (operationalStatus) => {
                return {
                    url: `/CustomerChosenCoding/UpdateOperationalStatus`,
                    body: operationalStatus,
                    method: "PUT",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        LostBenefitReport: builder.query({ //Read
            query: (query) => {

                return {
                    url: `CustomerChosenCoding/LostBenefitReport?${query.query}`,
                    method: 'GET'
                }
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        TotalBalanceSheetReport: builder.query({ //Read
            query: (args) => {
                const { fiscalYearId, query } = args;
                return {


                    url: `CustomerChosenCoding/TotalBalanceSheetReport/fiscalYearId?fiscalYearId=${fiscalYearId}&${query}`,
                    method: 'GET'
                }
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
    })
})

export const {
    useAddAutoCodingMutation, useCreateCodingMutation, useDeleteCodingMutation, useFetchCodingQuery
    , useFetchCodingsQuery, useGetAllCustomerChosenCodingDetailsMoeinQuery, useGetAllCustomerChosenCodingDetailsMoein_WithGroupForPrintQuery,
    useGetAllCustomerChosenCodingDetailsMoein_WithGroupQuery, useGetAllCustomerChosenCodingDetailsTotalForPrintQuery
    , useGetAllCustomerChosenCodingDetailsTotalQuery, useGetAllCustomerChosenCodingsWithMoeinAccountsForPrintQuery,
    useGetAllCustomerChosenCodingsWithMoeinAccounts_GroupQuery, useGetAllCustomerChosenCodingsWithMoeinAccounts_MoeinQuery
    , useGetAllCustomerChosenCodingsWithMoeinAccounts_TotalQuery, useGetAllCustomerChosenCodingsWithTotalAccountsForPrintQuery
    , useSearchCodingQuery, useUpdateCodingDetailedMatchMutation, useUpdateCodingMutation,
    useMergeCodingsMutation, useGetContraryToNatureCodingsQuery, useGetAllProfitAndLossCodingsWithNonZeroBalanceQuery
    , useLostBenefitQuery, useUpdateOperationalStatusMutation, useLostBenefitReportQuery,
    useTotalBalanceSheetReportQuery
} = codingApiSlice