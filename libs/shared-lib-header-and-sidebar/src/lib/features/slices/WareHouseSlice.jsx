import React from 'react'
import { apiSlice_WareHouse } from './apiWarehouse-slice';


export const WareHouseSlice = apiSlice_WareHouse.injectEndpoints({
    endpoints: (builder) => ({
        CreateMaintenanceCenter: builder.mutation({
            invalidatesTags: ['MaintenanceCenter'],
            query: (args) => {
                const { MaintenanceCenter } = args;
                console.log("MaintenanceCenter", MaintenanceCenter)
                return {
                    url: 'MaintenanceCenter',
                    body: MaintenanceCenter,
                    method: 'POST'
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

        }),
        CreateGoodFeatures: builder.mutation({
            invalidatesTags: ['GoodFeatures'],
            query: (args) => {
                const { GoodFeatures } = args;
                return {
                    url: 'GoodFeature',
                    body: GoodFeatures,
                    method: 'POST'
                };
            },
            transformResponse: (response, meta, arg) => response.data,
            transformErrorResponse: (response, meta, arg) => response.data.errorList,

        })
    })
})
export const { useCreateMaintenanceCenterMutation, useCreateGoodFeaturesMutation } = WareHouseSlice


