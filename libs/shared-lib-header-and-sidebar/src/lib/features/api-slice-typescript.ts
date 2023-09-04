// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// interface ResponseViewModelBase {
//     statusCode: number;
//     time: Date;
//     errorList: string[];
// }
// interface Settings extends ResponseViewModelBase{
//     data: {
//         branchId: number;
//         groupLength: number;
//         kolLength: number;
//         moeinLength: number;
//         detailedLength: number;
//     }[];
// }

// export const apiSlice = createApi({
//     reducerPath: 'testAPI',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'https://localhost:44323/api'

//     }),
//     endpoints(builder){
//         return {
//             fetchSettings: builder.query<Settings, void> ({
//                 query: () => {
//                     return {
//                         url: '/CommonSystemSettings',
//                         method: 'get'
//                     }
//                 },
//             })
//         }
//     }
// });

// export const { useFetchSettingsQuery } = apiSlice;