import { apiSlice } from "../api-slice";

export const AreasPlacementSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAreasPlacement: builder.mutation({        //update
            invalidatesTags: (result, error, arg) => {
                return ['AreasPlacement', 'CoordinatesAreasPlacement']
            },
            query: (areas) => {
                return {
                    url: `/AreasPlacement`,
                    body: areas,
                    method: "POST"
                };
            },
            transformErrorResponse: (responce, meta, arg) => responce.data,
            transformErrorResponse: (responce, meta, arg) => responce.data.errorList,
        }),
        GetAllAreasPlacement: builder.query({
            query: () => `AreasPlacement`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'AreasPlacement', id })) : ['AreasPlacement']
        }),
        //get areas that have same parent 
        GetSameParent: builder.query({
            query: (id) => `AreasPlacement/GetSameParentFeature/${id}`,
            transformResponse: (response, meta, arg) => response?.data,
            transformErrorResponse: (response, meta, arg) => response?.data?.errorList,
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'AreasPlacement', id })) : ['AreasPlacement']
        }),
        GetSections: builder.query({
            query: (id) => `AreasPlacement/GetSections`,
            transformResponse: (response, meta, arg) => response?.data,
            transformErrorResponse: (response, meta, arg) => response?.data?.errorList,
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'AreasPlacement', id })) : ['AreasPlacement']
        }),
    })
})
export const { useGetAllAreasPlacementQuery, useGetSameParentQuery ,useGetSectionsQuery} = AreasPlacementSlice