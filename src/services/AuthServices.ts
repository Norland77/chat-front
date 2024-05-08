import mainApi from "./mainApi";
import {IUser} from "../interfaces/IUser";
import {IRegister} from "../interfaces/IRegister";
import {ILogin} from "../interfaces/ILogin";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ["Login"],
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
        refresh: build.query<{ accessToken: string }, null>({
            query: (token) => ({
                url: '/auth/refresh-tokens',
                credentials: "include"
            }),
            providesTags: ["Login"]
        }),
        logout: build.mutation<string, null>({
            query: (token) => ({
                url: '/auth/logout',
                credentials: "include"
            }),
            invalidatesTags: ["Login"]
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