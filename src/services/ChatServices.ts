import mainApi from "./mainApi";
import {IRegister, IRoom, IRoomCreate, IUser} from "../interfaces/IChat";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ['Chat'],
})

export const chatAPI = enchancedApi.injectEndpoints({
    endpoints: (build) => ({
        fetchAllRooms: build.query<IRoom[], null>({
            query: () => ({
                url: '/room/all'
            }),
            providesTags: ['Chat']
        }),
        createRoom: build.mutation<IRoom, IRoomCreate>({
            query: (name) => ({
                url: '/room/create',
                method: 'POST',
                body: name
            }),
            invalidatesTags: ['Chat']
        }),
        register: build.mutation<IUser, IRegister>({
            query: (dto) => ({
                url: '/auth/register',
                method: 'POST',
                body: dto
            }),
        }),
    })
})