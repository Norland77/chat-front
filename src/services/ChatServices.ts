import mainApi from "./mainApi";
import {
    IFiles,
    IInvite,
    IInviteCreate,
    IMessage,
    IPersonalRoomCreate,
    IRoom,
    IRoomCreate,
    IUser
} from "../interfaces/IChat";
import {IGetAllImages} from "../interfaces/IGetAllImages";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ['Chat', 'Messages', 'Room'],
})

export const chatAPI = enchancedApi.injectEndpoints({
    endpoints: (build) => ({
        fetchAllRooms: build.query<IRoom[], string>({
            query: (currentToken: string) => ({
                url: '/room/all',
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                }
            }),
            providesTags: ['Chat']
        }),
        createRoom: build.mutation<IRoom, IRoomCreate>({
            query: (info: IRoomCreate) => ({
                url: '/room/create',
                method: 'POST',
                body: info,
                headers: {
                    Authorization: `Bearer ${info.token}`,
                }
            }),
            invalidatesTags: ['Chat']
        }),
        getRoom: build.query<IRoom, {id: string, token: string}>({
            query: ({id, token}: {id: string, token: string}) => ({
                url: `/room/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            providesTags: ['Room']
        }),
        refetchRoom: build.mutation<IRoom, {id: string, token: string}>({
            query: ({id, token}: {id: string, token: string}) => ({
                url: `/room/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            invalidatesTags: ['Room', 'Chat']
        }),
        deleteRoom: build.mutation<IRoom, { id: string, token: string }>({
            query: ({id, token}: { id: string, token: string }) => ({
                url: `/room/delete/${id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            invalidatesTags: ['Chat']
        }),
        deleteMessage: build.mutation<IMessage, { id: string, token: string }>({
            query: ({id, token}: { id: string, token: string }) => ({
                url: `/message/delete/${id}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            invalidatesTags: ['Messages']
        }),
        fetchAllMessages: build.mutation<IMessage[], {id?: string, token: string}>({
            query: ({id, token}: {id?: string, token: string}) => ({
                url: `/message/all/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            invalidatesTags: ['Messages']
        }),
        createInvite: build.mutation<IInvite, {dto: IInviteCreate, token: string}>({
            query: ({dto, token}: {dto: IInviteCreate, token: string}) => ({
                url: '/invite/create',
                method: 'POST',
                body: dto,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
        }),
        leaveRoom: build.mutation<IRoom, {roomId: string, token: string, userId: string}>({
            query: ({roomId, token, userId}: {roomId: string, token: string, userId: string}) => ({
                url: `/room/leave/${roomId}`,
                method: 'PUT',
                body: {userId: userId},
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
            invalidatesTags: ['Chat', 'Room']
        }),
        acceptInvite: build.mutation<IInvite, {roomId: string, token: string, userId: string}>({
            query: ({roomId, token, userId}: {roomId: string, token: string, userId: string}) => ({
                url: `/invite/accept/${roomId}`,
                method: 'PUT',
                body: {userId: userId},
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
        }),
        getInviteRoom: build.query<IInvite, {tokenn: string, token: string}>({
            query: ({tokenn, token}: {tokenn: string, token: string}) => ({
                url: `/invite/token/${tokenn}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
        }),
        getAllUsers: build.query<IUser[], {token: string}>({
            query: ({token}: {token: string}) => ({
                url: `/user/all`,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }),
        }),
        createPersonalRoom: build.mutation<IRoom, IPersonalRoomCreate>({
            query: (dto: IPersonalRoomCreate) => ({
                url: '/room/create/personal',
                method: 'POST',
                body: dto,
                headers: {
                    Authorization: `Bearer ${dto.token}`,
                }
            }),
            invalidatesTags: ['Chat']
        }),
        getAllImagesByRoom: build.query<IFiles[], IGetAllImages>({
            query: (dto: IGetAllImages) => ({
                url: `/message/images/${dto.roomId}`,
                headers: {
                    Authorization: `Bearer ${dto.accessToken}`,
                }
            }),
            providesTags: ['Chat']
        }),
    })
})