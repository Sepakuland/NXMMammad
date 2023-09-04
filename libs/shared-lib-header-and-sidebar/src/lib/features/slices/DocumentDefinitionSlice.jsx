import { apiSlice } from "../api-slice";

export const documentDefinitionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        GetAllDocumentDefinition: builder.query({   //read
            query: (id) => `documentDefinition`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
    
            providesTags: (result) =>
                result ? result.map(({ id }) => ({ type: 'DocumentDefinition', id })) : ['DocumentDefinition'],
        }),
        GetAllDocumentDefinitionPaged: builder.query({   //read
            query: (location) => {
                return {
                    url: `documentDefinition`,
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
                result ? result.map(({ id }) => ({ type: 'DocumentDefinition', id })) : ['DocumentDefinition'],
        }),
        getDocumentDefinitionById: builder.query({
            query: (id) => `documentDefinition/${id}`,
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
            providesTags: (result, error, id) => [{ type: 'DocumentDefinition', id }],
        }),
        
    updateDocumentDefinition: builder.mutation({      //Update
        invalidatesTags: ['DocumentDefinition'],
        query: (args) => {
            const { id, documentDefinition } = args;
            return {
                url: `DocumentDefinition/Update/${id}`,
                body: documentDefinition,
                method: "PUT",
            };
        },
        transformResponse: (response, meta, arg) => response.data,
        transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
    createDocumentDefinition: builder.mutation({      //Update
        invalidatesTags: ['DocumentDefinition'],
        query: (args) => {
            const { id, documentDefinition } = args;
            return {
                url: `DocumentDefinition`,
                body: documentDefinition,
                method: "POST",
            };
        },
        transformResponse: (response, meta, arg) => response.data,
        transformErrorResponse: (response, meta, arg) => response.data.errorList,
    }),
        deleteDocumentDefinition: builder.mutation({
            //Delete
            query: (id) => {
              return {
                url: `documentDefinition/${id}`,
                method: "DELETE",
              };
            },
            invalidatesTags: (result, error, arg) => {
              return [{ type: "DocumentDefinition", id: arg?.documentDefinitionId }];
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,
          }),
    })
  
})

export const {useGetAllDocumentDefinitionQuery,useCreateDocumentDefinitionMutation,useDeleteDocumentDefinitionMutation,useGetDocumentDefinitionByIdQuery,useUpdateDocumentDefinitionMutation, useGetAllDocumentDefinitionPagedQuery } = documentDefinitionApiSlice