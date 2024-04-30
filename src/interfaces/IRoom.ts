import {IUser} from "./IUser";
import {IMessage} from "./IMessage";

export interface IRoom {
  id: string
  name: string
  ownerId: string
  isPrivate: boolean
  isPersonal: boolean
  inviteLink: string
  firstUserId?: string;
  secondUserId?: string;
  avatar_url?: string;
  messages: IMessage[]
  users: IUser[]
}