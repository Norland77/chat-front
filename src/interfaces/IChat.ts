export interface IMessage {
    id: string;
    text: string;
    userId: string;
    roomId: string;
}

export interface IRoom {
    id: string
    name: string
    messages: IMessage[]
}

export interface IRoomCreate {
    name: string
}

export interface IRegister {
    username: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
    password: string;
}