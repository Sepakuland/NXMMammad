import { apiSlice } from "../api-slice";

export const CoordinatesAreasPlacement = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // /api/CoordinatesAreasPlacement/GetById{id}
        getCoordinatesAreasPlacement: builder.query({
            query: (id) => `CoordinatesAreasPlacement/GetById${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'CoordinatesAreasPlacement', id })) : ['CoordinatesAreasPlacement'],
        })
    })

})
export const { useGetCoordinatesAreasPlacementQuery } = CoordinatesAreasPlacement