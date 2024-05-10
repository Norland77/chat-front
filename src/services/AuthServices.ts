import mainApi from "./mainApi";
import {IUser} from "../interfaces/IUser";
import {IRegister} from "../interfaces/IRegister";
import {ILogin} from "../interfaces/ILogin";
import {IAllUserAgent} from "../interfaces/IAllUserAgent";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ["Login", "Agent"],
})

export const authAPI = enchancedApi.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<IUser, IRegister>({
            query: (dto) => ({
                url: '/auth/register',
                method: 'POST',
                body: dto
            }),
        }),
        login: build.mutation<{ accessToken: string }, ILogin>({
            query: (dto) => ({
                url: '/auth/login',
                method: 'POST',
                body: dto,
                credentials: "include"
            }),
            invalidatesTags: ['Login']
        }),
        loginAgent: build.mutation<{ accessToken: string }, { id: string }>({
            query: (dto) => ({
                url: `/auth/login-userAgent/${dto.id}`,
                method: 'POST',
                credentials: "include"
            }),
            invalidatesTags: ['Agent']
        }),
        deleteAgent: build.mutation<{ accessToken: string }, { id: string }>({
            query: (dto) => ({
                url: `/auth/delete-saved-account/${dto.id}`,
                method: 'POST',
                credentials: "include"
            }),
            invalidatesTags: ['Agent']
        }),
        refresh: build.query<{ accessToken: string }, null>({
            query: (token) => ({
                url: '/auth/refresh-tokens',
                credentials: "include"
            }),
            providesTags: ["Login"]
        }),
        getAllAccount: build.query<IAllUserAgent[], null>({
            query: () => ({
                url: '/auth/all-account',
                credentials: "include"
            }),
            providesTags: ["Agent"]
        }),
        logout: build.mutation<string, null>({
            query: (token) => ({
                url: '/auth/logout',
                credentials: "include"
            }),
            invalidatesTags: ["Login", "Agent"]
        }),
        sendCode: build.mutation<boolean, {email: string}>({
            query: (dto) => ({
                url: '/auth/send-email',
                method: 'POST',
                body: dto,
                credentials: "include"
            }),
        }),
        confirmCode: build.mutation<boolean, {email: string, code: string}>({
            query: (dto) => ({
                url: '/auth/send-email',
                method: 'POST',
                body: dto,
                credentials: "include"
            }),
        }),
    })
})