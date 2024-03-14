export interface IMessage {
    id: string;
    text: string;
    username: string;
    userId: string;
    roomId: string;
    files: IFiles[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IFiles {
    createdAt: Date;
    id: string;
    messagesId: string;
    mimetype: string;
    name: string;
    path: string;
}

export interface IRoom {
    id: string
    name: string
    ownerId: string
    isPrivate: boolean
    isPersonal: boolean
    inviteLink: string
    messages: IMessage[]
    users: IUser[]
}

export interface IPersonalRoomCreate {
    name: string;
    firstUserId: string;
    secondUserId: string;
    isPrivate: boolean;
    isPersonal: boolean;
    token: string
}

export interface IRoomCreate {
    name: string,
    ownerId: string,
    isPrivate: boolean,
    token: string
}

export interface IRegister {
    username: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
}

export interface IInvite {
    id: string
    roomId: string
    token: string
    accept: boolean
    room: IRoom
}
export interface IInviteCreate {
    roomId: string
    token: string
    accept: boolean
    inviteLink: string
}
