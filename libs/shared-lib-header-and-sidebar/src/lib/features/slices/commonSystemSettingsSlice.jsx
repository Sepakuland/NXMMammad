import { apiSlice } from '../api-slice'

export const settingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchSettings: builder.query({      //Read    
            query: () => `CommonSystemSettings`,
            transformResponse: (response, meta, arg) => response.data[0],
            transformErrorResponse : (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, arg) => {
                   return [{ type: 'Settings', id: arg?.branchId }];
                 },
        }),

        updateCodingLength: builder.mutation({      //Update
            invalidatesTags: ['Settings', 'Coding', 'DetailedAccount'],
            query: (args) => {
              const { id, settings } = args;
              return {
                url: `CommonSystemSettings/UpdateCodingLength/${id}`,
                body: settings,
                method: "PUT",
              };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse : (response, meta, arg) => response.data.errorList,
          }),
        
    })
})

export const { useFetchSettingsQuery, useUpdateCodingLengthMutation } = settingsApiSlice
