import { apiSlice } from "../api-slice";

export const branchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({  //Read
        fetchBranches: builder.query({
            query: () => `Branch`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, arg) => {
                return [{ type: 'Branch' }];
            },
        })
    })
})

export const { useFetchBranchesQuery } = branchApiSlice