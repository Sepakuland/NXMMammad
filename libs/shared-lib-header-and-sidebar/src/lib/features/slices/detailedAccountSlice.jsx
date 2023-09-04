import { apiSlice } from "../api-slice";

export const detailedAccountApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchDetailedAccount: builder.query({
            query: (queryString) => `DetailedAccount/Search?${queryString}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            // providesTags: (result) =>
            //     result ? result.map(({ id }) => ({ type: 'DetailedAccount', id })) : ['DetailedAccount'],
        }),
        addDetailedAccount: builder.mutation({
            //Post
            query: (detailedAccount) => {
                return {
                    url: `detailedAccount`,
                    method: "POST",
                    body: detailedAccount,
                };
            },
            invalidatesTags: ["DetailedAccount"],
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetDetailedAccount4: builder.query({   //read
            query: (args) => {
                const { obj, querySearchParams } = args
                return {
                    url: `DetailedAccount/GetDetailedAccount4?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllDetailedAccount4: builder.query({   //read
            query: (querySearchParams) => {
                return {
                    url: `DetailedAccount/GetAllDetailedAccount4?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    // , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetDetailedAccount5: builder.query({   //read
            query: (args) => {
                const { obj, querySearchParams } = args
                return {
                    url: `DetailedAccount/GetDetailedAccount5?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllDetailedAccount5: builder.query({   //read
            query: (querySearchParams) => {

                return {
                    url: `DetailedAccount/GetAllDetailedAccount5?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetDetailedAccount6: builder.query({   //read
            query: (args) => {

                const { obj, querySearchParams } = args
                return {
                    url: `DetailedAccount/GetDetailedAccount6?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllDetailedAccount6: builder.query({   //read
            query: (querySearchParams) => {
                return {
                    url: `DetailedAccount/GetAllDetailedAccount6?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        CustomerChosenCodingDetailedType4: builder.query({   //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/CustomerChosenCodingDetailedType4/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        AllCustomerChosenCodingDetailedType4: builder.query({   //read
            query: (querySearchParams) => {
                return {
                    url: `DetailedAccount/GetAllDetailedAccount4?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    // , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        CustomerChosenCodingDetailedType5: builder.query({   //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/CustomerChosenCodingDetailedType5/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        AllCustomerChosenCodingDetailedType5: builder.query({   //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/AllCustomerChosenCodingDetailedType5/${id}?${querySearchParams}`,
                    // params: {
                    //     PageNumber: obj.PageNumber,
                    //     PageSize: obj.PageSize,
                    // },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    // , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        CustomerChosenCodingDetailedType6: builder.query({   //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/CustomerChosenCodingDetailedType6/${id}?${querySearchParams}`,
                    params: {
                        PageNumber: obj.PageNumber,
                        PageSize: obj.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                    , header: meta.response.headers.get('pagination')
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        AllCustomerChosenCodingDetailedType6: builder.query({   //read
            query: (arg) => {
                const { querySearchParams, id } = arg
                return {
                    url: `DetailedAccount/AllCustomerChosenCodingDetailedType6/${id}?${querySearchParams}`,
                    method: "GET"
                }
            },
            transformResponse(response, meta) {
                return {
                    data: response.data
                }
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllDetailedAccount: builder.query({
            // read
            query: (arg) => {
                const { obj, isDetailedAccountActive, detailedTypeID } = arg;
                let params = {
                    PageNumber: obj.PageNumber,
                    PageSize: obj.PageSize,
                    IsDetailedAccountActive: isDetailedAccountActive,
                };
                if (detailedTypeID) {
                    params.DetailedTypeID = detailedTypeID.toString();
                }
                return {
                    url: `detailedAccount`,
                    params,
                    method: "GET",
                };
            },
            // each detailedType have too many detailedAccount and they have one to many realation so i want to filter on this facade code based on each detailedType that clicked
            transformResponse(response, meta) {
                return {
                    data: response.data,
                    header: meta.response.headers.get("pagination"),
                };
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),

        GetDetailedType4_WithGroupId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType4_WithGroupId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
        }),
        GetAllDetailedType4_WithGroupId: builder.query({
            //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetAllDetailedType4_WithGroupId/${id}?${querySearchParams}`,
                    method: "GET",
                };
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                };
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) => ['DetailedAccount']
        }),
        GetDetailedType4_WithTotalId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType4_WithTotalId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedType4_WithTotalId: builder.query({
            //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetAllDetailedType4_WithTotalId/${id}?${querySearchParams}`,
                    method: "GET",
                };
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                };
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            providesTags: (result) => ['DetailedAccount']
        }),
        GetDetailedType5_WithGroupId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType5_WithGroupId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedType5_WithGroupId: builder.query({  //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetAllDetailedType5_WithGroupId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetDetailedType5_WithTotalId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType5_WithTotalId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedType5_WithTotalId: builder.query({
            
            //read
            query: (arg) => {
                const { querySearchParams, id } = arg
                console.log("arggg",arg)
                return {
                    url: `DetailedAccount/GetAllDetailedType5_WithTotalId/${id}?${querySearchParams}`,
                    method: "GET",
                };
            },
            transformResponse(response, meta) {
                return {
                    data: response.data,
                };
            },
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            providesTags: (result) => ['DetailedAccount']
        }),
        GetDetailedType6_WithGroupId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType6_WithGroupId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedType6_WithGroupId: builder.query({  //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetAllDetailedType6_WithGroupId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetDetailedType6_WithTotalId: builder.query({
            //read
            query: (arg) => {
                const { obj, id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetDetailedType6_WithTotalId/${id}?${querySearchParams}`,
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedType6_WithTotalId: builder.query({
            //read
            query: (arg) => {
                const { id, querySearchParams } = arg
                return {
                    url: `DetailedAccount/GetAllDetailedType6_WithTotalId/${id}?${querySearchParams}`,
                    // params: {
                    //     PageNumber: obj.PageNumber,
                    //     PageSize: obj.PageSize,
                    // },
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

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
        GetAllDetailedAccountPrint: builder.query({   //read
            query: (querySearchParams) => {
                return {
                    url: `DetailedAccount/GetAllDetailedAccountPrint`,
                    method: "GET"
                }
            },

            transformResponse(response, meta) {
                return {
                    data: response.data,
                    // header: meta.response.headers.get('pagination')
                }
            },

            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            // providesTags: (result, page) =>
            //     result ? result.map(({ id }) => ({ type: 'Coding', id })) : ['Coding'],
        }),
        deleteDetailedAccount: builder.mutation({
            //Delete
            query: (id) => {
                return {
                    url: `detailedAccount/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: (result, error, { arg }) => {
                return [
                    { type: 'DetailedAccount', id: arg?.detailedAccountId },
                ];
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        updateDetailedAccount: builder.mutation({      //Update
            invalidatesTags: (result, error) => error ? [] : ['DetailedAccount'],
            query: (args) => {
                const { id, detailedAccount } = args;
                return {
                    url: `DetailedAccount/Update/${id}`,
                    body: detailedAccount,
                    method: "PUT",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        getDetailedAccountById: builder.query({
            query: (id) => `detailedAccount/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, id) => [
                { type: "DetailedAccount", id },
            ],
        }),
        GetDetailedAccount_DetailedTypeId: builder.query({
            query: (id) => `GetDetailedAccount_DetailedTypeId/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, id) => [
                { type: "GetDetailedAccount_DetailedTypeId", id },
            ],
        }),
        GetChooseByDetailedPartialArticles: builder.query({
            query: (queryString) => `DetailedAccount/GetChooseByDetailedPartialArticles?${queryString}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetNextDetailedCode: builder.query({
            query: (detailedTypeId) => `DetailedAccount/NextDetailedCode/${detailedTypeId}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
        }),
        GetAllDetailedAccountForEntityPagePrint: builder.query({
            // read
            query: (arg) => {
                const { isDetailedAccountActive, detailedTypeID } = arg;
                let params = {
                    IsDetailedAccountActive: isDetailedAccountActive,
                };
                if (detailedTypeID) {
                    params.DetailedTypeID = detailedTypeID.toString();
                }
                return {
                    url: `detailedAccount`,
                    params,
                    method: "GET",
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

            providesTags: (result) => ['DetailedAccount']
            // result ? result.map(({ id }) => ({ type: 'AccountingDocument', id })) : ['AccountingDocument'],
        }),
    }),
})




export const
    { useSearchDetailedAccountQuery, useCustomerChosenCodingDetailedType4Query,
        useAddDetailedAccountMutation, useGetDetailedAccount6Query,
        useGetDetailedAccount5Query, useGetDetailedAccount4Query,
        useCustomerChosenCodingDetailedType5Query, useCustomerChosenCodingDetailedType6Query,
        useAllCustomerChosenCodingDetailedType4Query, useAllCustomerChosenCodingDetailedType5Query,
        useAllCustomerChosenCodingDetailedType6Query, useGetDetailedType6_WithTotalIdQuery, useGetAllDetailedType6_WithTotalIdQuery,
        useGetAllDetailedAccount5Query, useGetAllDetailedAccount6Query, useGetAllDetailedAccount4Query,
        useGetAllDetailedAccountQuery, useGetDetailedType4_WithGroupIdQuery, useGetDetailedType5_WithGroupIdQuery
        , useGetDetailedType6_WithGroupIdQuery, useGetAllDetailedType6_WithGroupIdQuery, useGetDetailedType4_WithTotalIdQuery
        , useGetAllDetailedType4_WithTotalIdQuery, useGetAllDetailedType4_WithGroupIdQuery, useGetAllDetailedAccountPrintQuery,
        useGetAllDetailedType5_WithTotalIdQuery, useGetDetailedType5_WithTotalIdQuery, useGetAllDetailedType5_WithGroupIdQuery,
        useDeleteDetailedAccountMutation, useUpdateDetailedAccountMutation, useGetDetailedAccountByIdQuery, useGetDetailedAccount_DetailedTypeIdQuery,
        useGetChooseByDetailedPartialArticlesQuery, useGetNextDetailedCodeQuery,useGetAllDetailedAccountForEntityPagePrintQuery
    }
        = detailedAccountApiSlice