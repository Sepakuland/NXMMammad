import { apiSlice } from "../features";

export const detailedTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchDetailedTypes: builder.query({
      query: () => `detailedType`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result, error, arg) => {
        return [{ type: "DetailedType", id: arg?.detailedTypeID }];
      },
    }),
    deleteDetailedType: builder.mutation({
      //Delete
      query: (id) => {
        return {
          url: `/detailedType/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, arg) => {
        return [{ type: "DetailedType", id: arg?.detailedTypeID }];
      },
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    addDetailedType: builder.mutation({
      //Post
      query: (detailedType) => {
        return {
          url: `detailedType`,
          method: "POST",
          body: detailedType,
        };
      },
      invalidatesTags: ["DetailedType"],
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    updateDetailedType: builder.mutation({
      //put
      query: (args) => {
        const { id, detailedType } = args;
        return {
          url: `detailedType/Update/${id}`,
          method: "PUT",
          body: detailedType,
        };
      },
      invalidatesTags: (result, error) => error ? [] : ["DetailedType"],
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),

    FetchDetailedTypeById: builder.query({    //Read
      query: (id) => `DetailedType/${id}`,
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.errorList,
      providesTags: (result, error, id) => [{ type: 'DetailedType', id }],
  }),
  }),
});

export const {
  useFetchDetailedTypesQuery,
  useDeleteDetailedTypeMutation,
  useAddDetailedTypeMutation,
  useUpdateDetailedTypeMutation,
  useFetchDetailedTypeByIdQuery
} = detailedTypeApiSlice;
