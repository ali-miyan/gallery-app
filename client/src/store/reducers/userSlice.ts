import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUserUrl } from "../../constants/api";
import { HttpMethod } from "../../schema/enums";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUserUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getImages: builder.query({
      query: () => "/get-images",
    }),
    getUser: builder.query({
      query: () => `/get-user`,
    }),
    getCarById: builder.query({
      query: (id: string) => `/get-car/${id}`,
    }),
    getSelectedCar: builder.query({
      query: (id: string) => `/get-one-car/${id}`,
    }),
    getUserDashboard: builder.query({
      query: () => `/get-dashboard`,
    }),
    registerPost: builder.mutation({
      query: (postData) => ({
        url: "/register",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    loginUser: builder.mutation({
      query: (postData) => ({
        url: "/login",
        method: HttpMethod.POST,
        body: postData,
      }),
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: `/upload-images`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    updateOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-order`,
        method: HttpMethod.PUT,
        body: formData,
      }),
    }),
    updateImage: builder.mutation({
      query: (formData) => ({
        url: `/edit-image`,
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    deleteImages: builder.mutation({
      query: (id:string) => ({
        url: `/delete-image/${id}`,
        method: HttpMethod.DELETE,
      }),
    }),
  }),
});

export const {
  useRegisterPostMutation,
  useLoginUserMutation,
  useGetImagesQuery,
  useGetUserQuery,
  useUploadImagesMutation,
  useUpdateImageMutation,
  useGetCarByIdQuery,
  useGetSelectedCarQuery,
  useDeleteImagesMutation,
  useGetUserDashboardQuery,
  useUpdateOrderMutation
} = userApiSlice;