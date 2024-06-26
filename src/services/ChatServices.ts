import mainApi from "./mainApi";
import {IGetAllImages} from "../interfaces/IGetAllImages";
import {IRoom} from "../interfaces/IRoom";
import {IRoomCreate} from "../interfaces/IRoomCreate";
import {IMessage} from "../interfaces/IMessage";
import {IInvite} from "../interfaces/IInvite";
import {IInviteCreate} from "../interfaces/IInviteCreate";
import {IUser} from "../interfaces/IUser";
import {IUserEdit} from "../interfaces/IUserEdit";
import {IPersonalRoomCreate} from "../interfaces/IPersonalRoomCreate";
import {IFiles} from "../interfaces/IFiles";

const enchancedApi = mainApi.enhanceEndpoints({
    addTagTypes: ['Chat', 'Messages', 'Room', 'User'],
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
        getUserById: build.query<IUser, {accessToken: string, id: string | undefined}>({
            query: ({accessToken, id}: {accessToken: string, id: string | undefined}) => ({
                url: `/user/${id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }),
            providesTags: ['User']
        }),
        getUserByIdMutation: build.mutation<IUser, {accessToken: string, id: string | undefined}>({
            query: ({accessToken, id}: {accessToken: string, id: string | undefined}) => ({
                url: `/user/${id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }),
        }),
        editUserById: build.mutation<IUser, {accessToken: string, dto: IUserEdit}>({
            query: ({accessToken, dto}: {accessToken: string, dto: IUserEdit}) => ({
                url: `/user/${dto.id}`,
                method: 'PUT',
                body: dto,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }),
            invalidatesTags: ['User']
        }),
        fetchUser: build.mutation<IUser, {accessToken: string, id: string}>({
            query: ({accessToken, id}: {accessToken: string, id: string}) => ({
                url: `/user/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }),
            invalidatesTags: ['User']
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