import { apiSlice } from "../api-slice";

export const fiscalYearApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchFiscalYear: builder.query({
            query: () => `fiscalYear`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, arg) => {
                return [{ type: 'fiscalYear' }];
            },
        }),
        GetAllFiscalYear: builder.query({   //read
            query: (location) => {
                return {
                    url: `fiscalYear`,
                    params: {
                        PageNumber: location.PageNumber,
                        PageSize: location.PageSize,
                    },
                    method: "GET"
                }
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
    
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'FiscalYear', id })) : ['FiscalYear'],
        })
    })
  
})

export const { useFetchFiscalYearQuery,useGetAllFiscalYearQuery } = fiscalYearApiSlice