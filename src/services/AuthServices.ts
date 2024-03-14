import mainApi from "./mainApi";
import {IRegister, IUser} from "../interfaces/IChat";

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
        login: build.mutation<{ accessToken: string }, IRegister>({
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
    })
})