import { apiSlice } from "../features";

export const accountingDocumentArticlesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetAllContraryToNatureArticles: builder.query({ //Read
            query: (args) => {
                const { pagination, query } = args;
                return {
                    url: `AccountingDocumentArticle/ContraryToNatureArticles?${query}`,
                    params: {
                        PageNumber: pagination.PageNumber,
                        PageSize: pagination.PageSize
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
            providesTags: (result) => ['ContraryToNatureArticles'],
        })
    })
});

export const {
    useGetAllContraryToNatureArticlesQuery
} = accountingDocumentArticlesApiSlice;